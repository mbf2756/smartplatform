// ─────────────────────────────────────────────────────────────────────────────
// ETF Master Database — shared by SmartETF and SmartSuper
// ─────────────────────────────────────────────────────────────────────────────

export type ETFCategory =
  | "Global" | "AU" | "AU Small" | "US" | "US Small"
  | "EM" | "Tech" | "Quality" | "Diversified"
  | "ESG" | "Thematic" | "Asia" | "Bonds";

export interface ETFRecord {
  ticker: string;
  name: string;
  mer: number;          // MER as percentage e.g. 0.18 = 0.18%
  category: ETFCategory;
  geo: Partial<Record<"US"|"AU"|"Europe"|"Japan"|"EM"|"Other", number>>;
  sectors: Partial<Record<"Tech"|"Finance"|"Healthcare"|"Consumer"|"Industrials"|"Materials"|"Energy"|"Other", number>>;
  factors: { growth: number; quality: number };
  index: string;
  asxCode: string;
  issuer: string;
  inceptionYear: number;
  aum: string;          // human readable
  distribution: "Quarterly" | "Half-Yearly" | "Annually" | "None";
  frankingEligible: boolean;
}

export const ETF_DB: Record<string, ETFRecord> = {
  VGS: {
    ticker:"VGS", name:"Vanguard MSCI Index International Shares ETF", mer:0.18,
    category:"Global", geo:{US:63,Europe:17,Japan:7,EM:0,AU:0,Other:13},
    sectors:{Tech:23,Finance:16,Healthcare:13,Consumer:11,Industrials:10,Other:27},
    factors:{growth:65,quality:60}, index:"MSCI World ex-Australia",
    asxCode:"VGS", issuer:"Vanguard", inceptionYear:2014,
    aum:"$8.2B", distribution:"Quarterly", frankingEligible:false,
  },
  BGBL: {
    ticker:"BGBL", name:"Betashares Global Shares ETF", mer:0.08,
    category:"Global", geo:{US:64,Europe:16,Japan:7,EM:0,AU:0,Other:13},
    sectors:{Tech:22,Finance:16,Healthcare:13,Consumer:11,Industrials:10,Other:28},
    factors:{growth:64,quality:60}, index:"Solactive GBS Developed Markets Large & Mid Cap",
    asxCode:"BGBL", issuer:"Betashares", inceptionYear:2022,
    aum:"$1.4B", distribution:"Half-Yearly", frankingEligible:false,
  },
  NDQ: {
    ticker:"NDQ", name:"Betashares Nasdaq 100 ETF", mer:0.22,
    category:"Tech", geo:{US:62,Europe:5,Japan:0,EM:0,AU:0,Other:33},
    sectors:{Tech:49,Consumer:16,Healthcare:7,Finance:4,Other:24},
    factors:{growth:88,quality:72}, index:"Nasdaq-100",
    asxCode:"NDQ", issuer:"Betashares", inceptionYear:2015,
    aum:"$5.1B", distribution:"Annually", frankingEligible:false,
  },
  IVV: {
    ticker:"IVV", name:"iShares S&P 500 ETF", mer:0.04,
    category:"US", geo:{US:100},
    sectors:{Tech:28,Finance:13,Healthcare:13,Consumer:10,Industrials:9,Other:27},
    factors:{growth:72,quality:65}, index:"S&P 500",
    asxCode:"IVV", issuer:"BlackRock", inceptionYear:2007,
    aum:"$3.8B", distribution:"Quarterly", frankingEligible:false,
  },
  VAS: {
    ticker:"VAS", name:"Vanguard Australian Shares Index ETF", mer:0.07,
    category:"AU", geo:{AU:100},
    sectors:{Finance:31,Materials:22,Healthcare:10,Consumer:8,Energy:7,Other:22},
    factors:{growth:40,quality:55}, index:"S&P/ASX 300",
    asxCode:"VAS", issuer:"Vanguard", inceptionYear:2009,
    aum:"$15.2B", distribution:"Quarterly", frankingEligible:true,
  },
  A200: {
    ticker:"A200", name:"Betashares Australia 200 ETF", mer:0.04,
    category:"AU", geo:{AU:100},
    sectors:{Finance:32,Materials:21,Healthcare:10,Consumer:8,Energy:7,Other:22},
    factors:{growth:40,quality:55}, index:"Solactive Australia 200",
    asxCode:"A200", issuer:"Betashares", inceptionYear:2018,
    aum:"$4.6B", distribution:"Quarterly", frankingEligible:true,
  },
  VEU: {
    ticker:"VEU", name:"Vanguard All-World ex-US Shares Index ETF", mer:0.13,
    category:"Global", geo:{US:0,Europe:39,Japan:17,EM:20,AU:8,Other:16},
    sectors:{Finance:20,Industrials:15,Healthcare:12,Consumer:11,Tech:10,Other:32},
    factors:{growth:45,quality:52}, index:"FTSE All-World ex US",
    asxCode:"VEU", issuer:"Vanguard", inceptionYear:2015,
    aum:"$0.9B", distribution:"Quarterly", frankingEligible:false,
  },
  VGE: {
    ticker:"VGE", name:"Vanguard FTSE Emerging Markets Shares ETF", mer:0.48,
    category:"EM", geo:{EM:100},
    sectors:{Finance:20,Tech:19,Consumer:15,Energy:8,Materials:8,Other:30},
    factors:{growth:52,quality:45}, index:"FTSE Emerging Markets All Cap China A Inclusion",
    asxCode:"VGE", issuer:"Vanguard", inceptionYear:2013,
    aum:"$1.1B", distribution:"Quarterly", frankingEligible:false,
  },
  EMKT: {
    ticker:"EMKT", name:"Betashares Emerging Markets Equities ETF (ex State-Owned)", mer:0.69,
    category:"EM", geo:{EM:100},
    sectors:{Finance:22,Tech:18,Consumer:14,Energy:9,Materials:8,Other:29},
    factors:{growth:50,quality:44}, index:"Solactive GBS EM ex-State-Owned Enterprise",
    asxCode:"EMKT", issuer:"Betashares", inceptionYear:2018,
    aum:"$0.3B", distribution:"Annually", frankingEligible:false,
  },
  VSO: {
    ticker:"VSO", name:"Vanguard Australian Small Companies Index ETF", mer:0.30,
    category:"AU Small", geo:{AU:100},
    sectors:{Materials:28,Industrials:20,Finance:12,Consumer:10,Healthcare:8,Other:22},
    factors:{growth:48,quality:45}, index:"S&P/ASX Small Ordinaries",
    asxCode:"VSO", issuer:"Vanguard", inceptionYear:2011,
    aum:"$0.8B", distribution:"Quarterly", frankingEligible:true,
  },
  IJR: {
    ticker:"IJR", name:"iShares S&P Small-Cap ETF", mer:0.07,
    category:"US Small", geo:{US:100},
    sectors:{Finance:17,Industrials:17,Consumer:14,Healthcare:14,Tech:12,Other:26},
    factors:{growth:50,quality:48}, index:"S&P 600",
    asxCode:"IJR", issuer:"BlackRock", inceptionYear:2007,
    aum:"$0.4B", distribution:"Quarterly", frankingEligible:false,
  },
  QUAL: {
    ticker:"QUAL", name:"VanEck MSCI International Quality ETF", mer:0.40,
    category:"Quality", geo:{US:62,Europe:14,Japan:5,Other:19},
    sectors:{Tech:31,Finance:14,Healthcare:14,Consumer:12,Other:29},
    factors:{growth:75,quality:90}, index:"MSCI World ex Australia Quality",
    asxCode:"QUAL", issuer:"VanEck", inceptionYear:2014,
    aum:"$2.1B", distribution:"Half-Yearly", frankingEligible:false,
  },
  MOAT: {
    ticker:"MOAT", name:"VanEck Morningstar Wide Moat ETF", mer:0.49,
    category:"Quality", geo:{US:96,Other:4},
    sectors:{Finance:15,Healthcare:13,Tech:12,Consumer:12,Energy:10,Other:38},
    factors:{growth:55,quality:85}, index:"Morningstar Wide Moat Focus",
    asxCode:"MOAT", issuer:"VanEck", inceptionYear:2015,
    aum:"$0.7B", distribution:"Annually", frankingEligible:false,
  },
  VDHG: {
    ticker:"VDHG", name:"Vanguard Diversified High Growth ETF", mer:0.27,
    category:"Diversified", geo:{US:36,AU:18,Europe:10,Japan:4,EM:5,Other:27},
    sectors:{Finance:18,Tech:17,Healthcare:11,Consumer:9,Other:45},
    factors:{growth:60,quality:58}, index:"Multi-index (fund of funds)",
    asxCode:"VDHG", issuer:"Vanguard", inceptionYear:2017,
    aum:"$3.2B", distribution:"Quarterly", frankingEligible:true,
  },
  DHHF: {
    ticker:"DHHF", name:"Betashares Diversified All Growth ETF", mer:0.19,
    category:"Diversified", geo:{US:37,AU:20,Europe:9,Japan:4,EM:6,Other:24},
    sectors:{Finance:19,Tech:17,Healthcare:11,Consumer:9,Other:44},
    factors:{growth:60,quality:57}, index:"Multi-index",
    asxCode:"DHHF", issuer:"Betashares", inceptionYear:2019,
    aum:"$1.8B", distribution:"Quarterly", frankingEligible:true,
  },
  ETHI: {
    ticker:"ETHI", name:"Betashares Global Sustainability Leaders ETF", mer:0.59,
    category:"ESG", geo:{US:60,Europe:18,Japan:5,Other:17},
    sectors:{Tech:25,Finance:14,Healthcare:13,Other:48},
    factors:{growth:68,quality:65}, index:"Nasdaq Future Global Sustainability Leaders",
    asxCode:"ETHI", issuer:"Betashares", inceptionYear:2017,
    aum:"$1.5B", distribution:"Half-Yearly", frankingEligible:false,
  },
  MVW: {
    ticker:"MVW", name:"VanEck Australian Equal Weight ETF", mer:0.35,
    category:"AU", geo:{AU:100},
    sectors:{Finance:20,Materials:20,Healthcare:10,Consumer:9,Energy:9,Other:32},
    factors:{growth:42,quality:52}, index:"MVIS Australia Equal Weight",
    asxCode:"MVW", issuer:"VanEck", inceptionYear:2014,
    aum:"$1.1B", distribution:"Half-Yearly", frankingEligible:true,
  },
  HACK: {
    ticker:"HACK", name:"Betashares Global Cybersecurity ETF", mer:0.67,
    category:"Thematic", geo:{US:78,Other:22},
    sectors:{Tech:100},
    factors:{growth:90,quality:60}, index:"Nasdaq CTA Cybersecurity",
    asxCode:"HACK", issuer:"Betashares", inceptionYear:2016,
    aum:"$0.6B", distribution:"Annually", frankingEligible:false,
  },
  RBTZ: {
    ticker:"RBTZ", name:"Betashares Global Robotics & AI ETF", mer:0.57,
    category:"Thematic", geo:{US:55,Japan:20,Other:25},
    sectors:{Tech:80,Industrials:20},
    factors:{growth:88,quality:58}, index:"Indxx Global Robotics & Artificial Intelligence",
    asxCode:"RBTZ", issuer:"Betashares", inceptionYear:2018,
    aum:"$0.3B", distribution:"Annually", frankingEligible:false,
  },
  IAA: {
    ticker:"IAA", name:"iShares Asia 50 ETF", mer:0.51,
    category:"Asia", geo:{EM:50,Other:50},
    sectors:{Finance:30,Tech:22,Consumer:14,Other:34},
    factors:{growth:55,quality:50}, index:"S&P Asia 50",
    asxCode:"IAA", issuer:"BlackRock", inceptionYear:2007,
    aum:"$0.5B", distribution:"Half-Yearly", frankingEligible:false,
  },
};

