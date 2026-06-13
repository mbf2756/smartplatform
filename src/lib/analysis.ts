// ─────────────────────────────────────────────────────────────────────────────
// Portfolio Analysis Engine
// Pure computation — no React, no side effects.
// Used by both SmartETF and SmartSuper.
// ─────────────────────────────────────────────────────────────────────────────

import { ETF_DB, getOverlap } from "@/data/etfDatabase";
import { SUPER_FUNDS } from "@/data/superFunds";
import type {
  ETFHolding, FinancialProfile, PortfolioAnalysis,
  HealthScores, PortfolioIssue, PortfolioStrength,
  GeographicExposure, SectorExposure, OverlapPair,
  FeeAnalysis, OptimiserGoal, OptimiserResult, OptimisedHolding,
  ActionItem, SIPItem,
} from "@/types";

// ── Geographic colour map ─────────────────────────────────────────────────
const GEO_COLORS: Record<string, string> = {
  US:"#378ADD", AU:"#1D9E75", Europe:"#7F77DD",
  Japan:"#EF9F27", EM:"#D85A30", Other:"#888780",
};

// ── Main analysis entry point ─────────────────────────────────────────────
export function analysePortfolio(profile: FinancialProfile): PortfolioAnalysis | null {
  const holdings = profile.portfolio?.holdings ?? [];
  const activeHoldings = holdings.filter(h => h.balance > 0 && ETF_DB[h.ticker]);
  if (!activeHoldings.length) return null;

  const totalBrokerage = activeHoldings.reduce((s, h) => s + h.balance, 0);
  const superBalance = profile.superProfile?.balance ?? 0;
  const totalPortfolio = totalBrokerage + superBalance;
  const superFundId = profile.superProfile?.fundId;
  const superFund = superFundId ? SUPER_FUNDS[superFundId] : undefined;

  // ── Overlap pairs ───────────────────────────────────────────────────────
  const overlapPairs: OverlapPair[] = [];
  for (let i = 0; i < activeHoldings.length; i++) {
    for (let j = i + 1; j < activeHoldings.length; j++) {
      const a = activeHoldings[i].ticker;
      const b = activeHoldings[j].ticker;
      const pct = getOverlap(a, b);
      if (pct > 15) {
        overlapPairs.push({
          etfA: a, etfB: b, overlapPct: pct,
          severity: pct > 70 ? "high" : pct > 35 ? "medium" : "low",
        });
      }
    }
  }
  overlapPairs.sort((a, b) => b.overlapPct - a.overlapPct);

  // ── Scores ──────────────────────────────────────────────────────────────
  const overlapScore = Math.max(0,
    100 - overlapPairs.reduce((s, p) => s + p.overlapPct * 0.35, 0)
  );

  // Blended MER
  const blendedMerRaw = activeHoldings.reduce(
    (s, h) => s + (ETF_DB[h.ticker].mer / 100) * (h.balance / totalBrokerage), 0
  );
  const feeScore = Math.max(0, 100 - (blendedMerRaw - 0.0008) * 8000);

  // Geographic consolidation
  const geoRaw: Record<string, number> = { US:0, AU:0, Europe:0, Japan:0, EM:0, Other:0 };
  activeHoldings.forEach(h => {
    const w = h.balance / totalBrokerage;
    const g = ETF_DB[h.ticker].geo;
    Object.keys(geoRaw).forEach(r => {
      geoRaw[r] += ((g as Record<string, number>)[r] ?? 0) * w;
    });
  });

  // Add super fund geo exposure (weighted by portfolio share)
  if (superFund && superBalance > 0) {
    const sw = superBalance / totalPortfolio;
    geoRaw.AU   += (superFund.geo.AU ?? 0) * sw;
    geoRaw.US   += (superFund.geo.US ?? 0) * sw;
    geoRaw.EM   += (superFund.geo.EM ?? 0) * sw;
    geoRaw.Europe += ((superFund.geo.Global ?? 0) * 0.4) * sw;
    geoRaw.Other  += (superFund.geo.Other ?? 0) * sw;
  }

  // Sector consolidation
  const sectorRaw: Record<string, number> = {};
  activeHoldings.forEach(h => {
    const w = h.balance / totalBrokerage;
    const s = ETF_DB[h.ticker].sectors;
    Object.entries(s as Record<string, number>).forEach(([sector, pct]) => {
      sectorRaw[sector] = (sectorRaw[sector] ?? 0) + pct * w;
    });
  });

  const hasEM = activeHoldings.some(h => ETF_DB[h.ticker].category === "EM")
    || (geoRaw.EM > 8);
  const hasSmallCap = activeHoldings.some(h =>
    ["AU Small", "US Small"].includes(ETF_DB[h.ticker].category)
  );
  const techPct = sectorRaw.Tech ?? 0;
  const auPct = geoRaw.AU;

  let divScore = 60;
  if (hasEM) divScore += 12;
  if (hasSmallCap) divScore += 10;
  if (auPct < 40 && auPct > 8) divScore += 10;
  if (techPct < 38) divScore += 8;
  divScore = Math.min(100, divScore);

  let superScore = 70;
  if (superFund && superBalance > 0) {
    const superAuPct = superFund.geo.AU ?? 0;
    const combinedAu = (auPct * totalBrokerage + superAuPct * superBalance) / totalPortfolio;
    if (combinedAu > 45) superScore -= 25;
    else if (combinedAu < 15) superScore -= 10;
    else superScore += 15;
    const hasHeavyOverlap = Object.keys(superFund.etfEquivalent ?? {})
      .some(sk => activeHoldings.some(h => h.ticker === sk));
    if (hasHeavyOverlap) superScore -= 15;
  }
  superScore = Math.max(0, Math.min(100, superScore));

  let ageScore = 80;
  if (profile.age > 55 && profile.riskProfile === "aggressive") ageScore -= 20;
  if (profile.age < 35 && profile.riskProfile === "conservative") ageScore -= 15;

  const healthScores: HealthScores = {
    composite: Math.round(
      overlapScore * 0.28 + feeScore * 0.22 +
      divScore * 0.22 + superScore * 0.18 + ageScore * 0.10
    ),
    overlap: Math.round(overlapScore),
    fee: Math.round(feeScore),
    diversification: Math.round(divScore),
    superAlignment: superScore,
    ageRisk: ageScore,
  };

  // ── Issues ───────────────────────────────────────────────────────────────
  const issues: PortfolioIssue[] = [];

  if (overlapPairs[0]?.overlapPct > 85)
    issues.push({
      severity:"high", category:"overlap",
      message:`${overlapPairs[0].overlapPct}% overlap between ${overlapPairs[0].etfA} and ${overlapPairs[0].etfB} — near-identical funds`,
      impact:"You pay two MERs for essentially the same index exposure",
    });
  else if (overlapPairs[0]?.overlapPct > 50)
    issues.push({
      severity:"high", category:"overlap",
      message:`${overlapPairs[0].overlapPct}% overlap between ${overlapPairs[0].etfA} and ${overlapPairs[0].etfB}`,
      impact:"Significant duplication in top holdings — Apple, Microsoft, NVIDIA held twice",
    });

  if (overlapPairs.filter(p => p.overlapPct > 30).length > 1)
    issues.push({
      severity:"medium", category:"overlap",
      message:`${overlapPairs.filter(p => p.overlapPct > 30).length} ETF pairs with significant duplication`,
      impact:"Portfolio is less diversified than the number of funds suggests",
    });

  if (!hasEM)
    issues.push({
      severity:"medium", category:"diversification",
      message:"No emerging markets exposure — China, India, SE Asia missing",
      impact:"Missing ~13% of global market cap and key long-run growth engines",
    });

  if (!hasSmallCap)
    issues.push({
      severity:"low", category:"diversification",
      message:"No small-cap allocation",
      impact:"Missing ~20% of global market cap and the historical small-cap premium",
    });

  if (techPct > 38)
    issues.push({
      severity:"high", category:"concentration",
      message:`Tech sector at ${Math.round(techPct)}% — concentration risk`,
      impact:"Single-sector drawdown of 30–50% would significantly impact portfolio",
    });

  if (auPct > 42)
    issues.push({
      severity:"medium", category:"diversification",
      message:`AU equities at ${Math.round(auPct)}% (incl. super) — home country bias`,
      impact:"Australia is 2% of global market cap — significant overweight",
    });

  const dragDiff = blendedMerRaw - 0.0008;
  const feeDrag10 = totalBrokerage * (Math.pow(1.08, 10) - Math.pow(1.08 - blendedMerRaw, 10));
  if (dragDiff * 100 > 0.15)
    issues.push({
      severity:"medium", category:"fee",
      message:`Blended MER ${(blendedMerRaw * 100).toFixed(2)}% — fee drag ~$${Math.round(feeDrag10 / 1000)}K over 10 years`,
      impact:"Switching to lower-MER equivalents would save this amount compounded",
    });

  // ── Strengths ─────────────────────────────────────────────────────────────
  const strengths: PortfolioStrength[] = [];
  if (feeScore > 80)
    strengths.push({ category:"Fee efficiency", message:"Low-cost ETF selection — fees well below industry average" });
  if (hasEM)
    strengths.push({ category:"Diversification", message:"Emerging markets exposure — taps China, India, SE Asia growth" });
  if (hasSmallCap)
    strengths.push({ category:"Diversification", message:"Small-cap allocation adds the historical size premium" });
  if (!overlapPairs.length)
    strengths.push({ category:"Construction", message:"Zero significant overlap — highly efficient portfolio construction" });
  if (auPct > 8 && auPct < 38)
    strengths.push({ category:"Balance", message:"Well-calibrated home bias — appropriate AU equities weight" });

  // ── Geographic & sector exposure output ──────────────────────────────────
  const geoExposure: GeographicExposure[] = Object.entries(geoRaw)
    .filter(([, v]) => v > 0.5)
    .sort((a, b) => b[1] - a[1])
    .map(([region, pct]) => ({
      region, pct: Math.round(pct * 10) / 10,
      color: GEO_COLORS[region] ?? "#888780",
    }));

  const sectorExposure: SectorExposure[] = Object.entries(sectorRaw)
    .sort((a, b) => b[1] - a[1])
    .map(([sector, pct]) => ({ sector, pct: Math.round(pct * 10) / 10 }));

  // ── Fee analysis ─────────────────────────────────────────────────────────
  const feeDrag20 = totalBrokerage * (Math.pow(1.08, 20) - Math.pow(1.08 - blendedMerRaw, 20));
  const cheapestMer = 0.0004; // A200 equivalent
  const savings10yr = totalBrokerage * (Math.pow(1.08 - cheapestMer, 10) - Math.pow(1.08 - blendedMerRaw, 10));

  const feeAnalysis: FeeAnalysis = {
    blendedMerPct: Math.round(blendedMerRaw * 10000) / 100,
    feeDrag10yr: Math.round(feeDrag10),
    feeDrag20yr: Math.round(feeDrag20),
    annualFeeCost: Math.round(totalBrokerage * blendedMerRaw),
    cheapestEquivalentMer: cheapestMer * 100,
    savingsPotential10yr: Math.round(savings10yr),
  };

  // ── Factor exposure ────────────────────────────────────────────────────────
  const growthTilt = Math.round(
    activeHoldings.reduce((s, h) => {
      const w = h.balance / totalBrokerage;
      return s + (ETF_DB[h.ticker].factors.growth) * w;
    }, 0)
  );
  const qualityScore = Math.round(
    activeHoldings.reduce((s, h) => {
      const w = h.balance / totalBrokerage;
      return s + (ETF_DB[h.ticker].factors.quality) * w;
    }, 0)
  );
  const largeCapPct = Math.round(
    activeHoldings.filter(h => !["AU Small","US Small"].includes(ETF_DB[h.ticker].category)).length
    / activeHoldings.length * 100
  );

  return {
    healthScores, issues, strengths, overlapPairs,
    geoExposure, sectorExposure, feeAnalysis,
    factorExposure: { growthTilt, valueTilt: 100 - growthTilt, qualityScore, largeCapPct },
    hasEMExposure: hasEM, hasSmallCap, etfKeys: activeHoldings.map(h => h.ticker),
    totalBrokerage, totalPortfolio,
  };
}

