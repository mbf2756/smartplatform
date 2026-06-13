"use client";
// ─────────────────────────────────────────────────────────────────────────────
// usePortfolio — central state hook for portfolio + analysis
// Reads/writes to Supabase when authenticated; localStorage when anonymous.
// Used by both SmartETF and SmartSuper dashboard pages.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { analysePortfolio, optimisePortfolio, generateSIPPlan, buildRetirementScenarios } from "@/lib/analysis";
import { ETF_DB } from "@/data/etfDatabase";
import { SUPER_FUND_LIST } from "@/data/superFunds";
import type {
  FinancialProfile, ETFHolding, PortfolioAnalysis,
  OptimiserGoal, OptimiserResult, SIPItem, UserProfile,
} from "@/types";

// ── Default profile ───────────────────────────────────────────────────────────
const DEFAULT_PROFILE: FinancialProfile = {
  age: 38,
  annualIncome: 120000,
  riskProfile: "growth",
  monthlyContrib: 1500,
  retirementGoalAge: 55,
  portfolio: {
    name: "My Portfolio",
    holdings: [
      { ticker:"VGS",  balance:45000, targetPct:35 },
      { ticker:"BGBL", balance:32000, targetPct:0  },
      { ticker:"NDQ",  balance:28000, targetPct:20 },
      { ticker:"VAS",  balance:22000, targetPct:25 },
    ],
    totalBalance: 127000,
  },
  superProfile: {
    fundId: "hostplus-balanced",
    balance: 95000,
    concessionalContrib: 15000,
    nonConcessionalContrib: 0,
    tsb: 95000,
    yearOfBirth: 1986,
  },
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export function usePortfolio() {
  const supabase = createClient();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<FinancialProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);

  // ── Auth ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({ id: u.id, email: u.email!, tier: "free", createdAt: "", updatedAt: "" });
        loadProfile(u.id);
      } else {
        // Load from localStorage for anonymous users
        const saved = localStorage.getItem("smartplatform-profile");
        if (saved) {
          try { setProfile(JSON.parse(saved)); } catch {}
        }
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser({ id:session.user.id, email:session.user.email!, tier:"free", createdAt:"", updatedAt:"" });
        loadProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load profile from Supabase ──────────────────────────────────────────────
  const loadProfile = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const [fpRes, portRes, superRes, profRes] = await Promise.all([
        supabase.from("financial_profiles").select("*").eq("user_id", userId).single(),
        supabase.from("portfolios").select("*, etf_holdings(*)").eq("user_id", userId).single(),
        supabase.from("super_profiles").select("*").eq("user_id", userId).single(),
        supabase.from("profiles").select("*").eq("id", userId).single(),
      ]);

      const loaded: Partial<FinancialProfile> = {};

      if (fpRes.data) {
        loaded.age = fpRes.data.age;
        loaded.annualIncome = fpRes.data.annual_income;
        loaded.riskProfile = fpRes.data.risk_profile;
        loaded.monthlyContrib = fpRes.data.monthly_contrib;
        loaded.retirementGoalAge = fpRes.data.retirement_goal_age;
      }

      if (portRes.data) {
        const holdings: ETFHolding[] = (portRes.data.etf_holdings ?? []).map((h: any) => ({
          ticker: h.ticker,
          balance: h.balance / 100,        // stored as cents
          targetPct: h.target_pct,
          costBase: h.cost_base ? h.cost_base / 100 : undefined,
          purchaseDate: h.purchase_date,
        }));
        loaded.portfolio = {
          id: portRes.data.id,
          name: portRes.data.name,
          holdings,
          totalBalance: holdings.reduce((s, h) => s + h.balance, 0),
        };
      }

      if (superRes.data) {
        loaded.superProfile = {
          fundId: superRes.data.fund_id,
          balance: superRes.data.balance / 100,
          concessionalContrib: superRes.data.concessional_contrib / 100,
          nonConcessionalContrib: superRes.data.non_concessional_contrib / 100,
          tsb: superRes.data.tsb / 100,
          yearOfBirth: superRes.data.year_of_birth,
        };
      }

      if (profRes.data) {
        setUser({
          id: profRes.data.id, email: profRes.data.email,
          tier: profRes.data.tier, firstName: profRes.data.first_name,
          lastName: profRes.data.last_name, createdAt: profRes.data.created_at,
          updatedAt: profRes.data.updated_at,
        });
        setIsSubscriber(profRes.data.tier !== "free");
      }

      setProfile(p => ({ ...p, ...loaded }));
    } catch (e) {
      console.error("Error loading profile:", e);
    }
    setLoading(false);
  }, [supabase]);

  // ── Save profile ────────────────────────────────────────────────────────────
  const saveProfile = useCallback(async (updates: Partial<FinancialProfile>) => {
    const next = { ...profile, ...updates };
    setProfile(next);

    if (!user) {
      // Anonymous — save to localStorage
      localStorage.setItem("smartplatform-profile", JSON.stringify(next));
      return;
    }

    setSaving(true);
    try {
      // Upsert financial_profiles
      await supabase.from("financial_profiles").upsert({
        user_id: user.id,
        age: next.age,
        annual_income: next.annualIncome,
        risk_profile: next.riskProfile,
        monthly_contrib: next.monthlyContrib,
        retirement_goal_age: next.retirementGoalAge,
        fire_target: next.fireTarget,
      }, { onConflict: "user_id" });

      // Upsert super profile
      if (next.superProfile) {
        await supabase.from("super_profiles").upsert({
          user_id: user.id,
          fund_id: next.superProfile.fundId,
          balance: Math.round(next.superProfile.balance * 100),
          concessional_contrib: Math.round(next.superProfile.concessionalContrib * 100),
          non_concessional_contrib: Math.round(next.superProfile.nonConcessionalContrib * 100),
          tsb: Math.round(next.superProfile.tsb * 100),
          year_of_birth: next.superProfile.yearOfBirth,
        }, { onConflict: "user_id" });
      }

      // Upsert portfolio + holdings
      if (next.portfolio) {
        const { data: portData } = await supabase.from("portfolios").upsert({
          ...(next.portfolio.id ? { id: next.portfolio.id } : {}),
          user_id: user.id, name: next.portfolio.name,
        }, { onConflict: "id" }).select().single();

        const portId = portData?.id ?? next.portfolio.id;
        if (portId && next.portfolio.holdings.length) {
          await supabase.from("etf_holdings").upsert(
            next.portfolio.holdings.map(h => ({
              portfolio_id: portId, user_id: user.id,
              ticker: h.ticker,
              balance: Math.round(h.balance * 100),
              target_pct: h.targetPct,
              cost_base: h.costBase ? Math.round(h.costBase * 100) : null,
              purchase_date: h.purchaseDate,
            })),
            { onConflict: "portfolio_id,ticker" }
          );
        }
      }
    } catch (e) {
      console.error("Error saving profile:", e);
    }
    setSaving(false);
  }, [user, profile, supabase]);

  // ── Holdings helpers ─────────────────────────────────────────────────────────
  const addHolding = useCallback((ticker: string, balance: number) => {
    if (!ETF_DB[ticker]) return;
    const holdings = profile.portfolio?.holdings ?? [];
    const existing = holdings.find(h => h.ticker === ticker);
    const next = existing
      ? holdings.map(h => h.ticker === ticker ? { ...h, balance } : h)
      : [...holdings, { ticker, balance, targetPct: 0 }];
    saveProfile({ portfolio: { ...profile.portfolio!, holdings: next, name: profile.portfolio?.name ?? "My Portfolio", totalBalance: next.reduce((s,h)=>s+h.balance,0) } });
  }, [profile, saveProfile]);

  const updateHolding = useCallback((ticker: string, updates: Partial<ETFHolding>) => {
    const holdings = (profile.portfolio?.holdings ?? []).map(h =>
      h.ticker === ticker ? { ...h, ...updates } : h
    );
    saveProfile({ portfolio: { ...profile.portfolio!, holdings, totalBalance: holdings.reduce((s,h)=>s+h.balance,0), name: profile.portfolio?.name ?? "My Portfolio" } });
  }, [profile, saveProfile]);

  const removeHolding = useCallback((ticker: string) => {
    const holdings = (profile.portfolio?.holdings ?? []).filter(h => h.ticker !== ticker);
    saveProfile({ portfolio: { ...profile.portfolio!, holdings, totalBalance: holdings.reduce((s,h)=>s+h.balance,0), name: profile.portfolio?.name ?? "My Portfolio" } });
  }, [profile, saveProfile]);

  // ── Computed analysis ────────────────────────────────────────────────────────
  const analysis = useMemo(() => analysePortfolio(profile), [profile]);

  const getOptimiserResult = useCallback((goal: OptimiserGoal): OptimiserResult | null => {
    if (!analysis) return null;
    return optimisePortfolio(goal, profile, analysis);
  }, [analysis, profile]);

  const sipPlan: SIPItem[] = useMemo(() => {
    if (!analysis) return [];
    return generateSIPPlan(profile, analysis);
  }, [analysis, profile]);

  const retirementScenarios = useMemo(() => {
    if (!analysis) return [];
    return buildRetirementScenarios(profile, analysis);
  }, [analysis, profile]);

  return {
    user, profile, analysis, sipPlan, retirementScenarios,
    loading, saving, isSubscriber, setIsSubscriber,
    saveProfile, addHolding, updateHolding, removeHolding, getOptimiserResult,
    superFundList: SUPER_FUND_LIST,
    supportedTickers: Object.keys(ETF_DB),
  };
}
