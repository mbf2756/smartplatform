"use client";
import React, { useState, useMemo } from "react";
import { C, S, fmtAUD, fmtPct, scoreColor } from "@/lib/styles";
import {
  ScoreRing, ScoreBand, MetricGrid, IssueCard, StrengthCard,
  SectionLabel, PageHeader, Card, LockOverlay, ScoreRow, MiniBar,
} from "@/components/ui";
import { analysePortfolio } from "@/lib/analysis";
import type { FinancialProfile } from "@/types";

interface Props {
  profile: FinancialProfile;
  isSubscriber: boolean;
  onUnlock: () => void;
}

export default function HealthScorePage({ profile, isSubscriber, onUnlock }: Props) {
  const analysis = useMemo(() => analysePortfolio(profile), [profile]);

  if (!analysis) {
    return (
      <div style={{textAlign:"center",padding:"60px 20px"}}>
        <div style={{fontSize:48,marginBottom:16}}>📊</div>
        <div style={{fontSize:18,fontWeight:600,color:C.gray800,marginBottom:8}}>
          Add your ETF holdings to get started
        </div>
        <p style={{fontSize:14,color:C.gray500,maxWidth:360,margin:"0 auto 20px"}}>
          Go to My Portfolio and enter your ETF tickers and balances to see your personalised health score.
        </p>
        <a href="/settings" style={S.btnPrimary}>Add my portfolio →</a>
      </div>
    );
  }

  const hs = analysis.healthScores;
  const fi = analysis.feeAnalysis;

  return (
    <div>
      <PageHeader
        badge="SmartETF · Free tool"
        title="Portfolio health score"
        subtitle="A personalised 0–100 score across five dimensions of portfolio optimisation."
      />

      {/* Score hero */}
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:28,flexWrap:"wrap"}}>
          <ScoreRing score={hs.composite} size={96}/>
          <div style={{flex:1,minWidth:200}}>
            <ScoreBand score={hs.composite}/>
            <div style={{fontSize:13,color:C.gray500,marginTop:10}}>
              {analysis.etfKeys.length} ETFs · {fmtAUD(analysis.totalPortfolio)} total portfolio ·{" "}
              {fi.blendedMerPct.toFixed(2)}% blended MER
            </div>
          </div>
        </div>

        <MetricGrid items={[
          { value: `${hs.overlap}`, label:"Overlap score",       color:scoreColor(hs.overlap)      },
          { value: `${hs.fee}`,     label:"Fee efficiency",       color:scoreColor(hs.fee)          },
          { value: `${hs.diversification}`, label:"Diversification", color:scoreColor(hs.diversification) },
          { value: `${hs.superAlignment}`,  label:"Super alignment", color:scoreColor(hs.superAlignment)  },
        ]}/>
      </Card>

      {/* Issues */}
      <Card>
        <SectionLabel>Issues found</SectionLabel>
        {analysis.issues.length === 0 ? (
          <div style={{padding:"20px 0",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:8}}>🎉</div>
            <div style={{fontSize:15,fontWeight:600,color:C.teal}}>No significant issues detected</div>
            <div style={{fontSize:13,color:C.gray500,marginTop:4}}>Well-constructed portfolio.</div>
          </div>
        ) : (
          analysis.issues.map((issue, i) => (
            <IssueCard key={i} severity={issue.severity} message={issue.message} impact={issue.impact}/>
          ))
        )}

        {analysis.strengths.length > 0 && (
          <>
            <SectionLabel>Strengths</SectionLabel>
            {analysis.strengths.map((s, i) => <StrengthCard key={i} message={s.message}/>)}
          </>
        )}
      </Card>

      {/* Score breakdown — subscriber */}
      <Card>
        <SectionLabel>Score breakdown</SectionLabel>
        {isSubscriber ? (
          <>
            <ScoreRow label="Overlap efficiency"    score={hs.overlap}/>
            <ScoreRow label="Fee efficiency"         score={hs.fee}/>
            <ScoreRow label="Diversification"        score={hs.diversification}/>
            <ScoreRow label="Super alignment"        score={hs.superAlignment}/>
            <ScoreRow label="Age-appropriate risk"   score={hs.ageRisk}/>
          </>
        ) : (
          <LockOverlay onUnlock={onUnlock}/>
        )}
      </Card>

      {/* Fee analysis */}
      <Card accent={fi.feeDrag10yr > 5000 ? C.amber : C.teal}>
        <SectionLabel>Fee analysis</SectionLabel>
        <MetricGrid items={[
          { value:`${fi.blendedMerPct.toFixed(2)}%`, label:"Blended MER" },
          { value:`$${Math.round(fi.annualFeeCost).toLocaleString()}`, label:"Annual fee cost" },
          { value:fmtAUD(fi.feeDrag10yr), label:"10yr fee drag", color:fi.feeDrag10yr>5000?C.red:C.gray900 },
          { value:fmtAUD(fi.feeDrag20yr), label:"20yr fee drag", color:fi.feeDrag20yr>10000?C.red:C.gray900 },
        ]}/>
        <div style={{padding:"12px 16px",background:"#FFF9F0",borderRadius:8,marginTop:8,
          border:`1px solid ${C.amberLight}`}}>
          <div style={{fontSize:13,color:C.amberDark,lineHeight:1.6}}>
            <strong>What this means:</strong> Your current portfolio costs{" "}
            <strong>{fi.blendedMerPct.toFixed(2)}%</strong> per year in management fees.
            Switching to the lowest-cost equivalent would save approximately{" "}
            <strong>{fmtAUD(fi.savingsPotential10yr)}</strong> over 10 years (on{" "}
            {fmtAUD(analysis.totalBrokerage)} at 8%/yr).
          </div>
        </div>
        <p style={{fontSize:12,color:C.gray400,marginTop:10,marginBottom:0}}>
          Fee drag calculated on {fmtAUD(analysis.totalBrokerage)} at 8%/yr vs{" "}
          {fi.cheapestEquivalentMer.toFixed(2)}% theoretical minimum MER.
          Not financial advice.
        </p>
      </Card>

      {/* What to do next */}
      <Card>
        <SectionLabel>Recommended next steps</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            { href:"/overlap",   icon:"⊗", title:"Scan for overlap",     desc:"See exactly which companies you own twice" },
            { href:"/exposure",  icon:"◎", title:"Map your exposure",     desc:"Geographic, sector, and factor breakdown" },
            { href:"/optimiser", icon:"↗", title:"Optimise portfolio",    desc:"Get a personalised ETF action plan" },
            { href:"/sip",       icon:"⟳", title:"Plan your DCA",         desc:"Monthly buy instructions to hit target allocation" },
          ].map(item => (
            <a key={item.href} href={item.href} style={{
              display:"block",padding:"14px 16px",background:C.gray50,
              borderRadius:10,textDecoration:"none",
              border:`1px solid ${C.gray100}`,
              transition:"border-color 0.15s",
            }}>
              <div style={{fontSize:20,marginBottom:6}}>{item.icon}</div>
              <div style={{fontSize:14,fontWeight:600,color:C.gray900,marginBottom:3}}>{item.title}</div>
              <div style={{fontSize:12,color:C.gray500,lineHeight:1.5}}>{item.desc}</div>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