// ── Portfolio optimiser ───────────────────────────────────────────────────
const OPTIMISER_CONFIGS: Record<OptimiserGoal, {
  label: string; description: string;
  mix: OptimisedHolding[]; blendedMer: number; projectedReturn: number;
}> = {
  minimiseFees: {
    label:"Minimise fees", description:"Lowest possible MER while maintaining broad diversification",
    blendedMer:0.11, projectedReturn:8.2,
    mix:[
      {ticker:"BGBL", targetPct:45, rationale:"Lowest-cost global developed (0.08% MER)"},
      {ticker:"A200", targetPct:30, rationale:"Lowest-cost AU equities (0.04% MER)"},
      {ticker:"VGE",  targetPct:15, rationale:"EM exposure at 0.48%"},
      {ticker:"IJR",  targetPct:10, rationale:"US small-cap at 0.07% MER"},
    ],
  },
  maximiseDiversification: {
    label:"Maximise diversification", description:"Broadest possible exposure across all geographies, sizes, and factors",
    blendedMer:0.27, projectedReturn:8.5,
    mix:[
      {ticker:"VGS",  targetPct:35, rationale:"Core global developed exposure"},
      {ticker:"VAS",  targetPct:20, rationale:"AU equities with dividend income"},
      {ticker:"VGE",  targetPct:15, rationale:"Emerging markets growth"},
      {ticker:"VSO",  targetPct:10, rationale:"AU small-cap premium"},
      {ticker:"QUAL", targetPct:10, rationale:"Quality factor tilt"},
      {ticker:"IJR",  targetPct:10, rationale:"US small-cap premium"},
    ],
  },
  maximiseGrowth: {
    label:"Maximise growth", description:"Highest expected long-run return with quality company tilt",
    blendedMer:0.31, projectedReturn:10.1,
    mix:[
      {ticker:"NDQ",  targetPct:35, rationale:"Nasdaq-100 growth tilt — compounding tech leaders"},
      {ticker:"QUAL", targetPct:25, rationale:"Quality factor — high ROIC companies outperform long-run"},
      {ticker:"VGS",  targetPct:20, rationale:"Broad global diversification base"},
      {ticker:"VGE",  targetPct:15, rationale:"EM growth engines: China, India, SE Asia"},
      {ticker:"VSO",  targetPct:5,  rationale:"Small-cap premium"},
    ],
  },
  fireStrategy: {
    label:"FIRE strategy", description:"Optimised for early retirement — growth + income + low fees",
    blendedMer:0.14, projectedReturn:9.1,
    mix:[
      {ticker:"BGBL", targetPct:40, rationale:"Core global at 0.08% MER — fee efficiency compounds to FIRE date"},
      {ticker:"A200", targetPct:25, rationale:"AU dividend income — franking credits for tax-free income in retirement"},
      {ticker:"NDQ",  targetPct:20, rationale:"Growth engine — higher expected return shortens FIRE timeline"},
      {ticker:"VGE",  targetPct:10, rationale:"EM diversification and emerging middle-class tailwind"},
      {ticker:"VSO",  targetPct:5,  rationale:"Small-cap premium over 15+ yr horizon"},
    ],
  },
  minimiseRisk: {
    label:"Minimise risk", description:"Capital-preservation focused — maximises stability and reduces drawdown while maintaining some growth",
    blendedMer:0.13, projectedReturn:6.2,
    mix:[
      {ticker:"VAS",  targetPct:25, rationale:"AU blue-chips — historically less volatile, plus franking income"},
      {ticker:"BGBL", targetPct:20, rationale:"Global developed market diversification reduces single-country risk"},
      {ticker:"VAF",  targetPct:30, rationale:"AU fixed interest — negative correlation to equities smooths volatility"},
      {ticker:"VIF",  targetPct:15, rationale:"Global bonds provide further non-correlated income stream"},
      {ticker:"VHY",  targetPct:10, rationale:"High-yield AU equities — dividend income stabilises returns in market falls"},
    ],
  },
  incomeAndDividends: {
    label:"Income & dividends", description:"Maximise regular tax-effective income through franked dividends and high-yield equities",
    blendedMer:0.16, projectedReturn:7.8,
    mix:[
      {ticker:"VHY",  targetPct:35, rationale:"Highest AU dividend yield — 4.5%+ distributions paid quarterly"},
      {ticker:"A200", targetPct:30, rationale:"Broad AU market for franking credits — after-tax yield 6%+ for 30% tax bracket"},
      {ticker:"MVW",  targetPct:20, rationale:"Equal-weight AU gives more exposure to mid-cap dividend payers"},
      {ticker:"BGBL", targetPct:15, rationale:"Global diversification floor — prevents over-concentration in AU financials"},
    ],
  },
};

