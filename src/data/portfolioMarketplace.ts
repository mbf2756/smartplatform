// ─────────────────────────────────────────────────────────────────────────────
// SmartETF Portfolio Marketplace — Model Portfolio Database
// 11 portfolios across Growth, Balanced, and Income categories
// All returns are indicative based on historical index data to June 2025.
// Not financial advice.
// ─────────────────────────────────────────────────────────────────────────────

export type PortfolioCategory = "growth" | "balanced" | "income";
export type RiskLevel = 1 | 2 | 3 | 4 | 5;

export interface ModelHolding {
  ticker: string;
  name: string;
  pct: number;       // portfolio weight %
  mer: number;       // MER %
  asset: string;     // asset class label
  index: string;     // underlying index tracked
  isin?: string;
}

export interface ModelPortfolio {
  id: string;
  category: PortfolioCategory;
  name: string;
  tag: string;
  desc: string;
  risk: RiskLevel;
  riskLabel: string;
  horizon: string;
  rebalance: string;
  mer: number;            // blended MER %
  yield: number;          // distribution yield %
  type: string;
  color: string;
  returns: {
    "1yr": number;
    "3yr": number;
    "5yr": number;
    inception: number;
  };
  badges: string[];
  holdings: ModelHolding[];
  chartData: number[];    // 12 month index (100 = start)
  pros: string[];
  cons: string[];
  disclaimer: string;
}

