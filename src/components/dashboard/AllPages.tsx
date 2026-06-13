"use client";
import React, { useMemo, useState } from "react";
import { C, S, fmtAUD, fmtPct, scoreColor } from "@/lib/styles";
import {
  Card, SectionLabel, PageHeader, LockOverlay, MiniBar,
  GeoBar, MetricGrid, FeatureCard, Input, Select, ScoreRow,
} from "@/components/ui";
import { analysePortfolio, optimisePortfolio, generateSIPPlan, buildRetirementScenarios } from "@/lib/analysis";
import { ETF_DB } from "@/data/etfDatabase";
import { SUPER_FUND_LIST } from "@/data/superFunds";
import type { FinancialProfile, OptimiserGoal } from "@/types";

interface Props {
  profile: FinancialProfile;
  isSubscriber: boolean;
  onUnlock: () => void;
  saveProfile?: (updates: Partial<FinancialProfile>) => void;
}

// ── EXPOSURE PAGE ─────────────────────────────────────────────────────────────
export function ExposurePage({ profile, isSubscriber, onUnlock }: Props) {
  const analysis = useMemo(() => analysePortfolio(profile), [profile]);

  return (
    <div>
      <PageHeader badge="SmartETF · Free tool" title="Exposure map"
        subtitle="Your consolidated geographic, sector, and factor breakdown — including super."/>

      {!analysis ? (
        <Card><div style={{textAlign:"center",padding:"40px 0",color:C.gray400}}>
          Add holdings to see your exposure map.
        </div></Card>
      ) : (
        <>
          <Card>
            <SectionLabel>Geographic exposure (incl. super)</SectionLabel>
            {analysis.geoExposure.map(g => (
              <GeoBar key={g.region} region={g.region} pct={g.pct} color={g.color}/>
            ))}
            {!analysis.hasEMExposure && (
              <div style={{marginTop:12,padding:"12px 14px",background:C.amberLight,borderRadius:8,
                fontSize:13,color:C.amberDark,lineHeight:1.6}}>
                <strong>No emerging markets exposure</strong> — China, India, and SE Asia represent
                ~13% of global market cap. Consider adding VGE (0.48% MER) for diversification.
              </div>
            )}
            {!analysis.hasSmallCap && (
              <div style={{marginTop:8,padding:"12px 14px",background:C.blueLight,borderRadius:8,
                fontSize:13,color:C.blueDark,lineHeight:1.6}}>
                <strong>No small-cap allocation</strong> — small caps represent ~20% of global market cap
                and have historically provided a return premium over the long run.
              </div>
            )}
          </Card>

          <Card>
            <SectionLabel>Sector breakdown (GICS 11 sectors)</SectionLabel>
            {analysis.sectorExposure.map(s => (
              <div key={s.sector} style={{display:"flex",alignItems:"center",
                gap:12,marginBottom:8}}>
                <div style={{width:100,fontSize:13,color:C.gray600,flexShrink:0}}>{s.sector}</div>
                <MiniBar value={s.pct} max={45}
                  color={s.pct>35?C.red:s.pct>22?C.amber:C.teal} height={7}/>
                <span style={{fontSize:13,fontWeight:600,
                  color:s.pct>35?C.red:s.pct>22?C.amber:C.gray600,
                  minWidth:40,textAlign:"right"}}>{fmtPct(s.pct)}</span>
              </div>
            ))}
          </Card>

          {/* Factor exposure — subscriber */}
          {isSubscriber ? (
            <Card>
              <SectionLabel>Factor exposure</SectionLabel>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {label:"Growth tilt", value:`${analysis.factorExposure.growthTilt}%`,
                    color:analysis.factorExposure.growthTilt>70?C.teal:C.amber},
                  {label:"Value tilt",  value:`${analysis.factorExposure.valueTilt}%`,
                    color:C.gray600},
                  {label:"Quality score",value:`${analysis.factorExposure.qualityScore}%`,
                    color:analysis.factorExposure.qualityScore>70?C.teal:C.amber},
                  {label:"Large-cap %", value:`${analysis.factorExposure.largeCapPct}%`,
                    color:C.gray600},
                ].map(({label,value,color}) => (
                  <div key={label} style={{background:C.gray50,borderRadius:10,padding:"14px 16px"}}>
                    <div style={{fontSize:11,color:C.gray400,marginBottom:4}}>{label}</div>
                    <div style={{fontSize:22,fontWeight:700,color}}>{value}</div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <SectionLabel>Factor exposure (growth / value / quality)</SectionLabel>
              <LockOverlay onUnlock={onUnlock}/>
            </Card>
          )}

          {/* Super alignment */}
          {profile.superProfile?.fundId && profile.superProfile.fundId !== "none" && (
            <Card accent={analysis.healthScores.superAlignment < 70 ? C.amber : C.teal}>
              <SectionLabel>Super fund alignment</SectionLabel>
              <div style={{fontSize:13,color:C.gray600,marginBottom:10,lineHeight:1.6}}>
                Your super fund's investment allocation may duplicate your brokerage ETF holdings —
                creating hidden overweight positions you're not aware of.
              </div>
              <div style={{padding:"12px 14px",borderRadius:8,
                background: analysis.healthScores.superAlignment < 70 ? C.amberLight : C.tealLight}}>
                <div style={{fontSize:13,fontWeight:600,
                  color: analysis.healthScores.superAlignment < 70 ? C.amberDark : C.tealDark}}>
                  {analysis.healthScores.superAlignment < 70
                    ? "Overlap detected between super and brokerage — check the Overlap Scanner tab for details."
                    : "Good alignment — no significant duplication between your super and brokerage portfolio."}
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ── OPTIMISER PAGE ────────────────────────────────────────────────────────────
export function OptimiserPage({ profile, isSubscriber, onUnlock }: Props) {
  const [goal, setGoal] = useState<OptimiserGoal|null>(null);
  const analysis = useMemo(() => analysePortfolio(profile), [profile]);

  const result = useMemo(() => {
    if (!goal || !analysis) return null;
    return optimisePortfolio(goal, profile, analysis);
  }, [goal, analysis, profile]);

  const goals = [
    {id:"minimiseFees" as OptimiserGoal, icon:"💸", title:"Minimise fees",
      desc:"Lowest possible MER while maintaining broad coverage"},
    {id:"maximiseDiversification" as OptimiserGoal, icon:"🌍", title:"Maximise diversification",
      desc:"Broadest exposure across all geographies and factors"},
    {id:"maximiseGrowth" as OptimiserGoal, icon:"📈", title:"Maximise growth",
      desc:"Highest expected long-run return with quality tilt"},
    {id:"fireStrategy" as OptimiserGoal, icon:"🏖️", title:"FIRE strategy",
      desc:"Early retirement — growth, income, and low fees combined"},
  ];

  return (
    <div>
      <PageHeader badge="SmartETF · Subscriber tool" title="Portfolio optimiser"
        subtitle="Choose a goal and get a personalised ETF mix with exact buy/sell actions."/>

      {!isSubscriber ? (
        <>
          <Card>
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:40,marginBottom:12}}>↗</div>
              <div style={{fontSize:17,fontWeight:700,color:C.gray800,marginBottom:8}}>
                Portfolio optimiser
              </div>
              <p style={{fontSize:14,color:C.gray500,maxWidth:400,margin:"0 auto 20px",lineHeight:1.6}}>
                Choose a goal — minimise fees, maximise growth, or FIRE — and get a complete
                ETF mix with exact dollar amounts to buy and sell.
              </p>
              <LockOverlay onUnlock={onUnlock}/>
            </div>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <SectionLabel>Choose your optimisation goal</SectionLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {goals.map(g => (
                <button key={g.id} onClick={()=>setGoal(goal===g.id?null:g.id)} style={{
                  textAlign:"left",padding:"16px",borderRadius:10,cursor:"pointer",
                  background: goal===g.id ? C.tealLight : C.gray50,
                  border: `1.5px solid ${goal===g.id ? C.teal : C.gray200}`,
                  transition:"all 0.15s",
                }}>
                  <div style={{fontSize:24,marginBottom:8}}>{g.icon}</div>
                  <div style={{fontSize:14,fontWeight:700,color:C.gray900,marginBottom:3}}>{g.title}</div>
                  <div style={{fontSize:12,color:C.gray500,lineHeight:1.5}}>{g.desc}</div>
                </button>
              ))}
            </div>
          </Card>

          {result && (
            <Card accent={C.teal}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:17,fontWeight:700,color:C.gray900}}>{result.label}</div>
                <div style={{fontSize:13,color:C.gray500,marginTop:2}}>{result.description}</div>
              </div>
              <MetricGrid items={[
                {value:`${result.blendedMer}%`, label:"Blended MER"},
                {value:`${result.projectedReturn}%`, label:"Est. return/yr"},
                {value:fmtAUD(result.proj10yr), label:"10yr projection",color:C.teal},
                {value:fmtAUD(result.proj20yr), label:"20yr projection",color:C.teal},
              ]}/>

              <SectionLabel>Recommended ETF mix</SectionLabel>
              {result.mix.map(m => (
                <div key={m.ticker} style={{display:"flex",alignItems:"center",
                  gap:10,marginBottom:10}}>
                  <div style={{width:52,flexShrink:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.gray900}}>{m.ticker}</div>
                    <div style={{fontSize:10,color:C.gray400}}>{ETF_DB[m.ticker]?.mer}% MER</div>
                  </div>
                  <div style={{flex:1}}>
                    <MiniBar value={m.targetPct} max={55} color={C.teal} height={7}/>
                  </div>
                  <div style={{fontSize:14,fontWeight:700,color:C.gray900,minWidth:36,textAlign:"right"}}>
                    {m.targetPct}%
                  </div>
                  <div style={{fontSize:11,color:C.gray400,minWidth:80,lineHeight:1.4}}>
                    {m.rationale}
                  </div>
                </div>
              ))}

              <SectionLabel>Action plan — what to change</SectionLabel>
              {result.actionPlan.map((a,i) => (
                <div key={i} style={{
                  display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                  borderRadius:8,marginBottom:8,
                  background: a.action==="buy" ? C.tealLight
                    : a.action==="exit" ? C.redLight : C.amberLight,
                  border: `1px solid ${a.action==="buy"?C.tealMid:a.action==="exit"?C.red:C.amber}`,
                }}>
                  <span style={{fontSize:14,fontWeight:700,color:C.gray900,width:52,flexShrink:0}}>
                    {a.ticker}
                  </span>
                  <span style={{fontSize:13,color:C.gray500}}>
                    {a.currentPct}% → {a.targetPct}%
                  </span>
                  <span style={{marginLeft:"auto",fontSize:13,fontWeight:700,
                    color: a.action==="buy"?C.tealDark:a.action==="exit"?C.redDark:C.amberDark}}>
                    {a.action==="buy" ? `↑ Buy ${fmtAUD(a.dollarAmount)}`
                      : a.action==="exit" ? `Exit — sell ${fmtAUD(a.dollarAmount)}`
                      : a.action==="sell" ? `↓ Trim ${fmtAUD(a.dollarAmount)}`
                      : "On target ✓"}
                  </span>
                </div>
              ))}
              <p style={{fontSize:11,color:C.gray400,margin:"8px 0 0",lineHeight:1.5}}>
                Not financial advice. Consult a licensed adviser before making investment decisions.
                CGT implications may apply when selling.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ── SIP PAGE ──────────────────────────────────────────────────────────────────
export function SIPPage({ profile, isSubscriber, onUnlock, saveProfile }: Props) {
  const analysis = useMemo(() => analysePortfolio(profile), [profile]);
  const sipPlan = useMemo(() => {
    if (!analysis) return [];
    return generateSIPPlan(profile, analysis);
  }, [analysis, profile]);

  return (
    <div>
      <PageHeader badge="SmartETF · Subscriber tool" title="SIP coordinator"
        subtitle="Monthly DCA instructions — exactly which ETF to buy to maintain target allocation without selling."/>

      {!isSubscriber ? (
        <Card>
          <FeatureCard icon="⟳" title="SIP coordinator"
            desc="Enter your monthly contribution amount and get exact buy instructions for each fund to stay on target — no selling, no wasted brokerage."/>
          <LockOverlay onUnlock={onUnlock}/>
        </Card>
      ) : (
        <>
          <Card>
            <SectionLabel>Monthly contribution</SectionLabel>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Input label="DCA amount per month ($)" type="number"
                value={profile.monthlyContrib}
                onChange={e=>saveProfile?.({monthlyContrib:parseInt(e.target.value)||0})}
                style={{width:160}}/>
              <div style={{fontSize:13,color:C.gray500,marginTop:18,lineHeight:1.5}}>
                Smart ETF allocates this across your underweight positions each month.
              </div>
            </div>
          </Card>

          {sipPlan.length === 0 ? (
            <Card>
              <div style={{textAlign:"center",padding:"32px 0",color:C.gray400}}>
                <div style={{fontSize:32,marginBottom:8}}>📋</div>
                Set target % allocations in My Portfolio to generate your SIP plan.
              </div>
            </Card>
          ) : (
            <>
              {sipPlan.map(item => (
                <div key={item.ticker} style={{
                  ...S.card,
                  display:"flex",alignItems:"center",gap:14,
                  background: item.action==="buy" ? "#F0FDF8" : C.white,
                  border: `1px solid ${item.action==="buy" ? C.tealMid : C.gray200}`,
                }}>
                  <div style={{width:56,flexShrink:0}}>
                    <div style={{fontSize:18,fontWeight:700,color:C.gray900}}>{item.ticker}</div>
                    <div style={{fontSize:11,color:C.gray400}}>{item.targetPct}% target</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",
                      fontSize:12,color:C.gray400,marginBottom:4}}>
                      <span>Current {item.currentPct.toFixed(1)}%</span>
                      <span style={{color:item.driftPct<-2?C.teal:item.driftPct>2?C.red:C.gray400}}>
                        {item.driftPct>0?`+${item.driftPct}% over`:
                          item.driftPct<0?`${item.driftPct}% under`:"On target"}
                      </span>
                    </div>
                    <MiniBar value={item.currentPct} max={60}
                      color={item.driftPct<-2?C.teal:item.driftPct>2?C.red:C.amber} height={7}/>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0,minWidth:80}}>
                    {item.action==="buy" ? (
                      <>
                        <div style={{fontSize:18,fontWeight:700,color:C.teal}}>
                          {fmtAUD(item.buyAmount)}
                        </div>
                        <div style={{fontSize:11,color:C.tealDark}}>buy this month</div>
                      </>
                    ) : (
                      <div style={{fontSize:13,color:C.gray400}}>hold / skip</div>
                    )}
                  </div>
                </div>
              ))}
              <div style={{...S.card,background:C.gray50}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                  <span style={{color:C.gray600}}>Buy this month</span>
                  <span style={{fontWeight:700,color:C.gray900}}>
                    {sipPlan.filter(p=>p.action==="buy").map(p=>p.ticker).join(", ")}
                  </span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginTop:6}}>
                  <span style={{color:C.gray600}}>Total</span>
                  <span style={{fontWeight:700,color:C.teal}}>{fmtAUD(profile.monthlyContrib)}</span>
                </div>
              </div>
              <p style={{fontSize:12,color:C.gray400,padding:"0 0 8px"}}>
                Tip: buying underweight positions avoids triggering CGT events compared to selling overweight ones first.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ── SCENARIOS PAGE ────────────────────────────────────────────────────────────
export function ScenariosPage({ profile, isSubscriber, onUnlock }: Props) {
  const analysis = useMemo(() => analysePortfolio(profile), [profile]);
  const scenarios = useMemo(() => {
    if (!analysis) return [];
    return buildRetirementScenarios(profile, analysis);
  }, [analysis, profile]);

  return (
    <div>
      <PageHeader badge="SmartETF · Subscriber tool" title="What if scenarios"
        subtitle="Goal-based portfolio construction and rebalance calculator."/>

      {!isSubscriber ? (
        <Card>
          <FeatureCard icon="◈" title="What if scenarios"
            desc="Model four goal-based portfolios — FIRE at 50, retire at 60, aggressive growth, or balanced. See projected balances across each and get a rebalance calculator."/>
          <LockOverlay onUnlock={onUnlock}/>
        </Card>
      ) : (
        <>
          <Card>
            <SectionLabel>Goal-based portfolio scenarios</SectionLabel>
            <p style={{fontSize:13,color:C.gray500,marginBottom:16,lineHeight:1.6}}>
              Built for age {profile.age}, {profile.riskProfile} risk,{" "}
              {fmtAUD(analysis?.totalPortfolio??0)} total,{" "}
              ${profile.monthlyContrib.toLocaleString()}/mo contributions.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {scenarios.map(sc => (
                <div key={sc.goal} style={{
                  border:`1px solid ${C.gray200}`,borderRadius:12,padding:"16px",
                  background:C.white,
                }}>
                  <div style={{fontSize:14,fontWeight:700,color:C.gray900,marginBottom:12}}>
                    {sc.goal}
                  </div>
                  {sc.etfs.map((m: {e:string;p:number}) => (
                    <div key={m.e} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:12,fontWeight:700,width:44,color:C.gray800}}>{m.e}</span>
                      <MiniBar value={m.p} max={50} color={C.teal} height={5}/>
                      <span style={{fontSize:12,color:C.gray500,minWidth:30,textAlign:"right"}}>{m.p}%</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",
                    marginTop:12,paddingTop:10,borderTop:`1px solid ${C.gray100}`}}>
                    <span style={{fontSize:11,color:C.gray400}}>{sc.blendedMer.toFixed(2)}% MER</span>
                    <span style={{fontSize:14,fontWeight:700,color:C.teal}}>
                      {fmtAUD(sc.projectedBalance)} in {sc.yrs}yr
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{fontSize:11,color:C.gray400,marginTop:12}}>
              Projections assume consistent contributions and historical average returns. Not financial advice.
            </p>
          </Card>

          {/* Rebalance calculator */}
          {analysis && (
            <Card>
              <SectionLabel>Rebalance calculator</SectionLabel>
              {analysis.etfKeys.filter(k=>{
                const h = profile.portfolio?.holdings.find(h=>h.ticker===k);
                return h && h.targetPct > 0;
              }).length === 0 ? (
                <div style={{textAlign:"center",padding:"24px 0",color:C.gray400,fontSize:13}}>
                  Set target % in My Portfolio to use the rebalance calculator.
                </div>
              ) : (
                <>
                  {analysis.etfKeys.map(k => {
                    const h = profile.portfolio?.holdings.find(h=>h.ticker===k);
                    if (!h || !h.targetPct) return null;
                    const cur = h.balance / analysis.totalBrokerage * 100;
                    const diff = h.targetPct - cur;
                    const dollar = Math.abs(diff/100 * analysis.totalBrokerage);
                    return (
                      <div key={k} style={{
                        display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                        borderRadius:8,marginBottom:8,
                        background: Math.abs(diff)<2 ? C.gray50
                          : diff>0 ? C.tealLight : C.amberLight,
                      }}>
                        <span style={{fontSize:14,fontWeight:700,color:C.gray900,width:52}}>{k}</span>
                        <span style={{fontSize:13,color:C.gray500}}>
                          {Math.round(cur*10)/10}% → {h.targetPct}%
                        </span>
                        <span style={{marginLeft:"auto",fontSize:13,fontWeight:700,
                          color: Math.abs(diff)<2?C.gray400:diff>0?C.tealDark:C.amberDark}}>
                          {Math.abs(diff)<2 ? "On target ✓"
                            : diff>0 ? `Buy ${fmtAUD(dollar)}`
                            : `Sell ${fmtAUD(dollar)}`}
                        </span>
                      </div>
                    );
                  })}
                  <p style={{fontSize:12,color:C.gray400,margin:"8px 0 0"}}>
                    Before selling, consider using the SIP plan to buy underweight positions over time — avoids CGT events.
                  </p>
                </>
              )}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// ── PORTFOLIO SETTINGS ────────────────────────────────────────────────────────
export function PortfolioSettings({ profile, saveProfile, isSubscriber }: Props) {
  const [newTicker, setNewTicker] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const holdings = profile.portfolio?.holdings ?? [];

  function addHolding() {
    const ticker = newTicker.toUpperCase().trim();
    const balance = parseFloat(newBalance);
    if (!ETF_DB[ticker]) { alert(`${ticker} not found. Supported: ${Object.keys(ETF_DB).join(", ")}`); return; }
    if (!balance || balance <= 0) { alert("Enter a valid balance."); return; }
    const updated = [...holdings, { ticker, balance, targetPct:0 }];
    saveProfile?.({ portfolio:{...profile.portfolio!, holdings:updated,
      totalBalance:updated.reduce((s,h)=>s+h.balance,0)} });
    setNewTicker(""); setNewBalance("");
  }

  function updateHolding(ticker:string, field:"balance"|"targetPct", val:number) {
    const updated = holdings.map(h => h.ticker===ticker ? {...h,[field]:val} : h);
    saveProfile?.({ portfolio:{...profile.portfolio!, holdings:updated,
      totalBalance:updated.reduce((s,h)=>s+h.balance,0)} });
  }

  function removeHolding(ticker:string) {
    const updated = holdings.filter(h=>h.ticker!==ticker);
    saveProfile?.({ portfolio:{...profile.portfolio!, holdings:updated,
      totalBalance:updated.reduce((s,h)=>s+h.balance,0)} });
  }

  return (
    <div>
      <PageHeader title="My portfolio" subtitle="Update your holdings, superannuation, and personal details."/>

      {/* Personal details */}
      <Card>
        <SectionLabel>Personal details</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <Input label="Age" type="number" value={profile.age}
            onChange={e=>saveProfile?.({age:parseInt(e.target.value)||35})}/>
          <Input label="Monthly DCA contribution ($)" type="number" value={profile.monthlyContrib}
            onChange={e=>saveProfile?.({monthlyContrib:parseInt(e.target.value)||0})}/>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:12,color:C.gray500,fontWeight:500,marginBottom:8}}>
            Risk profile
          </label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {(["conservative","moderate","growth","aggressive"] as const).map(r => (
              <button key={r} onClick={()=>saveProfile?.({riskProfile:r})} style={{
                padding:"8px 16px",fontSize:13,fontWeight:500,borderRadius:8,cursor:"pointer",
                background: profile.riskProfile===r ? C.tealLight : C.white,
                color: profile.riskProfile===r ? C.tealDark : C.gray600,
                border:`1.5px solid ${profile.riskProfile===r ? C.teal : C.gray200}`,
              }}>
                {r[0].toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <Input label="Target retirement age" type="number" value={profile.retirementGoalAge??55}
          onChange={e=>saveProfile?.({retirementGoalAge:parseInt(e.target.value)||55})}
          style={{width:140}}/>
      </Card>

      {/* Super fund */}
      <Card>
        <SectionLabel>Superannuation</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Select label="Super fund"
            value={profile.superProfile?.fundId??"none"}
            onChange={e=>saveProfile?.({superProfile:{...profile.superProfile!,fundId:e.target.value}})}>
            {SUPER_FUND_LIST.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </Select>
          <Input label="Super balance ($)" type="number"
            value={profile.superProfile?.balance??0}
            onChange={e=>saveProfile?.({superProfile:{...profile.superProfile!,
              balance:parseFloat(e.target.value)||0}})}/>
        </div>
      </Card>

      {/* ETF holdings */}
      <Card>
        <SectionLabel>ETF holdings (brokerage account)</SectionLabel>

        {/* Column headers */}
        <div style={{display:"grid",gridTemplateColumns:"64px 1fr 80px 80px 28px",
          gap:8,marginBottom:8}}>
          <div style={{fontSize:11,color:C.gray400,fontWeight:500}}>Ticker</div>
          <div style={{fontSize:11,color:C.gray400,fontWeight:500}}>Fund name</div>
          <div style={{fontSize:11,color:C.gray400,fontWeight:500}}>Balance ($)</div>
          <div style={{fontSize:11,color:C.gray400,fontWeight:500}}>Target %</div>
          <div/>
        </div>

        {holdings.map(h => {
          const etf = ETF_DB[h.ticker];
          return (
            <div key={h.ticker} style={{display:"grid",
              gridTemplateColumns:"64px 1fr 80px 80px 28px",
              gap:8,alignItems:"center",marginBottom:8,
              padding:"8px 0",borderBottom:`1px solid ${C.gray100}`}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.gray900}}>{h.ticker}</div>
                <div style={{fontSize:10,color:C.teal}}>{etf?.mer}% MER</div>
              </div>
              <div style={{fontSize:12,color:C.gray500,overflow:"hidden",
                textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {etf?.name ?? h.ticker}
              </div>
              <input type="number" value={h.balance||""} placeholder="0"
                onChange={e=>updateHolding(h.ticker,"balance",parseFloat(e.target.value)||0)}
                style={{...S.input,padding:"6px 8px",fontSize:13}}/>
              <input type="number" value={h.targetPct||""} placeholder="0"
                onChange={e=>updateHolding(h.ticker,"targetPct",parseInt(e.target.value)||0)}
                style={{...S.input,padding:"6px 8px",fontSize:13}}/>
              <button onClick={()=>removeHolding(h.ticker)}
                style={{background:"none",border:"none",cursor:"pointer",
                  color:C.gray300,fontSize:18,padding:0,lineHeight:1}}>×</button>
            </div>
          );
        })}

        {/* Add new */}
        <div style={{display:"grid",gridTemplateColumns:"64px 1fr 80px 80px 28px",
          gap:8,alignItems:"flex-end",paddingTop:12,borderTop:`1px solid ${C.gray100}`}}>
          <input value={newTicker} onChange={e=>setNewTicker(e.target.value.toUpperCase())}
            placeholder="Ticker" style={{...S.input,padding:"7px 8px",fontSize:13,textTransform:"uppercase"}}/>
          <div style={{fontSize:11,color:C.gray400,paddingBottom:8}}>
            {ETF_DB[newTicker] ? ETF_DB[newTicker].name : `Supported: ${Object.keys(ETF_DB).slice(0,6).join(", ")}…`}
          </div>
          <input type="number" value={newBalance} onChange={e=>setNewBalance(e.target.value)}
            placeholder="Balance $" style={{...S.input,padding:"7px 8px",fontSize:13}}/>
          <div/>
          <button onClick={addHolding} style={{
            ...S.btnPrimary,padding:"7px 0",fontSize:13,borderRadius:8,
            justifyContent:"center",minWidth:0}}>+</button>
        </div>

        <div style={{marginTop:8,fontSize:12,color:C.gray400}}>
          Supported ETFs: {Object.keys(ETF_DB).join(", ")}
        </div>
      </Card>

      {/* Total summary */}
      {holdings.length > 0 && (
        <Card accent={C.teal}>
          <SectionLabel>Portfolio summary</SectionLabel>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <div style={{background:C.gray50,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:C.gray900}}>
                {fmtAUD(holdings.reduce((s,h)=>s+h.balance,0))}
              </div>
              <div style={{fontSize:11,color:C.gray400,marginTop:2}}>Brokerage total</div>
            </div>
            <div style={{background:C.gray50,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:C.gray900}}>
                {fmtAUD((profile.superProfile?.balance??0)+holdings.reduce((s,h)=>s+h.balance,0))}
              </div>
              <div style={{fontSize:11,color:C.gray400,marginTop:2}}>Total portfolio</div>
            </div>
            <div style={{background:C.gray50,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:C.gray900}}>
                {holdings.length}
              </div>
              <div style={{fontSize:11,color:C.gray400,marginTop:2}}>ETFs held</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