export function optimisePortfolio(
  goal: OptimiserGoal,
  profile: FinancialProfile,
  analysis: PortfolioAnalysis
): OptimiserResult {
  const config = OPTIMISER_CONFIGS[goal];
  const r = config.projectedReturn / 100;
  const totalB = analysis.totalBrokerage;
  const monthlyC = profile.monthlyContrib;

  const proj10yr = totalB * Math.pow(1 + r, 10) + monthlyC * 12 * (Math.pow(1 + r, 10) - 1) / r;
  const proj20yr = totalB * Math.pow(1 + r, 20) + monthlyC * 12 * (Math.pow(1 + r, 20) - 1) / r;

  const actionPlan: ActionItem[] = analysis.overlapPairs.length >= 0
    ? config.mix.map(m => {
        const existing = profile.portfolio?.holdings.find(h => h.ticker === m.ticker);
        const currentPct = existing ? Math.round(existing.balance / totalB * 100) : 0;
        const diff = m.targetPct - currentPct;
        const dollarAmount = Math.abs(diff / 100 * totalB);
        return {
          ticker: m.ticker,
          action: diff > 2 ? "buy" : diff < -2 ? "sell" : "hold",
          currentPct, targetPct: m.targetPct, dollarAmount,
          rationale: m.rationale,
        };
      })
    : [];

  // Also flag ETFs to exit (held but not in recommended mix)
  const activeHoldings = profile.portfolio?.holdings.filter(h => h.balance > 0) ?? [];
  activeHoldings.forEach(h => {
    if (!config.mix.find(m => m.ticker === h.ticker)) {
      actionPlan.push({
        ticker: h.ticker, action: "exit",
        currentPct: Math.round(h.balance / totalB * 100),
        targetPct: 0, dollarAmount: h.balance,
        rationale: "Not in recommended mix — consider consolidating",
      });
    }
  });

  return { goal, ...config, mix: config.mix, proj10yr, proj20yr, actionPlan };
}

