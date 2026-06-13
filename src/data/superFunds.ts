// ─────────────────────────────────────────────────────────────────────────────
// Super Fund Database — used by SmartSuper and SmartETF (super alignment tab)
// ─────────────────────────────────────────────────────────────────────────────

export interface SuperFundRecord {
  name: string;
  shortName: string;
  type: "Industry" | "Retail" | "Corporate" | "Government";
  option: string;
  mer: number;          // % e.g. 0.09
  geo: Partial<Record<"AU"|"US"|"Global"|"EM"|"Bonds"|"Alternatives"|"Other", number>>;
  // Approximate ETF-equivalent exposure for overlap detection
  etfEquivalent: Partial<Record<string, number>>;
  memberCount: string;
  aum: string;
}

export const SUPER_FUNDS: Record<string, SuperFundRecord> = {
  "hostplus-balanced": {
    name:"Hostplus Balanced", shortName:"Hostplus",
    type:"Industry", option:"Balanced",
    mer:0.09,
    geo:{AU:25,US:28,Global:35,EM:7,Bonds:0,Alternatives:5},
    etfEquivalent:{VAS:25,VGS:35,VGE:7},
    memberCount:"1.7M", aum:"$98B",
  },
  "hostplus-choiceplus": {
    name:"Hostplus Choiceplus", shortName:"Hostplus CP",
    type:"Industry", option:"Choiceplus (self-directed)",
    mer:0.02,
    geo:{AU:35,US:22,Global:28,EM:8,Other:7},
    etfEquivalent:{VAS:35,VGS:28,VGE:8},
    memberCount:"55K", aum:"$4B",
  },
  "australian-super-balanced": {
    name:"AustralianSuper Balanced", shortName:"AustralianSuper",
    type:"Industry", option:"Balanced",
    mer:0.10,
    geo:{AU:24,US:29,Global:34,EM:8,Bonds:0,Alternatives:5},
    etfEquivalent:{VAS:27,VGS:36,VGE:8},
    memberCount:"3.4M", aum:"$335B",
  },
  "aware-super-high-growth": {
    name:"Aware Super High Growth", shortName:"Aware Super",
    type:"Industry", option:"High Growth",
    mer:0.09,
    geo:{AU:20,US:35,Global:35,EM:7,Bonds:0,Alternatives:3},
    etfEquivalent:{VAS:22,VGS:42,VGE:7},
    memberCount:"1.1M", aum:"$155B",
  },
  "rest-core": {
    name:"REST Core Strategy", shortName:"REST Super",
    type:"Industry", option:"Core Strategy",
    mer:0.12,
    geo:{AU:27,US:25,Global:33,EM:8,Bonds:0,Alternatives:7},
    etfEquivalent:{VAS:30,VGS:33,VGE:8},
    memberCount:"1.8M", aum:"$75B",
  },
  "unisuper-balanced": {
    name:"UniSuper Balanced", shortName:"UniSuper",
    type:"Industry", option:"Balanced",
    mer:0.11,
    geo:{AU:30,US:25,Global:30,EM:7,Bonds:0,Alternatives:8},
    etfEquivalent:{VAS:33,VGS:30,VGE:7},
    memberCount:"530K", aum:"$120B",
  },
  "cbus-super-balanced": {
    name:"Cbus Super Balanced", shortName:"Cbus",
    type:"Industry", option:"Growth (MySuper)",
    mer:0.13,
    geo:{AU:28,US:26,Global:33,EM:7,Bonds:0,Alternatives:6},
    etfEquivalent:{VAS:31,VGS:33,VGE:7},
    memberCount:"930K", aum:"$85B",
  },
  "sunsuper-balanced": {
    name:"Sunsuper Balanced", shortName:"Sunsuper",
    type:"Industry", option:"Balanced",
    mer:0.09,
    geo:{AU:26,US:27,Global:34,EM:7,Bonds:0,Alternatives:6},
    etfEquivalent:{VAS:29,VGS:34,VGE:7},
    memberCount:"2.1M", aum:"$100B",
  },
  "netwealth-managed": {
    name:"Netwealth Managed Accounts", shortName:"Netwealth",
    type:"Retail", option:"Managed (adviser)",
    mer:0.22,
    geo:{AU:25,US:30,Global:30,EM:7,Bonds:3,Alternatives:5},
    etfEquivalent:{VAS:25,VGS:35,VGE:7},
    memberCount:"130K", aum:"$82B",
  },
  "none": {
    name:"None / Not sure", shortName:"Not set",
    type:"Industry", option:"—",
    mer:0, geo:{}, etfEquivalent:{},
    memberCount:"—", aum:"—",
  },
};

export const SUPER_FUND_LIST = Object.entries(SUPER_FUNDS).map(([id, f]) => ({
  id, name: f.name,
}));
