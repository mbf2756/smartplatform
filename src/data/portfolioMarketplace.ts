// SmartETF Portfolio Marketplace — Model Portfolio Database
// Returns are indicative based on historical index data to June 2025.
// Not financial advice.

export type PortfolioCategory = "high-growth" | "growth" | "balanced" | "income";
export type RiskLevel = 1 | 2 | 3 | 4 | 5;

export interface ModelHolding {
  ticker: string;
  name: string;
  pct: number;
  mer: number;
  asset: string;
  index: string;
  color: string; // for donut chart
}

export interface ModelPortfolio {
  id: string;
  category: PortfolioCategory;
  name: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  desc: string;
  risk: RiskLevel;
  riskLabel: string;
  horizon: string;
  rebalance: string;
  mer: number;
  yield: number;
  type: string;
  color: string;
  chips: string[];
  returns: { "1yr": number; "3yr": number; "5yr": number; inception: number };
  holdings: ModelHolding[];
  annualCostOn430k: number;
  pros: string[];
  cons: string[];
  disclaimer: string;
}

const COLORS = {
  au:     "#1D9E75",
  global: "#378ADD",
  us:     "#7F77DD",
  em:     "#D85A30",
  bonds:  "#888780",
  small:  "#BA7517",
  tech:   "#E24B4A",
  qual:   "#639922",
};