// ── SIP plan generator ────────────────────────────────────────────────────
export function generateSIPPlan(
  profile: FinancialProfile,
  analysis: PortfolioAnalysis
): SIPItem[] {
  const holdings = profile.portfolio?.holdings.filter(h => h.balance > 0 && h.targetPct > 0) ?? [];
  if (!holdings.length || !profile.monthlyContrib) return [];

  const totalB = analysis.totalBrokerage;
  const monthly = profile.monthlyContrib;

  const items: SIPItem[] = holdings.map(h => ({
    ticker: h.ticker,
    currentPct: Math.round(h.balance / totalB * 100 * 10) / 10,
    targetPct: h.targetPct,
    driftPct: Math.round((h.balance / totalB * 100 - h.targetPct) * 10) / 10,
    buyAmount: 0,
    action: "hold" as const,
  }));

  items.sort((a, b) => a.driftPct - b.driftPct);

  let remaining = monthly;
  items.forEach(item => {
    if (item.driftPct < -2 && remaining > 0) {
      const alloc = Math.min(remaining, Math.abs(item.driftPct / 100) * monthly * 2.5);
      item.buyAmount = Math.round(alloc);
      item.action = "buy";
      remaining -= alloc;
    }
  });

  if (remaining > 50 && items.length) {
    items[0].buyAmount = (items[0].buyAmount ?? 0) + Math.round(remaining);
    items[0].action = "buy";
  }

  return items;
}