export const MODEL_PORTFOLIOS: ModelPortfolio[] = [
  // ── GROWTH ──────────────────────────────────────────────────────────────────
  {
    id:"aussie-growth", category:"growth", name:"Aussie growth", tag:"AU-focused",
    color:"#1D9E75",
    desc:"High-conviction Australian equities with a tilt toward resources and financials. Maximises franking credits and domestic dividend income while capturing ASX-listed growth.",
    risk:4, riskLabel:"High", horizon:"7+ years", rebalance:"Quarterly",
    mer:0.09, yield:3.8, type:"Accumulation",
    returns:{"1yr":12.4,"3yr":8.9,"5yr":9.8,inception:10.2},
    badges:["Franking credits","ASX-focused","High yield"],
    chartData:[100,104,98,112,118,127,131,138,145,149,154,162],
    holdings:[
      {ticker:"A200",name:"Betashares Australia 200 ETF",pct:55,mer:0.04,asset:"AU Large Cap",index:"Solactive Australia 200"},
      {ticker:"MVW", name:"VanEck AU Equal Weight ETF",pct:25,mer:0.35,asset:"AU Equal Weight",index:"MVIS Australia Equal Weight"},
      {ticker:"VSO", name:"Vanguard AU Small Companies",pct:15,mer:0.30,asset:"AU Small Cap",index:"S&P/ASX Small Ordinaries"},
      {ticker:"AQLT",name:"iShares MSCI Australia Quality",pct:5,mer:0.30,asset:"AU Quality",index:"MSCI Australia IMI Quality"},
    ],
    pros:["Maximum franking credit capture","Low blended MER at 0.09%","Strong AU economic exposure"],
    cons:["Concentrated in AU — significant home bias","High financials & materials exposure","Currency risk on global earnings"],
    disclaimer:"Returns represent the blended index performance of constituent ETFs weighted by portfolio allocation. Actual fund returns may differ. Past performance is not a reliable indicator of future returns.",
  },
  {
    id:"us-growth", category:"growth", name:"US growth", tag:"S&P 500 core",
    color:"#378ADD",
    desc:"Pure US equity exposure across large-cap, tech-tilted, and small-cap allocations. Captures the world's deepest market with strong long-run compounding track record.",
    risk:5, riskLabel:"Very high", horizon:"7+ years", rebalance:"Semi-annual",
    mer:0.10, yield:1.2, type:"Accumulation",
    returns:{"1yr":22.1,"3yr":13.4,"5yr":16.2,inception:14.8},
    badges:["Tech tilt","USD exposure","High growth"],
    chartData:[100,108,115,119,128,141,155,163,171,182,195,208],
    holdings:[
      {ticker:"IVV",name:"iShares S&P 500 ETF",pct:50,mer:0.04,asset:"US Large Cap",index:"S&P 500"},
      {ticker:"NDQ",name:"Betashares Nasdaq 100",pct:30,mer:0.22,asset:"US Tech",index:"Nasdaq-100"},
      {ticker:"IJR",name:"iShares S&P Small-Cap ETF",pct:20,mer:0.07,asset:"US Small Cap",index:"S&P 600"},
    ],
    pros:["Highest historical long-run returns of all portfolios","Deep, liquid underlying US market","Low blended MER at 0.10%"],
    cons:["Currency risk — 100% USD exposure","High tech concentration via NDQ","US valuations historically elevated"],
    disclaimer:"US equity returns include AUD/USD currency fluctuations. Historical returns reflect periods of both elevated and compressed AUD. Not financial advice.",
  },
  {
    id:"global-growth", category:"growth", name:"Global growth", tag:"World ex-AU",
    color:"#7F77DD",
    desc:"Diversified global developed and emerging market exposure. Captures growth across US, Europe, Japan, and emerging Asia through two complementary low-cost ETFs.",
    risk:4, riskLabel:"High", horizon:"7+ years", rebalance:"Quarterly",
    mer:0.17, yield:1.8, type:"Accumulation",
    returns:{"1yr":17.8,"3yr":10.9,"5yr":12.1,inception:11.4},
    badges:["Global diversified","EM included","Low cost"],
    chartData:[100,103,99,107,114,121,128,132,139,147,153,160],
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares ETF",pct:70,mer:0.08,asset:"Global Developed",index:"Solactive GBS Developed Markets"},
      {ticker:"VGE", name:"Vanguard Emerging Markets ETF",pct:20,mer:0.48,asset:"Emerging Markets",index:"FTSE Emerging Markets"},
      {ticker:"VSO", name:"Vanguard AU Small Companies",pct:10,mer:0.30,asset:"AU Small Cap",index:"S&P/ASX Small Ordinaries"},
    ],
    pros:["True global diversification across 40+ countries","EM exposure for long-run growth tailwinds","Very low blended MER at 0.17%"],
    cons:["Multiple currency exposures including EUR, JPY, EM","EM allocation adds meaningful short-term volatility","No direct AU large-cap for franking credits"],
    disclaimer:"Emerging markets returns are more volatile than developed markets. EM allocation (20%) may significantly impact short-term performance. Not financial advice.",
  },
  {
    id:"fire-growth", category:"growth", name:"FIRE growth", tag:"Early retirement",
    color:"#D85A30",
    desc:"Optimised for the FIRE investor targeting retirement before 55. Maximum growth rate with low fees, built to compound aggressively over a 15–25 year accumulation phase.",
    risk:5, riskLabel:"Very high", horizon:"10+ years", rebalance:"Annual",
    mer:0.14, yield:1.5, type:"Accumulation",
    returns:{"1yr":18.9,"3yr":12.1,"5yr":13.8,inception:12.6},
    badges:["FIRE optimised","Low MER","Max compounding"],
    chartData:[100,105,101,110,119,127,136,142,150,158,167,176],
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares ETF",pct:40,mer:0.08,asset:"Global Developed",index:"Solactive GBS Developed Markets"},
      {ticker:"NDQ", name:"Betashares Nasdaq 100",pct:20,mer:0.22,asset:"US Tech",index:"Nasdaq-100"},
      {ticker:"A200",name:"Betashares Australia 200 ETF",pct:25,mer:0.04,asset:"AU Large Cap",index:"Solactive Australia 200"},
      {ticker:"VGE", name:"Vanguard Emerging Markets ETF",pct:10,mer:0.48,asset:"Emerging Markets",index:"FTSE Emerging Markets"},
      {ticker:"VSO", name:"Vanguard AU Small Companies",pct:5,mer:0.30,asset:"AU Small Cap",index:"S&P/ASX Small Ordinaries"},
    ],
    pros:["Optimised for long compounding with growth tilt","Low 0.14% blended MER preserves returns","5 ETFs provide clean multi-factor diversification"],
    cons:["No income in accumulation phase — pure growth","High short-term volatility inappropriate near retirement","Requires disciplined multi-year rebalancing commitment"],
    disclaimer:"FIRE projections are illustrative. Sequence-of-returns risk is material for early retirees. This portfolio assumes a 15+ year accumulation phase. Not financial advice.",
  },
  {
    id:"low-cost-growth", category:"growth", name:"Low-cost growth", tag:"Minimum MER",
    color:"#639922",
    desc:"The most fee-efficient growth portfolio possible. Two ETFs covering the entire world at a blended MER of just 0.06% — the Barefoot Investor approach with EM included.",
    risk:4, riskLabel:"High", horizon:"7+ years", rebalance:"Annual",
    mer:0.06, yield:2.1, type:"Accumulation",
    returns:{"1yr":16.2,"3yr":10.4,"5yr":11.8,inception:10.9},
    badges:["Lowest MER","Two ETF","Ultra simple"],
    chartData:[100,103,100,108,115,122,129,134,141,148,154,161],
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares ETF",pct:70,mer:0.08,asset:"Global Developed",index:"Solactive GBS Developed Markets"},
      {ticker:"A200",name:"Betashares Australia 200 ETF",pct:30,mer:0.04,asset:"AU Large Cap",index:"Solactive Australia 200"},
    ],
    pros:["0.06% blended MER — lowest of all 11 portfolios","Only 2 ETFs — simplest possible to maintain","Zero overlap between the two funds"],
    cons:["No emerging markets exposure","No small-cap premium allocation","Simplicity trades off some diversification"],
    disclaimer:"Returns represent the blended index performance of BGBL and A200. Actual fund returns include currency fluctuations. Not financial advice.",
  },

  // ── BALANCED ────────────────────────────────────────────────────────────────
  {
    id:"conservative", category:"balanced", name:"Conservative", tag:"Capital preservation",
    color:"#5F5E5A",
    desc:"Low-volatility portfolio for investors within 10 years of retirement or with a low risk tolerance. Prioritises capital preservation with modest growth via broad market ETFs.",
    risk:2, riskLabel:"Low–medium", horizon:"3–5 years", rebalance:"Quarterly",
    mer:0.18, yield:3.2, type:"Balanced",
    returns:{"1yr":7.4,"3yr":5.2,"5yr":6.1,inception:5.8},
    badges:["Capital preservation","Low volatility","Income + growth"],
    chartData:[100,101,100,103,105,107,109,110,112,114,116,118],
    holdings:[
      {ticker:"VAS", name:"Vanguard Australian Shares ETF",pct:25,mer:0.07,asset:"AU Equities",index:"S&P/ASX 300"},
      {ticker:"BGBL",name:"Betashares Global Shares ETF",pct:25,mer:0.08,asset:"Global Equities",index:"Solactive GBS DM"},
      {ticker:"VAF", name:"Vanguard AU Fixed Interest ETF",pct:30,mer:0.15,asset:"AU Bonds",index:"Bloomberg AusBond Composite"},
      {ticker:"VIF", name:"Vanguard Intl Fixed Interest ETF",pct:20,mer:0.22,asset:"Global Bonds",index:"Bloomberg Global Aggregate"},
    ],
    pros:["Low drawdown in equity market falls","Steady income from bond coupons","Suitable for capital preservation goals"],
    cons:["Lower long-run return than pure equity portfolios","Bond returns impacted by rising interest rates","May lag inflation over extended periods"],
    disclaimer:"Fixed interest returns are sensitive to interest rate changes. Rising rates cause bond prices to fall. This portfolio is designed for capital preservation, not growth. Not financial advice.",
  },
  {
    id:"moderate", category:"balanced", name:"Moderate", tag:"60/40 balanced",
    color:"#BA7517",
    desc:"The classic 60/40 portfolio adapted for Australian investors. Balanced growth and income with global diversification and a meaningful AU equity tilt for franking credits.",
    risk:3, riskLabel:"Medium", horizon:"5–7 years", rebalance:"Quarterly",
    mer:0.14, yield:2.6, type:"Balanced",
    returns:{"1yr":11.8,"3yr":7.6,"5yr":8.4,inception:8.1},
    badges:["60/40 classic","Franking credits","Medium risk"],
    chartData:[100,102,100,105,109,113,117,119,122,125,128,131],
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares ETF",pct:35,mer:0.08,asset:"Global Equities",index:"Solactive GBS DM"},
      {ticker:"VAS", name:"Vanguard Australian Shares ETF",pct:25,mer:0.07,asset:"AU Equities",index:"S&P/ASX 300"},
      {ticker:"VAF", name:"Vanguard AU Fixed Interest ETF",pct:25,mer:0.15,asset:"AU Bonds",index:"Bloomberg AusBond"},
      {ticker:"VGE", name:"Vanguard Emerging Markets ETF",pct:15,mer:0.48,asset:"Emerging Markets",index:"FTSE EM"},
    ],
    pros:["Proven 60/40 framework with 100+ year track record","AU equities provide tax-effective franking credits","Bonds meaningfully reduce equity volatility"],
    cons:["Bonds reduce upside in sustained bull markets","EM allocation adds short-term volatility","More complex to rebalance than 2-ETF portfolio"],
    disclaimer:"The 60/40 portfolio has experienced periods of simultaneous equity and bond drawdowns. Past performance during such periods may not reflect future outcomes. Not financial advice.",
  },
  {
    id:"retirement", category:"balanced", name:"Retirement", tag:"Drawdown phase",
    color:"#7F77DD",
    desc:"Designed for investors in the drawdown phase (55–75). Prioritises sustainable income, capital stability, and Centrelink asset test efficiency. Low volatility, high income.",
    risk:2, riskLabel:"Low–medium", horizon:"Ongoing", rebalance:"Semi-annual",
    mer:0.16, yield:4.1, type:"Income + preservation",
    returns:{"1yr":8.2,"3yr":5.8,"5yr":6.7,inception:6.3},
    badges:["Drawdown optimised","High yield","Capital stability"],
    chartData:[100,100,99,101,103,105,107,108,110,111,113,115],
    holdings:[
      {ticker:"VAS", name:"Vanguard Australian Shares ETF",pct:35,mer:0.07,asset:"AU Equities",index:"S&P/ASX 300"},
      {ticker:"VAF", name:"Vanguard AU Fixed Interest ETF",pct:30,mer:0.15,asset:"AU Bonds",index:"Bloomberg AusBond"},
      {ticker:"BGBL",name:"Betashares Global Shares ETF",pct:20,mer:0.08,asset:"Global Equities",index:"Solactive GBS DM"},
      {ticker:"VBND",name:"Vanguard Global Bond (AUD Hedged)",pct:15,mer:0.20,asset:"Global Bonds (hedged)",index:"Bloomberg Global Aggregate AUD"},
    ],
    pros:["Low drawdown suitable for regular income withdrawals","AU equities generate reliable fully franked dividends","Hedged bonds eliminate currency risk on fixed income portion"],
    cons:["Lower capital growth than equity-heavy portfolios","Bond allocation reduces inflation protection over time","Not designed for capital growth — portfolio may not keep pace with inflation"],
    disclaimer:"This portfolio is designed for the drawdown phase. Sequence-of-returns risk applies — a major early drawdown can materially impact long-run income. Centrelink implications depend on individual circumstances. Not financial advice.",
  },

  // ── INCOME ───────────────────────────────────────────────────────────────────
  {
    id:"dividend-focused", category:"income", name:"Dividend focused", tag:"High income",
    color:"#1D9E75",
    desc:"Targets the highest sustainable dividend yield from Australian and global equity markets. Suitable for investors wanting regular income without selling holdings.",
    risk:3, riskLabel:"Medium–high", horizon:"5+ years", rebalance:"Semi-annual",
    mer:0.22, yield:4.6, type:"Income",
    returns:{"1yr":9.8,"3yr":6.9,"5yr":7.8,inception:7.4},
    badges:["4.6% yield","High income","Quarterly distributions"],
    chartData:[100,102,101,104,107,110,112,114,116,119,121,124],
    holdings:[
      {ticker:"VHY", name:"Vanguard AU High Yield ETF",pct:40,mer:0.25,asset:"AU High Yield",index:"FTSE AU High Dividend Yield"},
      {ticker:"A200",name:"Betashares Australia 200 ETF",pct:25,mer:0.04,asset:"AU Large Cap",index:"Solactive Australia 200"},
      {ticker:"EINC",name:"VanEck MSCI Intl Value ETF",pct:20,mer:0.40,asset:"Global Value",index:"MSCI World ex-AU Value"},
      {ticker:"MVW", name:"VanEck AU Equal Weight ETF",pct:15,mer:0.35,asset:"AU Equal Weight",index:"MVIS Australia Equal Weight"},
    ],
    pros:["4.6% distribution yield paid quarterly","Generates income without requiring portfolio sales","AU equity focus maximises franking credit capture"],
    cons:["Income-focused stocks can significantly underperform in growth markets","Less capital growth potential than broad index","High AU concentration — significant home bias"],
    disclaimer:"Distribution yield is based on trailing 12-month distributions and is not guaranteed. Dividend income can vary year to year. Not financial advice.",
  },
  {
    id:"franking-focused", category:"income", name:"Franking focused", tag:"Tax-effective income",
    color:"#D85A30",
    desc:"Maximises fully franked dividend income for Australian investors in the 30%+ tax bracket. Franking credits effectively boost after-tax yield to 6–7% for eligible investors.",
    risk:3, riskLabel:"Medium–high", horizon:"5+ years", rebalance:"Annually",
    mer:0.17, yield:3.9, type:"Income (tax-advantaged)",
    returns:{"1yr":10.4,"3yr":7.3,"5yr":8.1,inception:7.8},
    badges:["Fully franked","Tax-effective","6–7% after-tax yield"],
    chartData:[100,101,100,103,106,109,111,113,115,118,120,123],
    holdings:[
      {ticker:"A200",name:"Betashares Australia 200 ETF",pct:45,mer:0.04,asset:"AU Large Cap",index:"Solactive Australia 200"},
      {ticker:"VAS", name:"Vanguard Australian Shares ETF",pct:30,mer:0.07,asset:"AU Large Cap",index:"S&P/ASX 300"},
      {ticker:"MVW", name:"VanEck AU Equal Weight ETF",pct:25,mer:0.35,asset:"AU Equal Weight",index:"MVIS Australia Equal Weight"},
    ],
    pros:["Maximises fully franked dividend capture","After-tax yield of 6–7% for investors in 30%+ bracket","Simple 3-ETF structure — easy to maintain"],
    cons:["100% AU equities — extreme home country concentration","Heavy financials and materials sector exposure","No international diversification — vulnerable to AU-specific downturns"],
    disclaimer:"After-tax yield assumes full use of franking credits. Franking credit value depends on individual tax position. SMSF and personal tax situations differ. Not financial advice.",
  },
];

export const CATEGORIES = {
  growth:   { label:"Growth portfolios",   desc:"High growth, long horizon",         color:"#1D9E75" },
  balanced: { label:"Balanced portfolios", desc:"Growth and stability combined",     color:"#BA7517" },
  income:   { label:"Income portfolios",   desc:"Regular distributions focused",     color:"#D85A30" },
};

export function getPortfoliosByCategory(cat: PortfolioCategory): ModelPortfolio[] {
  return MODEL_PORTFOLIOS.filter(p => p.category === cat);
}

export function getPortfolioById(id: string): ModelPortfolio | undefined {
  return MODEL_PORTFOLIOS.find(p => p.id === id);
}
