// ─────────────────────────────────────────────────────────────────────────────
// Shared types — used across SmartETF and SmartSuper
// ─────────────────────────────────────────────────────────────────────────────

// ── User profile (stored in Supabase users table) ──────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  tier: "free" | "pro" | "premium" | "bundle"; // bundle = SmartETF + SmartSuper
  createdAt: string;
  updatedAt: string;
}

// ── ETF Holding ────────────────────────────────────────────────────────────
export interface ETFHolding {
  ticker: string;
  balance: number;    // AUD
  targetPct: number;  // target allocation %
  costBase?: number;  // for CGT tracking (pro feature)
  purchaseDate?: string;
}

// ── Portfolio (brokerage) ──────────────────────────────────────────────────
export interface Portfolio {
  id?: string;
  userId?: string;
  name: string;
  holdings: ETFHolding[];
  totalBalance: number;  // computed
  updatedAt?: string;
}

// ── Super Profile ─────────────────────────────────────────────────────────
export interface SuperProfile {
  fundId: string;          // key into SUPER_FUNDS
  balance: number;         // AUD
  concessionalContrib: number;  // annual CC made this year
  nonConcessionalContrib: number;
  tsb: number;             // Total Super Balance
  yearOfBirth: number;
  preservationAge?: number;
}

// ── User Financial Profile ─────────────────────────────────────────────────
export interface FinancialProfile {
  id?: string;
  userId?: string;
  age: number;
  annualIncome: number;
  riskProfile: RiskProfile;
  monthlyContrib: number;    // monthly DCA into brokerage
  retirementGoalAge?: number;
  fireTarget?: number;       // target portfolio value at retirement
  portfolio?: Portfolio;
  superProfile?: SuperProfile;
  updatedAt?: string;
}

export type RiskProfile = "conservative" | "moderate" | "growth" | "aggressive";

// ── Analysis Results ───────────────────────────────────────────────────────
export interface OverlapPair {
  etfA: string;
  etfB: string;
  overlapPct: number;
  severity: "high" | "medium" | "low";
}

export interface PortfolioIssue {
  severity: "high" | "medium" | "low";
  category: "overlap" | "fee" | "diversification" | "concentration" | "super" | "risk";
  message: string;
  impact?: string;
}

export interface PortfolioStrength {
  category: string;
  message: string;
}

export interface GeographicExposure {
  region: string;
  pct: number;
  color: string;
}

export interface SectorExposure {
  sector: string;
  pct: number;
}

export interface HealthScores {
  composite: number;     // 0–100
  overlap: number;
  fee: number;
  diversification: number;
  superAlignment: number;
  ageRisk: number;
}

export interface FeeAnalysis {
  blendedMerPct: number;
  feeDrag10yr: number;
  feeDrag20yr: number;
  annualFeeCost: number;
  cheapestEquivalentMer: number;
  savingsPotential10yr: number;
}

export interface PortfolioAnalysis {
  healthScores: HealthScores;
  issues: PortfolioIssue[];
  strengths: PortfolioStrength[];
  overlapPairs: OverlapPair[];
  geoExposure: GeographicExposure[];
  sectorExposure: SectorExposure[];
  feeAnalysis: FeeAnalysis;
  factorExposure: {
    growthTilt: number;
    valueTilt: number;
    qualityScore: number;
    largeCapPct: number;
  };
  hasEMExposure: boolean;
  hasSmallCap: boolean;
  etfKeys: string[];
  totalBrokerage: number;
  totalPortfolio: number;
}

// ── Optimiser ─────────────────────────────────────────────────────────────
export type OptimiserGoal =
  | "minimiseFees"
  | "maximiseDiversification"
  | "maximiseGrowth"
  | "fireStrategy"
  | "minimiseRisk"
  | "incomeAndDividends";

export interface OptimisedHolding {
  ticker: string;
  targetPct: number;
  rationale: string;
}

export interface OptimiserResult {
  goal: OptimiserGoal;
  label: string;
  description: string;
  mix: OptimisedHolding[];
  blendedMer: number;
  projectedReturn: number;
  proj10yr: number;
  proj20yr: number;
  actionPlan: ActionItem[];
}

export interface ActionItem {
  ticker: string;
  action: "buy" | "sell" | "hold" | "exit";
  currentPct: number;
  targetPct: number;
  dollarAmount: number;
  rationale: string;
}

// ── SIP Plan ──────────────────────────────────────────────────────────────
export interface SIPItem {
  ticker: string;
  currentPct: number;
  targetPct: number;
  driftPct: number;
  buyAmount: number;
  action: "buy" | "hold";
}

// ── Super Analysis (SmartSuper) ────────────────────────────────────────────
export interface SuperAnalysis {
  healthScore: number;
  concessionalCapRemaining: number;
  carryForwardAvailable: number;
  estimatedTaxSaving: number;
  div296Risk: boolean;
  div296ImpactEstimate?: number;
  retirementProjections: RetirementProjection[];
  contributionStrategy: ContributionRecommendation[];
}

export interface RetirementProjection {
  retireAge: number;
  superBalance: number;
  portfolioBalance: number;
  totalWealth: number;
  annualIncome: number;
  centrelinkEligible: boolean;
}

export interface ContributionRecommendation {
  type: "CC" | "NCC" | "SalarySacrifice" | "SpouseContrib";
  amount: number;
  taxSaving: number;
  rationale: string;
}

// ── API Response wrapper ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: "ok" | "error";
}