// ── Retirement scenario builder ─────────────────────────────────────────────
export function buildRetirementScenarios(profile: FinancialProfile, analysis: PortfolioAnalysis) {
  const scenarios = [
    {goal:"Retire at 50", yrs:Math.max(1,50-profile.age), ret:9.6, etfs:[{e:"BGBL",p:38},{e:"A200",p:28},{e:"NDQ",p:18},{e:"VGE",p:10},{e:"VSO",p:6}]},
    {goal:"Retire at 55", yrs:Math.max(1,55-profile.age), ret:9.1, etfs:[{e:"BGBL",p:40},{e:"NDQ",p:20},{e:"A200",p:25},{e:"VGE",p:10},{e:"VSO",p:5}]},
    {goal:"Retire at 60", yrs:Math.max(1,60-profile.age), ret:8.7, etfs:[{e:"VGS",p:45},{e:"A200",p:30},{e:"VGE",p:15},{e:"QUAL",p:10}]},
    {goal:"Aggressive growth", yrs:20, ret:10.5, etfs:[{e:"NDQ",p:35},{e:"BGBL",p:30},{e:"VGE",p:20},{e:"VSO",p:15}]},
  ];

  return scenarios.map(sc => {
    const r = sc.ret / 100;
    const total = analysis.totalPortfolio;
    const monthly = profile.monthlyContrib;
    const proj = total * Math.pow(1+r, sc.yrs) + monthly * 12 * (Math.pow(1+r, sc.yrs) - 1) / r;
    const mer = sc.etfs.reduce((s, m) => s + (ETF_DB[m.e]?.mer ?? 0.2) * m.p / 100, 0);
    return { ...sc, projectedBalance: Math.round(proj), blendedMer: Math.round(mer * 100) / 100 };
  });
}

// ── Utility: format AUD ────────────────────────────────────────────────────
export function fmtAUD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

export function fmtPct(n: number): string {
  return `${(Math.round(n * 10) / 10).toFixed(1)}%`;
}
