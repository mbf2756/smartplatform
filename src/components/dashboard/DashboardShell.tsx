"use client";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HealthScorePage from "@/components/dashboard/HealthScorePage";
import OverlapPage from "@/components/dashboard/OverlapPage";
import ExposurePage from "@/components/dashboard/ExposurePage";
import OptimiserPage from "@/components/dashboard/OptimiserPage";
import SIPPage from "@/components/dashboard/SIPPage";
import ScenariosPage from "@/components/dashboard/ScenariosPage";
import PortfolioSettings from "@/components/dashboard/PortfolioSettings";
import { createClient } from "@/lib/supabase";
import { ETF_DB } from "@/data/etfDatabase";
import { SUPER_FUNDS } from "@/data/superFunds";
import type { FinancialProfile, ETFHolding } from "@/types";

const DEFAULT_PROFILE: FinancialProfile = {
  age: 38,
  annualIncome: 120000,
  riskProfile: "growth",
  monthlyContrib: 1500,
  retirementGoalAge: 55,
  portfolio: {
    name:"My Portfolio",
    holdings:[
      { ticker:"VGS",  balance:45000, targetPct:35 },
      { ticker:"BGBL", balance:32000, targetPct:0  },
      { ticker:"NDQ",  balance:28000, targetPct:20 },
      { ticker:"VAS",  balance:22000, targetPct:25 },
    ],
    totalBalance:127000,
  },
  superProfile:{
    fundId:"hostplus-balanced",
    balance:95000,
    concessionalContrib:15000,
    nonConcessionalContrib:0,
    tsb:95000,
    yearOfBirth:1986,
  },
};

// Route → component map
const ROUTE_MAP: Record<string, string> = {
  "/dashboard":  "health",
  "/overlap":    "overlap",
  "/exposure":   "exposure",
  "/optimiser":  "optimiser",
  "/sip":        "sip",
  "/scenarios":  "scenarios",
  "/settings":   "settings",
};

export default function SmartETFDashboard() {
  const pathname = usePathname();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<FinancialProfile>(DEFAULT_PROFILE);
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [loading, setLoading] = useState(true);

  const activePage = ROUTE_MAP[pathname] ?? "health";

  // Auth + profile load
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser(u);
        loadProfile(u.id);
      } else {
        const saved = localStorage.getItem("smartetf-profile");
        if (saved) { try { setProfile(JSON.parse(saved)); } catch {} }
        setLoading(false);
      }
    });
  }, []);

  async function loadProfile(userId: string) {
    try {
      const [fpRes, portRes, superRes, subRes] = await Promise.all([
        supabase.from("financial_profiles").select("*").eq("user_id",userId).single(),
        supabase.from("portfolios").select("*,etf_holdings(*)").eq("user_id",userId).single(),
        supabase.from("super_profiles").select("*").eq("user_id",userId).single(),
        supabase.from("subscriptions").select("*").eq("user_id",userId).eq("status","active").maybeSingle(),
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
          ticker:h.ticker, balance:h.balance/100, targetPct:h.target_pct,
        }));
        loaded.portfolio = { id:portRes.data.id, name:portRes.data.name,
          holdings, totalBalance:holdings.reduce((s,h)=>s+h.balance,0) };
      }
      if (superRes.data) {
        loaded.superProfile = {
          fundId:superRes.data.fund_id, balance:superRes.data.balance/100,
          concessionalContrib:superRes.data.concessional_contrib/100,
          nonConcessionalContrib:superRes.data.non_concessional_contrib/100,
          tsb:superRes.data.tsb/100, yearOfBirth:superRes.data.year_of_birth,
        };
      }
      if (subRes.data) setIsSubscriber(true);
      setProfile(p => ({...p,...loaded}));
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function saveProfile(updates: Partial<FinancialProfile>) {
    const next = {...profile,...updates};
    setProfile(next);
    if (!user) { localStorage.setItem("smartetf-profile",JSON.stringify(next)); return; }
    try {
      await supabase.from("financial_profiles").upsert({
        user_id:user.id, age:next.age, annual_income:next.annualIncome,
        risk_profile:next.riskProfile, monthly_contrib:next.monthlyContrib,
        retirement_goal_age:next.retirementGoalAge,
      },{onConflict:"user_id"});
      if (next.superProfile) {
        await supabase.from("super_profiles").upsert({
          user_id:user.id, fund_id:next.superProfile.fundId,
          balance:Math.round(next.superProfile.balance*100),
          concessional_contrib:Math.round(next.superProfile.concessionalContrib*100),
          non_concessional_contrib:Math.round(next.superProfile.nonConcessionalContrib*100),
          tsb:Math.round(next.superProfile.tsb*100),
          year_of_birth:next.superProfile.yearOfBirth,
        },{onConflict:"user_id"});
      }
      if (next.portfolio?.holdings) {
        const {data: portData} = await supabase.from("portfolios").upsert({
          ...(next.portfolio.id?{id:next.portfolio.id}:{}),
          user_id:user.id, name:next.portfolio.name||"My Portfolio",
        },{onConflict:"id"}).select().single();
        const portId = portData?.id || next.portfolio.id;
        if (portId) {
          await supabase.from("etf_holdings").upsert(
            next.portfolio.holdings.map(h=>({
              portfolio_id:portId, user_id:user.id, ticker:h.ticker,
              balance:Math.round(h.balance*100), target_pct:h.targetPct,
            })),{onConflict:"portfolio_id,ticker"}
          );
        }
      }
    } catch(e) { console.error(e); }
  }

  if (loading) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        background:"#F7F8FA",fontFamily:"-apple-system,sans-serif"}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:36,height:36,border:"3px solid #E5E7EB",borderTopColor:"#1D9E75",
            borderRadius:"50%",margin:"0 auto 12px",animation:"spin 0.8s linear infinite"}}/>
          <div style={{fontSize:14,color:"#6B7280"}}>Loading your portfolio…</div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const pageProps = { profile, isSubscriber, onUnlock:()=>setIsSubscriber(true), saveProfile };

  return (
    <DashboardLayout isSubscriber={isSubscriber} userEmail={user?.email}>
      {activePage==="health"    && <HealthScorePage {...pageProps}/>}
      {activePage==="overlap"   && <OverlapPage {...pageProps}/>}
      {activePage==="exposure"  && <ExposurePage {...pageProps}/>}
      {activePage==="optimiser" && <OptimiserPage {...pageProps}/>}
      {activePage==="sip"       && <SIPPage {...pageProps}/>}
      {activePage==="scenarios" && <ScenariosPage {...pageProps}/>}
      {activePage==="settings"  && <PortfolioSettings {...pageProps}/>}
    </DashboardLayout>
  );
}