export const MODEL_PORTFOLIOS: ModelPortfolio[] = [

  // ── HIGH GROWTH ─────────────────────────────────────────────────────────────
  {
    id:"tech-tilt", category:"high-growth", name:"Tech & innovation",
    tag:"High growth", tagColor:"#791F1F", tagBg:"#FCEBEB",
    desc:"Maximum growth tilt via US tech and global quality. For investors with 10+ year horizon and high risk tolerance.",
    risk:5, riskLabel:"Very high", horizon:"10+ yrs", rebalance:"Semi-annual",
    mer:0.22, yield:0.8, type:"Accumulation", color:"#E24B4A",
    chips:["Nasdaq tilt","Tech concentration","Max compounding"],
    returns:{"1yr":28.4,"3yr":15.1,"5yr":18.2,inception:16.4},
    annualCostOn430k: 946,
    holdings:[
      {ticker:"NDQ", name:"Betashares Nasdaq 100",      pct:40, mer:0.22, asset:"US Tech",       index:"Nasdaq-100",             color:COLORS.tech},
      {ticker:"QUAL",name:"VanEck Intl Quality ETF",    pct:25, mer:0.40, asset:"Global Quality",index:"MSCI World Quality",      color:COLORS.qual},
      {ticker:"IVV", name:"iShares S&P 500 ETF",        pct:20, mer:0.04, asset:"US Large Cap",  index:"S&P 500",                color:COLORS.us},
      {ticker:"VGE", name:"Vanguard Emerging Markets",  pct:10, mer:0.48, asset:"Emerging Mkts", index:"FTSE Emerging Markets",  color:COLORS.em},
      {ticker:"VSO", name:"Vanguard AU Small Companies",pct:5,  mer:0.30, asset:"AU Small Cap",  index:"S&P/ASX Small Ords",     color:COLORS.small},
    ],
    pros:["Highest historical long-run returns","Quality factor tilt reduces blow-up risk","EM adds long-run diversification"],
    cons:["Extreme tech concentration — single-sector risk","Very high short-term volatility","Underperforms badly in rate-rise environments"],
    disclaimer:"This portfolio has experienced drawdowns exceeding 30% in single calendar years. Only suitable for investors with very long horizons and high risk tolerance.",
  },
  {
    id:"global-highgrowth", category:"high-growth", name:"Global high growth",
    tag:"High growth", tagColor:"#791F1F", tagBg:"#FCEBEB",
    desc:"100% global equities across developed and emerging markets. No bonds, no AU home bias. Pure long-run growth engine.",
    risk:5, riskLabel:"Very high", horizon:"10+ yrs", rebalance:"Annual",
    mer:0.15, yield:1.4, type:"Accumulation", color:"#D85A30",
    chips:["100% equities","EM included","No home bias"],
    returns:{"1yr":21.8,"3yr":12.9,"5yr":14.6,inception:13.2},
    annualCostOn430k: 645,
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares",   pct:55, mer:0.08, asset:"Global Developed", index:"Solactive GBS DM",        color:COLORS.global},
      {ticker:"NDQ", name:"Betashares Nasdaq 100",      pct:20, mer:0.22, asset:"US Tech",           index:"Nasdaq-100",              color:COLORS.tech},
      {ticker:"VGE", name:"Vanguard Emerging Markets",  pct:15, mer:0.48, asset:"Emerging Mkts",     index:"FTSE Emerging Markets",  color:COLORS.em},
      {ticker:"QUAL",name:"VanEck Intl Quality ETF",    pct:10, mer:0.40, asset:"Global Quality",    index:"MSCI World Quality",      color:COLORS.qual},
    ],
    pros:["No AU home bias — genuinely global","Low 0.15% MER for a 4-ETF portfolio","Quality tilt via QUAL reduces drawdown depth"],
    cons:["100% USD/foreign currency exposure","No franking credits","High volatility — not suitable near retirement"],
    disclaimer:"Currency fluctuations can materially impact returns. Not financial advice.",
  },
  {
    id:"fire-aggressive", category:"high-growth", name:"FIRE aggressive",
    tag:"High growth", tagColor:"#791F1F", tagBg:"#FCEBEB",
    desc:"Maximum compounding for FIRE investors with 15+ year accumulation phase. Five ETFs, lowest possible MER, highest expected return.",
    risk:5, riskLabel:"Very high", horizon:"15+ yrs", rebalance:"Annual",
    mer:0.14, yield:1.5, type:"Accumulation", color:"#993C1D",
    chips:["FIRE optimised","0.14% MER","15yr+ horizon"],
    returns:{"1yr":18.9,"3yr":12.1,"5yr":13.8,inception:12.6},
    annualCostOn430k: 602,
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares",   pct:40, mer:0.08, asset:"Global Developed", index:"Solactive GBS DM",       color:COLORS.global},
      {ticker:"A200",name:"Betashares Australia 200",   pct:25, mer:0.04, asset:"AU Large Cap",      index:"Solactive Australia 200",color:COLORS.au},
      {ticker:"NDQ", name:"Betashares Nasdaq 100",      pct:20, mer:0.22, asset:"US Tech",           index:"Nasdaq-100",             color:COLORS.tech},
      {ticker:"VGE", name:"Vanguard Emerging Markets",  pct:10, mer:0.48, asset:"Emerging Mkts",     index:"FTSE Emerging Markets",  color:COLORS.em},
      {ticker:"VSO", name:"Vanguard AU Small Companies",pct:5,  mer:0.30, asset:"AU Small Cap",      index:"S&P/ASX Small Ords",     color:COLORS.small},
    ],
    pros:["0.14% blended MER — extremely low for this diversification","5 ETFs cover all major global factors","AU allocation provides franking credit income"],
    cons:["No income during accumulation phase","Requires genuine 15+ year horizon","High drawdowns in market crashes"],
    disclaimer:"FIRE projections are illustrative. Sequence-of-returns risk is material. Not financial advice.",
  },
  {
    id:"small-cap-tilt", category:"high-growth", name:"Small cap tilt",
    tag:"High growth", tagColor:"#791F1F", tagBg:"#FCEBEB",
    desc:"Tilts toward small-cap and value factor premiums that have historically outperformed large-cap over long periods.",
    risk:5, riskLabel:"Very high", horizon:"10+ yrs", rebalance:"Quarterly",
    mer:0.20, yield:2.4, type:"Accumulation", color:"#854F0B",
    chips:["Small-cap premium","Value tilt","Factor investing"],
    returns:{"1yr":14.2,"3yr":9.8,"5yr":11.4,inception:10.8},
    annualCostOn430k: 860,
    holdings:[
      {ticker:"VSO", name:"Vanguard AU Small Companies",pct:30, mer:0.30, asset:"AU Small Cap",  index:"S&P/ASX Small Ords",      color:COLORS.small},
      {ticker:"IJR", name:"iShares S&P Small-Cap ETF", pct:25, mer:0.07, asset:"US Small Cap",  index:"S&P 600",                 color:COLORS.us},
      {ticker:"BGBL",name:"Betashares Global Shares",  pct:25, mer:0.08, asset:"Global Developed",index:"Solactive GBS DM",      color:COLORS.global},
      {ticker:"VGE", name:"Vanguard Emerging Markets", pct:20, mer:0.48, asset:"Emerging Mkts",  index:"FTSE Emerging Markets",  color:COLORS.em},
    ],
    pros:["Small-cap premium has historically added 2-3% p.a. over large-cap","Value tilt provides natural diversification from growth stocks","AU small-caps add franking credit exposure"],
    cons:["Small-caps are more volatile and less liquid","Underperforms large-cap in momentum-driven markets","Higher MER than large-cap alternatives"],
    disclaimer:"Factor premiums are not guaranteed and can underperform for extended periods. Not financial advice.",
  },

  // ── GROWTH ───────────────────────────────────────────────────────────────────
  {
    id:"aussie-growth", category:"growth", name:"Aussie growth",
    tag:"Growth", tagColor:"#0F6E56", tagBg:"#E1F5EE",
    desc:"High-conviction Australian equities. Maximises franking credits and domestic dividend income while capturing ASX-listed growth.",
    risk:4, riskLabel:"High", horizon:"7+ yrs", rebalance:"Quarterly",
    mer:0.09, yield:3.8, type:"Accumulation", color:"#1D9E75",
    chips:["Franking credits","ASX focused","High yield"],
    returns:{"1yr":12.4,"3yr":8.9,"5yr":9.8,inception:10.2},
    annualCostOn430k: 387,
    holdings:[
      {ticker:"A200", name:"Betashares Australia 200",     pct:55, mer:0.04, asset:"AU Large Cap",   index:"Solactive Australia 200",      color:COLORS.au},
      {ticker:"MVW",  name:"VanEck AU Equal Weight",       pct:25, mer:0.35, asset:"AU Equal Weight",index:"MVIS Australia Equal Weight",  color:"#639922"},
      {ticker:"VSO",  name:"Vanguard AU Small Companies",  pct:15, mer:0.30, asset:"AU Small Cap",   index:"S&P/ASX Small Ordinaries",    color:COLORS.small},
      {ticker:"AQLT", name:"iShares MSCI AU Quality",      pct:5,  mer:0.30, asset:"AU Quality",     index:"MSCI Australia IMI Quality",  color:COLORS.qual},
    ],
    pros:["Maximum franking credit capture — 80%+ fully franked","Lowest blended MER at 0.09%","Strong domestic economic exposure"],
    cons:["Home country bias — 100% AU","Heavy financials & materials concentration","No global diversification"],
    disclaimer:"AU equities returns include ASX-specific risks. Past performance is not a reliable indicator of future returns.",
  },
  {
    id:"us-growth", category:"growth", name:"US growth",
    tag:"Growth", tagColor:"#0F6E56", tagBg:"#E1F5EE",
    desc:"Pure US equity exposure across large-cap, tech-tilted, and small-cap allocations. World's deepest market with strong long-run compounding record.",
    risk:5, riskLabel:"Very high", horizon:"7+ yrs", rebalance:"Semi-annual",
    mer:0.10, yield:1.2, type:"Accumulation", color:"#378ADD",
    chips:["Tech tilt","USD exposure","High growth"],
    returns:{"1yr":22.1,"3yr":13.4,"5yr":16.2,inception:14.8},
    annualCostOn430k: 430,
    holdings:[
      {ticker:"IVV",name:"iShares S&P 500 ETF",       pct:50, mer:0.04, asset:"US Large Cap", index:"S&P 500",    color:COLORS.us},
      {ticker:"NDQ",name:"Betashares Nasdaq 100",     pct:30, mer:0.22, asset:"US Tech",      index:"Nasdaq-100", color:COLORS.tech},
      {ticker:"IJR",name:"iShares S&P Small-Cap ETF", pct:20, mer:0.07, asset:"US Small Cap", index:"S&P 600",    color:"#7F77DD"},
    ],
    pros:["Highest historical long-run returns","Deep liquid underlying market","Low 0.10% blended MER"],
    cons:["Full currency risk — 100% USD","Tech concentration via NDQ","US valuations historically elevated"],
    disclaimer:"USD/AUD currency movements can significantly impact returns. Not financial advice.",
  },
  {
    id:"global-growth", category:"growth", name:"Global growth",
    tag:"Growth", tagColor:"#0F6E56", tagBg:"#E1F5EE",
    desc:"Diversified global developed and emerging market exposure. Captures growth across US, Europe, Japan, and emerging Asia through three complementary ETFs.",
    risk:4, riskLabel:"High", horizon:"7+ yrs", rebalance:"Quarterly",
    mer:0.17, yield:1.8, type:"Accumulation", color:"#7F77DD",
    chips:["Global diversified","EM included","Low cost"],
    returns:{"1yr":17.8,"3yr":10.9,"5yr":12.1,inception:11.4},
    annualCostOn430k: 731,
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares",  pct:70, mer:0.08, asset:"Global Developed",index:"Solactive GBS DM",       color:COLORS.global},
      {ticker:"VGE", name:"Vanguard Emerging Markets", pct:20, mer:0.48, asset:"Emerging Mkts",   index:"FTSE Emerging Markets",  color:COLORS.em},
      {ticker:"VSO", name:"Vanguard AU Small Companies",pct:10, mer:0.30, asset:"AU Small Cap",   index:"S&P/ASX Small Ords",     color:COLORS.small},
    ],
    pros:["True global diversification across 40+ countries","EM exposure for long-run growth tailwinds","Very low 0.17% MER"],
    cons:["Multiple currency exposures","EM adds short-term volatility","No direct AU large-cap"],
    disclaimer:"Emerging markets returns are more volatile than developed markets. Not financial advice.",
  },
  {
    id:"low-cost-growth", category:"growth", name:"Low-cost growth",
    tag:"Growth", tagColor:"#0F6E56", tagBg:"#E1F5EE",
    desc:"The most fee-efficient growth portfolio. Two ETFs covering the world at 0.06% MER — ultra simple, zero overlap, maximum fee retention.",
    risk:4, riskLabel:"High", horizon:"7+ yrs", rebalance:"Annual",
    mer:0.06, yield:2.1, type:"Accumulation", color:"#3B6D11",
    chips:["Lowest MER","Two ETF","Zero overlap"],
    returns:{"1yr":16.2,"3yr":10.4,"5yr":11.8,inception:10.9},
    annualCostOn430k: 258,
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares",pct:70, mer:0.08, asset:"Global Developed",index:"Solactive GBS DM",       color:COLORS.global},
      {ticker:"A200",name:"Betashares Australia 200",pct:30, mer:0.04, asset:"AU Large Cap",    index:"Solactive Australia 200",color:COLORS.au},
    ],
    pros:["0.06% MER — lowest of all 15 portfolios","Only 2 ETFs — simplest possible to maintain","Zero overlap between the two funds"],
    cons:["No emerging markets exposure","No small-cap premium","Simplicity trades off some diversification"],
    disclaimer:"Returns represent blended index performance. Not financial advice.",
  },
  {
    id:"esg-growth", category:"growth", name:"ESG growth",
    tag:"Growth", tagColor:"#0F6E56", tagBg:"#E1F5EE",
    desc:"Ethical growth portfolio screening out fossil fuels, weapons, and ESG laggards. Comparable returns to standard growth with sustainability tilt.",
    risk:4, riskLabel:"High", horizon:"7+ yrs", rebalance:"Annual",
    mer:0.38, yield:1.6, type:"Accumulation", color:"#639922",
    chips:["ESG screened","Fossil fuel free","Ethical investing"],
    returns:{"1yr":16.8,"3yr":10.2,"5yr":11.4,inception:10.8},
    annualCostOn430k: 1634,
    holdings:[
      {ticker:"ETHI",name:"Betashares Sustainability Leaders",pct:50, mer:0.59, asset:"Global ESG",  index:"Nasdaq Future Global Sustainability",color:"#639922"},
      {ticker:"FAIR",name:"Betashares AU Sustainability",     pct:30, mer:0.49, asset:"AU ESG",      index:"MSCI Australia ESG Focus",          color:COLORS.au},
      {ticker:"VGE", name:"Vanguard Emerging Markets",        pct:20, mer:0.48, asset:"Emerging Mkts",index:"FTSE Emerging Markets",            color:COLORS.em},
    ],
    pros:["Screens out fossil fuels, weapons, tobacco, gambling","Comparable long-run returns to standard growth","ESG leaders often show stronger long-term governance"],
    cons:["Higher MER at 0.38% — the cost of ethical screening","ESG definitions vary between fund providers","Screens may exclude some high-return sectors"],
    disclaimer:"ESG screening criteria vary by provider. Not all ESG funds screen identically. Not financial advice.",
  },
  {
    id:"balanced-growth", category:"growth", name:"Balanced growth",
    tag:"Growth", tagColor:"#0F6E56", tagBg:"#E1F5EE",
    desc:"80% equities, 20% bonds. Strong long-run growth with a buffer against the worst equity drawdowns. Good middle ground for growth investors near 55.",
    risk:3, riskLabel:"Medium–high", horizon:"5+ yrs", rebalance:"Quarterly",
    mer:0.12, yield:2.4, type:"Accumulation", color:"#185FA5",
    chips:["80/20 equities","Bond buffer","Reduced volatility"],
    returns:{"1yr":13.4,"3yr":8.4,"5yr":9.6,inception:9.1},
    annualCostOn430k: 516,
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares",  pct:45, mer:0.08, asset:"Global Developed",index:"Solactive GBS DM",       color:COLORS.global},
      {ticker:"VAS", name:"Vanguard Australian Shares", pct:25, mer:0.07, asset:"AU Equities",     index:"S&P/ASX 300",           color:COLORS.au},
      {ticker:"VGE", name:"Vanguard Emerging Markets",  pct:10, mer:0.48, asset:"Emerging Mkts",   index:"FTSE Emerging Markets",  color:COLORS.em},
      {ticker:"VAF", name:"Vanguard AU Fixed Interest",  pct:20, mer:0.15, asset:"AU Bonds",        index:"Bloomberg AusBond",     color:COLORS.bonds},
    ],
    pros:["80/20 splits provides meaningful growth with lower drawdowns","AU equities generate franking credits","Bond buffer smooths sequence-of-returns risk"],
    cons:["Bond allocation reduces upside in prolonged bull markets","More complex rebalancing than pure equity portfolios","Bond returns impacted by rising interest rates"],
    disclaimer:"The 80/20 portfolio has lower expected return than 100% equity over long horizons. Not financial advice.",
  },

  // ── BALANCED ─────────────────────────────────────────────────────────────────
  {
    id:"conservative", category:"balanced", name:"Conservative",
    tag:"Balanced", tagColor:"#633806", tagBg:"#FAEEDA",
    desc:"Low-volatility blend for investors within 10 years of retirement or with low risk tolerance. 50% bonds, 50% equities.",
    risk:2, riskLabel:"Low–medium", horizon:"3–5 yrs", rebalance:"Quarterly",
    mer:0.18, yield:3.2, type:"Balanced", color:"#888780",
    chips:["50% bonds","Capital preservation","Low volatility"],
    returns:{"1yr":7.4,"3yr":5.2,"5yr":6.1,inception:5.8},
    annualCostOn430k: 774,
    holdings:[
      {ticker:"VAS", name:"Vanguard Australian Shares",    pct:20, mer:0.07, asset:"AU Equities",   index:"S&P/ASX 300",              color:COLORS.au},
      {ticker:"BGBL",name:"Betashares Global Shares",      pct:20, mer:0.08, asset:"Global Equities",index:"Solactive GBS DM",        color:COLORS.global},
      {ticker:"VAF", name:"Vanguard AU Fixed Interest",    pct:35, mer:0.15, asset:"AU Bonds",      index:"Bloomberg AusBond",        color:COLORS.bonds},
      {ticker:"VIF", name:"Vanguard Intl Fixed Interest",  pct:25, mer:0.22, asset:"Global Bonds",  index:"Bloomberg Global Aggregate",color:"#444441"},
    ],
    pros:["Low drawdown in equity market falls","Steady income from bond coupons","Suitable for capital preservation goals"],
    cons:["Lower long-run return than equity portfolios","Bond returns impacted by rising rates","May lag inflation over extended periods"],
    disclaimer:"Fixed interest returns are sensitive to interest rate changes. Not financial advice.",
  },
  {
    id:"moderate", category:"balanced", name:"Moderate",
    tag:"Balanced", tagColor:"#633806", tagBg:"#FAEEDA",
    desc:"Classic 60/40 portfolio adapted for Australian investors. Balanced growth and income with global diversification and franking credits.",
    risk:3, riskLabel:"Medium", horizon:"5–7 yrs", rebalance:"Quarterly",
    mer:0.14, yield:2.6, type:"Balanced", color:"#BA7517",
    chips:["60/40 classic","Franking credits","Medium risk"],
    returns:{"1yr":11.8,"3yr":7.6,"5yr":8.4,inception:8.1},
    annualCostOn430k: 602,
    holdings:[
      {ticker:"BGBL",name:"Betashares Global Shares",  pct:35, mer:0.08, asset:"Global Equities",index:"Solactive GBS DM",        color:COLORS.global},
      {ticker:"VAS", name:"Vanguard Australian Shares", pct:25, mer:0.07, asset:"AU Equities",   index:"S&P/ASX 300",            color:COLORS.au},
      {ticker:"VAF", name:"Vanguard AU Fixed Interest", pct:25, mer:0.15, asset:"AU Bonds",      index:"Bloomberg AusBond",      color:COLORS.bonds},
      {ticker:"VGE", name:"Vanguard Emerging Markets",  pct:15, mer:0.48, asset:"Emerging Mkts", index:"FTSE Emerging Markets",  color:COLORS.em},
    ],
    pros:["Proven 60/40 framework with 100+ year track record","AU equities provide tax-effective franking credits","Bonds reduce equity volatility meaningfully"],
    cons:["Bonds reduce upside in sustained bull markets","EM adds short-term volatility","More complex to rebalance than 2-ETF"],
    disclaimer:"The 60/40 portfolio can experience simultaneous equity and bond drawdowns. Not financial advice.",
  },
  {
    id:"retirement", category:"balanced", name:"Retirement",
    tag:"Balanced", tagColor:"#633806", tagBg:"#FAEEDA",
    desc:"Designed for investors in the drawdown phase (55–75). Sustainable income, capital stability, low volatility. AU focus for franking credits.",
    risk:2, riskLabel:"Low–medium", horizon:"Ongoing", rebalance:"Semi-annual",
    mer:0.16, yield:4.1, type:"Income + preservation", color:"#7F77DD",
    chips:["Drawdown optimised","4.1% yield","Capital stable"],
    returns:{"1yr":8.2,"3yr":5.8,"5yr":6.7,inception:6.3},
    annualCostOn430k: 688,
    holdings:[
      {ticker:"VAS", name:"Vanguard Australian Shares",       pct:35, mer:0.07, asset:"AU Equities",   index:"S&P/ASX 300",                  color:COLORS.au},
      {ticker:"VAF", name:"Vanguard AU Fixed Interest",       pct:30, mer:0.15, asset:"AU Bonds",      index:"Bloomberg AusBond",            color:COLORS.bonds},
      {ticker:"BGBL",name:"Betashares Global Shares",         pct:20, mer:0.08, asset:"Global Equities",index:"Solactive GBS DM",            color:COLORS.global},
      {ticker:"VBND",name:"Vanguard Global Bond (AUD Hedged)",pct:15, mer:0.20, asset:"Global Bonds",  index:"Bloomberg Global Aggregate AUD",color:"#444441"},
    ],
    pros:["Low drawdown suitable for regular income withdrawals","AU equities generate reliable franked dividends","Hedged bonds remove currency risk on fixed income"],
    cons:["Lower capital growth than equity-heavy portfolios","Reduces inflation protection over time","Not designed for capital growth"],
    disclaimer:"Drawdown phase portfolios carry sequence-of-returns risk. Centrelink implications vary. Not financial advice.",
  },

  // ── INCOME ────────────────────────────────────────────────────────────────────
  {
    id:"dividend-focused", category:"income", name:"Dividend focused",
    tag:"Income", tagColor:"#185FA5", tagBg:"#E6F1FB",
    desc:"Targets the highest sustainable dividend yield from AU and global equities. Regular quarterly income without needing to sell holdings.",
    risk:3, riskLabel:"Medium–high", horizon:"5+ yrs", rebalance:"Semi-annual",
    mer:0.22, yield:4.6, type:"Income", color:"#1D9E75",
    chips:["4.6% yield","Quarterly income","AU focused"],
    returns:{"1yr":9.8,"3yr":6.9,"5yr":7.8,inception:7.4},
    annualCostOn430k: 946,
    holdings:[
      {ticker:"VHY", name:"Vanguard AU High Yield ETF",  pct:40, mer:0.25, asset:"AU High Yield",  index:"FTSE AU High Dividend Yield",color:COLORS.au},
      {ticker:"A200",name:"Betashares Australia 200",    pct:25, mer:0.04, asset:"AU Large Cap",   index:"Solactive Australia 200",    color:"#3B6D11"},
      {ticker:"EINC",name:"VanEck MSCI Intl Value",     pct:20, mer:0.40, asset:"Global Value",   index:"MSCI World ex-AU Value",     color:COLORS.global},
      {ticker:"MVW", name:"VanEck AU Equal Weight",      pct:15, mer:0.35, asset:"AU Equal Weight",index:"MVIS Australia Equal Weight",color:COLORS.small},
    ],
    pros:["4.6% distribution yield paid quarterly","Income without needing to sell holdings","AU equity focus maximises franking credits"],
    cons:["Income stocks can underperform in growth markets","Less capital growth than broad index","High AU concentration"],
    disclaimer:"Distribution yield is based on trailing 12-month distributions and is not guaranteed. Not financial advice.",
  },
  {
    id:"franking-focused", category:"income", name:"Franking focused",
    tag:"Income", tagColor:"#185FA5", tagBg:"#E6F1FB",
    desc:"Maximises fully franked dividends. After-tax yield of 6–7% for investors in 30%+ bracket. Pure AU equities for maximum franking.",
    risk:3, riskLabel:"Medium–high", horizon:"5+ yrs", rebalance:"Annually",
    mer:0.17, yield:3.9, type:"Income (tax-advantaged)", color:"#D85A30",
    chips:["Fully franked","6–7% after-tax","3 ETFs"],
    returns:{"1yr":10.4,"3yr":7.3,"5yr":8.1,inception:7.8},
    annualCostOn430k: 731,
    holdings:[
      {ticker:"A200",name:"Betashares Australia 200",pct:45, mer:0.04, asset:"AU Large Cap",   index:"Solactive Australia 200",    color:COLORS.au},
      {ticker:"VAS", name:"Vanguard Australian Shares",pct:30,mer:0.07, asset:"AU Large Cap",   index:"S&P/ASX 300",               color:"#3B6D11"},
      {ticker:"MVW", name:"VanEck AU Equal Weight",   pct:25, mer:0.35, asset:"AU Equal Weight",index:"MVIS Australia Equal Weight",color:COLORS.small},
    ],
    pros:["Maximises fully franked dividend capture","6–7% after-tax yield for investors in 30%+ bracket","Simple 3-ETF structure — easy to maintain"],
    cons:["100% AU equities — extreme home country concentration","Heavy financials and materials exposure","No international diversification"],
    disclaimer:"After-tax yield depends on individual tax position. Not financial advice.",
  },
  {
    id:"hybrid-income", category:"income", name:"Hybrid income",
    tag:"Income", tagColor:"#185FA5", tagBg:"#E6F1FB",
    desc:"Blends high-yield equities with AU bonds for a smoother income stream. Less volatile than pure equity income, higher yield than pure bonds.",
    risk:2, riskLabel:"Low–medium", horizon:"4+ yrs", rebalance:"Semi-annual",
    mer:0.16, yield:3.6, type:"Income + stability", color:"#185FA5",
    chips:["Hybrid income","Bond stability","Smooth distributions"],
    returns:{"1yr":8.6,"3yr":5.9,"5yr":6.8,inception:6.4},
    annualCostOn430k: 688,
    holdings:[
      {ticker:"VHY", name:"Vanguard AU High Yield ETF",  pct:35, mer:0.25, asset:"AU High Yield",index:"FTSE AU High Dividend Yield",color:COLORS.au},
      {ticker:"VAF", name:"Vanguard AU Fixed Interest",  pct:35, mer:0.15, asset:"AU Bonds",     index:"Bloomberg AusBond",         color:COLORS.bonds},
      {ticker:"A200",name:"Betashares Australia 200",    pct:20, mer:0.04, asset:"AU Large Cap", index:"Solactive Australia 200",   color:"#3B6D11"},
      {ticker:"VIF", name:"Vanguard Intl Fixed Interest",pct:10, mer:0.22, asset:"Global Bonds", index:"Bloomberg Global Aggregate",color:"#444441"},
    ],
    pros:["Smoother income stream than pure equity income","Bonds reduce drawdown in equity market falls","Diversified across asset classes"],
    cons:["Lower total return than equity-only portfolios","Bond allocation impacted by rising rates","Less franking than pure AU equity portfolios"],
    disclaimer:"Income from bonds varies with interest rates. Not financial advice.",
  },
];

export const CATEGORIES: Record<string, { label: string; desc: string; color: string }> = {
  "high-growth": { label:"High growth",  desc:"Maximum long-run return, very high risk",     color:"#E24B4A" },
  "growth":      { label:"Growth",       desc:"Strong growth, high risk, 7+ year horizon",   color:"#1D9E75" },
  "balanced":    { label:"Balanced",     desc:"Growth + stability, medium risk",              color:"#BA7517" },
  "income":      { label:"Income",       desc:"Regular distributions, medium risk",           color:"#378ADD" },
};

export const RISK_FILTERS = [
  { id:"all", label:"All" },
  { id:"1-2", label:"Low" },
  { id:"3",   label:"Medium" },
  { id:"4",   label:"High" },
  { id:"5",   label:"Very high" },
];

export function getByCategory(cat: PortfolioCategory | "all"): ModelPortfolio[] {
  return cat === "all" ? MODEL_PORTFOLIOS : MODEL_PORTFOLIOS.filter(p => p.category === cat);
}

export function getById(id: string): ModelPortfolio | undefined {
  return MODEL_PORTFOLIOS.find(p => p.id === id);
}
