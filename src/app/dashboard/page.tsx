"use client";
// /dashboard — SmartETF analysis dashboard (authenticated)
// Uses shared usePortfolio hook; all logic lives in the hook + analysis engine.

import { useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import {
  Card, SectionLabel, ScoreRing, MiniBar, MetricCard, ScoreRow,
  IssuePill, LockOverlay, TabBar, Badge, Button, Input, Select,
} from "@/components/ui";
import { ETF_DB } from "@/data/etfDatabase";
import { fmtAUD, fmtPct } from "@/lib/analysis";
import type { OptimiserGoal } from "@/types";

const TABS = [
  { id:"health",    label:"Health score" },
  { id:"overlap",   label:"Overlap" },
  { id:"exposure",  label:"Exposure" },
  { id:"optimiser", label:"Optimiser" },
  { id:"sip",       label:"SIP plan" },
  { id:"whatif",    label:"What if" },
  { id:"settings",  label:"Portfolio" },
];

const SCORE_COLOR = (s: number) => s >= 75 ? "#1D9E75" : s >= 50 ? "#EF9F27" : "#E24B4A";
const GEO_COLORS: Record<string, string> = {
  US:"#378ADD", AU:"#1D9E75", Europe:"#7F77DD",
  Japan:"#EF9F27", EM:"#D85A30", Other:"#888780",
};

export default function DashboardPage() {
  const {
    user, profile, analysis, sipPlan, retirementScenarios,
    loading, saving, isSubscriber, setIsSubscriber,
    saveProfile, addHolding, updateHolding, removeHolding, getOptimiserResult,
    superFundList, supportedTickers,
  } = usePortfolio();

  const [tab, setTab] = useState("health");
  const [optimiserGoal, setOptimiserGoal] = useState<OptimiserGoal | null>(null);
  const [newTicker, setNewTicker] = useState("");
  const [newBalance, setNewBalance] = useState("");

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your portfolio…</p>
        </div>
      </div>
    );
  }

  const holdings = profile.portfolio?.holdings ?? [];
  const activeHoldings = holdings.filter(h => h.balance > 0);

  function handleAddHolding() {
    const ticker = newTicker.toUpperCase().trim();
    const balance = parseFloat(newBalance);
    if (ETF_DB[ticker] && balance > 0) {
      addHolding(ticker, balance);
      setNewTicker(""); setNewBalance("");
    }
  }

  const optimiserResult = optimiserGoal ? getOptimiserResult(optimiserGoal) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top nav */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold">Smart<span className="text-teal-600">ETF</span></span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white leading-none">Portfolio analysis</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {activeHoldings.map(h => h.ticker).join(" · ")} · Age {profile.age}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-gray-400">Saving…</span>}
            {!isSubscriber && (
              <Button variant="primary" size="sm" onClick={() => setIsSubscriber(true)}>
                Unlock full — $19/mo
              </Button>
            )}
            {isSubscriber && <Badge color="green">Pro</Badge>}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-5">
        <TabBar tabs={TABS} active={tab} onChange={setTab} />

        {/* ── HEALTH SCORE ─────────────────────────────────────────────────── */}
        {tab === "health" && analysis && (
          <div>
            <Card>
              <div className="flex items-center gap-5">
                <ScoreRing score={analysis.healthScores.composite} size={84} />
                <div>
                  <div className="text-xl font-medium text-gray-900 dark:text-white leading-snug">
                    {analysis.healthScores.composite < 50 ? "Needs work"
                      : analysis.healthScores.composite < 70 ? "Room to improve"
                      : analysis.healthScores.composite < 85 ? "Looking good"
                      : "Excellent portfolio"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {activeHoldings.length} ETFs · {fmtAUD(analysis.totalPortfolio)} total · {analysis.feeAnalysis.blendedMerPct.toFixed(2)}% MER
                  </div>
                </div>
              </div>

              <SectionLabel>Issues found</SectionLabel>
              {analysis.issues.length === 0 && (
                <p className="text-sm text-gray-500">No significant issues found — well-constructed portfolio.</p>
              )}
              {analysis.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2.5 mb-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{background: SCORE_COLOR(issue.severity === "high" ? 20 : issue.severity === "medium" ? 50 : 75)}} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{issue.message}</span>
                      <IssuePill severity={issue.severity} />
                    </div>
                    {issue.impact && <p className="text-xs text-gray-400 mt-0.5">{issue.impact}</p>}
                  </div>
                </div>
              ))}

              {analysis.strengths.length > 0 && (
                <>
                  <SectionLabel>Strengths</SectionLabel>
                  {analysis.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <span className="text-teal-500 text-sm mt-0.5">✓</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{s.message}</span>
                    </div>
                  ))}
                </>
              )}
            </Card>

            {/* Score breakdown — subscriber only */}
            {isSubscriber ? (
              <Card>
                <SectionLabel>Score breakdown</SectionLabel>
                <ScoreRow label="Overlap efficiency"   score={analysis.healthScores.overlap} />
                <ScoreRow label="Fee efficiency"       score={analysis.healthScores.fee} />
                <ScoreRow label="Diversification"      score={analysis.healthScores.diversification} />
                <ScoreRow label="Super alignment"      score={analysis.healthScores.superAlignment} />
                <ScoreRow label="Age-appropriate risk" score={analysis.healthScores.ageRisk} />
              </Card>
            ) : (
              <Card>
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">Score breakdown</div>
                <LockOverlay onUnlock={() => setIsSubscriber(true)} />
              </Card>
            )}

            {/* Fee analysis */}
            <Card>
              <SectionLabel>Fee analysis</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                <MetricCard value={`${analysis.feeAnalysis.blendedMerPct.toFixed(2)}%`} label="Blended MER" />
                <MetricCard value={fmtAUD(analysis.feeAnalysis.feeDrag10yr)} label="10yr fee drag" />
                <MetricCard value={fmtAUD(analysis.feeAnalysis.feeDrag20yr)} label="20yr fee drag" />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Fee drag on {fmtAUD(analysis.totalBrokerage)} at 8%/yr vs theoretical lowest-cost equivalent.
                Annual cost: {fmtAUD(analysis.feeAnalysis.annualFeeCost)}.
              </p>
            </Card>
          </div>
        )}

        {/* ── OVERLAP ─────────────────────────────────────────────────────── */}
        {tab === "overlap" && analysis && (
          <div>
            <Card>
              <SectionLabel>ETF overlap pairs</SectionLabel>
              {!analysis.overlapPairs.length ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  No significant overlap detected — clean portfolio!
                </div>
              ) : (
                analysis.overlapPairs.map((pair, i) => (
                  <div key={i} className={`pb-4 mb-4 ${i < analysis.overlapPairs.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {pair.etfA} + {pair.etfB}
                      </span>
                      <IssuePill severity={pair.severity} />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <MiniBar value={pair.overlapPct} color={SCORE_COLOR(100 - pair.overlapPct)} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px]">
                        {pair.overlapPct}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {pair.overlapPct > 85
                        ? "Near-identical exposure — you're paying two MERs for essentially the same index."
                        : pair.overlapPct > 50
                        ? "Significant duplication in top holdings — Apple, Microsoft, NVIDIA held in similar weights."
                        : "Moderate overlap in large-cap names — some diversification benefit remains."}
                    </p>
                  </div>
                ))
              )}
            </Card>

            {/* Top overlapping companies — subscriber */}
            {isSubscriber ? (
              <Card>
                <SectionLabel>Top overlapping companies</SectionLabel>
                {analysis.overlapPairs.length > 0 && [
                  { name:"Apple (AAPL)",    pct: Math.round(analysis.overlapPairs[0].overlapPct * 0.60) },
                  { name:"Microsoft (MSFT)", pct: Math.round(analysis.overlapPairs[0].overlapPct * 0.55) },
                  { name:"NVIDIA (NVDA)",   pct: Math.round(analysis.overlapPairs[0].overlapPct * 0.45) },
                  { name:"Amazon (AMZN)",   pct: Math.round(analysis.overlapPairs[0].overlapPct * 0.40) },
                  { name:"Alphabet (GOOGL)", pct: Math.round(analysis.overlapPairs[0].overlapPct * 0.35) },
                ].map((co, i) => (
                  <div key={i} className="flex items-center gap-3 mb-2.5">
                    <span className="text-sm text-gray-700 dark:text-gray-300 w-40 flex-shrink-0">{co.name}</span>
                    <MiniBar value={co.pct} color="#E24B4A" />
                    <span className="text-xs text-gray-500 min-w-[32px] text-right">{co.pct}%</span>
                  </div>
                ))}
              </Card>
            ) : (
              <Card>
                <div className="text-sm font-medium mb-1">Top overlapping companies</div>
                <LockOverlay onUnlock={() => setIsSubscriber(true)} />
              </Card>
            )}
          </div>
        )}

        {/* ── EXPOSURE ─────────────────────────────────────────────────────── */}
        {tab === "exposure" && analysis && (
          <div>
            <Card>
              <SectionLabel>Geographic exposure (incl. super)</SectionLabel>
              {analysis.geoExposure.map(g => (
                <div key={g.region} className="flex items-center gap-3 mb-2.5">
                  <div className="w-14 text-xs text-gray-500 flex-shrink-0">{g.region}</div>
                  <MiniBar value={g.pct} color={g.color} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[44px] text-right">{fmtPct(g.pct)}</span>
                </div>
              ))}
              {!analysis.hasEMExposure && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-700 dark:text-amber-400">
                  No emerging markets — consider VGE (0.48% MER) for China, India & SE Asia growth.
                </div>
              )}
            </Card>

            <Card>
              <SectionLabel>Sector breakdown (GICS)</SectionLabel>
              {analysis.sectorExposure.map(s => (
                <div key={s.sector} className="flex items-center gap-3 mb-2">
                  <div className="w-24 text-xs text-gray-500 flex-shrink-0">{s.sector}</div>
                  <MiniBar value={s.pct} max={45} color={s.pct > 35 ? "#E24B4A" : s.pct > 22 ? "#EF9F27" : "#1D9E75"} />
                  <span className="text-xs text-gray-500 min-w-[36px] text-right">{fmtPct(s.pct)}</span>
                </div>
              ))}
            </Card>

            {/* Factor exposure — subscriber */}
            {isSubscriber ? (
              <Card>
                <SectionLabel>Factor exposure</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard value={`${analysis.factorExposure.growthTilt}%`} label="Growth tilt" />
                  <MetricCard value={`${analysis.factorExposure.valueTilt}%`} label="Value tilt" />
                  <MetricCard value={`${analysis.factorExposure.qualityScore}%`} label="Quality score" />
                  <MetricCard value={`${analysis.factorExposure.largeCapPct}%`} label="Large-cap %" />
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-sm font-medium mb-1">Factor exposure (growth / value / quality)</div>
                <LockOverlay onUnlock={() => setIsSubscriber(true)} />
              </Card>
            )}

            {/* Super alignment */}
            {profile.superProfile?.fundId && profile.superProfile.fundId !== "none" && (
              <Card>
                <SectionLabel>Super fund alignment</SectionLabel>
                <p className="text-xs text-gray-500 mb-3">
                  Your super fund's holdings may duplicate your brokerage ETFs — creating hidden overweight positions.
                </p>
                {analysis.healthScores.superAlignment < 70 ? (
                  <div className="p-3 rounded-lg bg-amber-50 text-xs text-amber-700">
                    Super alignment score {analysis.healthScores.superAlignment}/100 — overlap detected between your super fund and brokerage ETFs. Check the Overlap tab for details.
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-teal-50 text-xs text-teal-700">
                    Good alignment — no significant duplication between super and brokerage portfolio detected.
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* ── OPTIMISER ────────────────────────────────────────────────────── */}
        {tab === "optimiser" && (
          <div>
            {!isSubscriber ? (
              <Card>
                <div className="text-sm font-medium mb-1">Portfolio Optimiser — AI-powered action plans</div>
                <LockOverlay onUnlock={() => setIsSubscriber(true)} />
              </Card>
            ) : (
              <>
                <Card>
                  <SectionLabel>Choose your optimisation goal</SectionLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      {id:"minimiseFees" as OptimiserGoal, icon:"💸", label:"Minimise fees", desc:"Lowest MER, same coverage"},
                      {id:"maximiseDiversification" as OptimiserGoal, icon:"🌍", label:"Maximise diversification", desc:"Broadest global exposure"},
                      {id:"maximiseGrowth" as OptimiserGoal, icon:"📈", label:"Maximise growth", desc:"High-growth factor tilt"},
                      {id:"fireStrategy" as OptimiserGoal, icon:"🏖️", label:"FIRE strategy", desc:"Early retirement optimised"},
                    ]).map(g => (
                      <button key={g.id}
                        onClick={() => setOptimiserGoal(optimiserGoal === g.id ? null : g.id)}
                        className={`text-left p-4 rounded-xl border transition-colors ${
                          optimiserGoal === g.id
                            ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}>
                        <div className="text-xl mb-2">{g.icon}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{g.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{g.desc}</div>
                      </button>
                    ))}
                  </div>
                </Card>

                {optimiserResult && (
                  <Card accent="teal">
                    <div className="mb-3">
                      <div className="text-base font-medium text-gray-900 dark:text-white">{optimiserResult.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{optimiserResult.description}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <MetricCard value={`${optimiserResult.blendedMer}%`} label="Blended MER" />
                      <MetricCard value={`${optimiserResult.projectedReturn}%`} label="Est. return/yr" />
                      <MetricCard value={fmtAUD(optimiserResult.proj10yr)} label="10yr projection" />
                    </div>

                    <SectionLabel>Recommended ETF mix</SectionLabel>
                    {optimiserResult.mix.map(m => (
                      <div key={m.ticker} className="flex items-center gap-3 mb-2.5">
                        <span className="text-sm font-medium w-14 text-gray-900 dark:text-white flex-shrink-0">{m.ticker}</span>
                        <MiniBar value={m.targetPct} max={55} color="#1D9E75" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[36px] text-right">{m.targetPct}%</span>
                        <span className="text-xs text-gray-400 hidden md:block">{ETF_DB[m.ticker]?.mer}% MER</span>
                      </div>
                    ))}

                    <SectionLabel>Action plan</SectionLabel>
                    {optimiserResult.actionPlan.map((a, i) => (
                      <div key={i}
                        className={`flex items-center justify-between gap-3 p-2.5 rounded-lg mb-2 text-sm
                          ${a.action === "buy" ? "bg-teal-50 dark:bg-teal-950/30"
                          : a.action === "exit" ? "bg-red-50 dark:bg-red-950/30"
                          : "bg-amber-50 dark:bg-amber-950/30"}`}>
                        <span className="font-medium text-gray-900 dark:text-white w-12">{a.ticker}</span>
                        <span className="text-gray-500 text-xs">{a.currentPct}% → {a.targetPct}%</span>
                        <span className={`font-medium text-xs ${
                          a.action === "buy" ? "text-teal-700"
                          : a.action === "exit" ? "text-red-700"
                          : "text-amber-700"}`}>
                          {a.action === "buy" ? `↑ Buy ${fmtAUD(a.dollarAmount)}`
                          : a.action === "exit" ? `Exit — sell ${fmtAUD(a.dollarAmount)}`
                          : a.action === "sell" ? `↓ Trim ${fmtAUD(a.dollarAmount)}`
                          : "On target"}
                        </span>
                      </div>
                    ))}
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* ── SIP PLAN ─────────────────────────────────────────────────────── */}
        {tab === "sip" && (
          <div>
            {!isSubscriber ? (
              <Card>
                <div className="text-sm font-medium mb-1">SIP Coordinator — monthly buy instructions</div>
                <LockOverlay onUnlock={() => setIsSubscriber(true)} />
              </Card>
            ) : (
              <Card>
                <SectionLabel>Monthly DCA coordinator</SectionLabel>
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm text-gray-500 flex-shrink-0">Monthly amount</label>
                  <Input
                    type="number" value={profile.monthlyContrib}
                    onChange={e => saveProfile({ monthlyContrib: parseInt(e.target.value) || 0 })}
                    className="w-32"
                  />
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Smart ETF tells you which ETF to buy each month to drift back toward target allocation — no selling, no unnecessary brokerage.
                </p>

                {sipPlan.length === 0 ? (
                  <p className="text-sm text-gray-400">Set target % allocations in the Portfolio tab to generate your SIP plan.</p>
                ) : (
                  <>
                    {sipPlan.map(item => (
                      <div key={item.ticker}
                        className={`flex items-center gap-3 p-3 rounded-xl mb-2 border ${
                          item.action === "buy"
                            ? "bg-teal-50 border-teal-200 dark:bg-teal-950/30 dark:border-teal-800"
                            : "bg-gray-50 border-gray-100 dark:bg-gray-900 dark:border-gray-800"
                        }`}>
                        <div className="w-14 flex-shrink-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{item.ticker}</div>
                          <div className="text-xs text-gray-400">{item.targetPct}% target</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Current {item.currentPct}%</span>
                            <span className={item.driftPct < -2 ? "text-teal-600" : item.driftPct > 2 ? "text-red-500" : "text-gray-400"}>
                              {item.driftPct > 0 ? `+${item.driftPct}% over` : item.driftPct < 0 ? `${item.driftPct}% under` : "on target"}
                            </span>
                          </div>
                          <MiniBar value={item.currentPct} max={60}
                            color={item.driftPct < -2 ? "#1D9E75" : item.driftPct > 2 ? "#E24B4A" : "#EF9F27"} />
                        </div>
                        <div className="text-right flex-shrink-0 min-w-[72px]">
                          {item.action === "buy" ? (
                            <>
                              <div className="text-sm font-medium text-teal-700">{fmtAUD(item.buyAmount)}</div>
                              <div className="text-xs text-teal-600">buy this month</div>
                            </>
                          ) : (
                            <div className="text-xs text-gray-400">hold / skip</div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mt-2 text-xs text-gray-500 flex justify-between">
                      <span>Buy this month: {sipPlan.filter(p=>p.action==="buy").map(p=>p.ticker).join(", ")}</span>
                      <span className="font-medium">{fmtAUD(profile.monthlyContrib)}</span>
                    </div>
                  </>
                )}
              </Card>
            )}
          </div>
        )}

        {/* ── WHAT IF / SCENARIOS ───────────────────────────────────────────── */}
        {tab === "whatif" && (
          <div>
            {!isSubscriber ? (
              <Card>
                <div className="text-sm font-medium mb-1">Smart Portfolio Builder + Rebalance Calculator</div>
                <LockOverlay onUnlock={() => setIsSubscriber(true)} />
              </Card>
            ) : (
              <>
                <Card>
                  <SectionLabel>Goal-based portfolio scenarios</SectionLabel>
                  <p className="text-xs text-gray-400 mb-4">
                    Built for age {profile.age}, {profile.riskProfile} risk,{" "}
                    {fmtAUD(analysis?.totalPortfolio ?? 0)} total, ${profile.monthlyContrib.toLocaleString()}/mo.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {retirementScenarios.map(sc => (
                      <div key={sc.goal} className="border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">{sc.goal}</div>
                        {sc.etfs.map((m: {e:string,p:number}) => (
                          <div key={m.e} className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium w-12 text-gray-700 dark:text-gray-300">{m.e}</span>
                            <MiniBar value={m.p} max={50} color="#1D9E75" height={4} />
                            <span className="text-xs text-gray-500 min-w-[28px] text-right">{m.p}%</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <span className="text-xs text-gray-400">{sc.blendedMer.toFixed(2)}% MER</span>
                          <span className="text-sm font-medium text-teal-600">{fmtAUD(sc.projectedBalance)} in {sc.yrs}yr</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Projections assume consistent contributions and historical returns. Not financial advice.</p>
                </Card>

                {/* Rebalance calculator */}
                {analysis && (
                  <Card>
                    <SectionLabel>Rebalance calculator</SectionLabel>
                    {activeHoldings.filter(h => h.targetPct > 0).length === 0 ? (
                      <p className="text-sm text-gray-400">Set target % in the Portfolio tab to use the rebalance calculator.</p>
                    ) : (
                      <>
                        {activeHoldings.filter(h => h.targetPct > 0).map(h => {
                          const cur = h.balance / analysis.totalBrokerage * 100;
                          const diff = h.targetPct - cur;
                          const dollar = Math.abs(diff / 100 * analysis.totalBrokerage);
                          return (
                            <div key={h.ticker}
                              className={`flex items-center gap-3 p-2.5 rounded-lg mb-2 text-sm ${
                                Math.abs(diff) < 2 ? "bg-gray-50 dark:bg-gray-900"
                                : diff > 0 ? "bg-teal-50 dark:bg-teal-950/30"
                                : "bg-amber-50 dark:bg-amber-950/30"}`}>
                              <span className="font-medium w-14 text-gray-900 dark:text-white">{h.ticker}</span>
                              <span className="text-xs text-gray-500">{Math.round(cur * 10)/10}% → {h.targetPct}%</span>
                              <span className={`ml-auto text-xs font-medium ${
                                Math.abs(diff) < 2 ? "text-gray-400"
                                : diff > 0 ? "text-teal-700" : "text-amber-700"}`}>
                                {Math.abs(diff) < 2 ? "On target"
                                : diff > 0 ? `Buy ${fmtAUD(dollar)}`
                                : `Sell ${fmtAUD(dollar)}`}
                              </span>
                            </div>
                          );
                        })}
                        <p className="text-xs text-gray-400 mt-2">
                          Tip: use SIP tab to buy underweight positions over time before selling — avoids CGT events.
                        </p>
                      </>
                    )}
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* ── PORTFOLIO SETTINGS ────────────────────────────────────────────── */}
        {tab === "settings" && (
          <div>
            {/* Profile */}
            <Card>
              <SectionLabel>About you</SectionLabel>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input label="Age" type="number" value={profile.age}
                  onChange={e => saveProfile({ age: parseInt(e.target.value) || 35 })} />
                <Input label="Monthly contributions ($)" type="number" value={profile.monthlyContrib}
                  onChange={e => saveProfile({ monthlyContrib: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2">Risk profile</label>
                <div className="flex gap-2 flex-wrap">
                  {(["conservative","moderate","growth","aggressive"] as const).map(r => (
                    <button key={r} onClick={() => saveProfile({ riskProfile: r })}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        profile.riskProfile === r
                          ? "bg-teal-50 border-teal-500 text-teal-700 font-medium"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      {r[0].toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Super fund */}
            <Card>
              <SectionLabel>Superannuation</SectionLabel>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Super fund"
                  value={profile.superProfile?.fundId ?? "none"}
                  onChange={e => saveProfile({ superProfile: { ...profile.superProfile!, fundId: e.target.value } })}>
                  {superFundList.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </Select>
                <Input label="Super balance ($)" type="number"
                  value={profile.superProfile?.balance ?? 0}
                  onChange={e => saveProfile({ superProfile: { ...profile.superProfile!, balance: parseFloat(e.target.value) || 0 } })} />
              </div>
            </Card>

            {/* Holdings */}
            <Card>
              <SectionLabel>ETF holdings</SectionLabel>
              {holdings.map(h => (
                <div key={h.ticker} className="grid grid-cols-[56px_1fr_72px_28px] gap-2 items-center mb-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{h.ticker}</div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Balance ($)</div>
                    <Input type="number" value={h.balance || ""}
                      onChange={e => updateHolding(h.ticker, { balance: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Target %</div>
                    <Input type="number" value={h.targetPct || ""}
                      onChange={e => updateHolding(h.ticker, { targetPct: parseInt(e.target.value) || 0 })} />
                  </div>
                  <button onClick={() => removeHolding(h.ticker)}
                    className="text-gray-300 hover:text-red-400 transition-colors mt-5 text-lg leading-none">×</button>
                </div>
              ))}

              <div className="grid grid-cols-[56px_1fr_72px_28px] gap-2 items-end pt-3 border-t border-gray-100 dark:border-gray-800">
                <Input value={newTicker} onChange={e => setNewTicker(e.target.value.toUpperCase())}
                  placeholder="Ticker" className="uppercase" />
                <Input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)}
                  placeholder="Balance $" />
                <Button variant="secondary" size="sm" onClick={handleAddHolding}>Add</Button>
                <div />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Supported: {supportedTickers.join(", ")}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