// Overlap matrix — % of holdings shared between pairs
// Based on index composition analysis
export const OVERLAP_MATRIX: Record<string, number> = {
  "VGS-BGBL":94, "VGS-NDQ":26, "VGS-IVV":68, "VGS-QUAL":72,
  "VGS-ETHI":58, "VGS-VDHG":72, "VGS-DHHF":74, "VGS-MOAT":35,
  "BGBL-NDQ":25, "BGBL-IVV":67, "BGBL-QUAL":70, "BGBL-ETHI":57,
  "BGBL-VDHG":71, "BGBL-DHHF":73,
  "NDQ-IVV":62, "NDQ-QUAL":38, "NDQ-HACK":42, "NDQ-RBTZ":22,
  "IVV-QUAL":68, "IVV-MOAT":38, "IVV-VDHG":45,
  "VAS-A200":95, "VAS-MVW":72, "VAS-VSO":18, "VAS-VDHG":55, "VAS-DHHF":58,
  "A200-MVW":71, "A200-DHHF":56, "A200-VDHG":53,
  "VDHG-DHHF":88,
  "QUAL-MOAT":28,
};

export function getOverlap(a: string, b: string): number {
  return OVERLAP_MATRIX[`${a}-${b}`] ?? OVERLAP_MATRIX[`${b}-${a}`] ?? 0;
}

export const SUPPORTED_TICKERS = Object.keys(ETF_DB);
