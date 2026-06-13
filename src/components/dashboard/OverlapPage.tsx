"use client";
import React, { useMemo } from "react";
import { C, S, fmtPct } from "@/lib/styles";
import { Card, SectionLabel, PageHeader, LockOverlay, MiniBar, OverlapBadge } from "@/components/ui";
import { analysePortfolio } from "@/lib/analysis";
import { ETF_DB } from "@/data/etfDatabase";
import type { FinancialProfile } from "@/types";

interface Props { profile:FinancialProfile; isSubscriber:boolean; onUnlock:()=>void }

const TOP_HOLDINGS: Record<string,{name:string;pct:number}[]> = {
  "VGS-BGBL":[{name:"Apple (AAPL)",pct:5.1},{name:"Microsoft (MSFT)",pct:4.8},{name:"NVIDIA (NVDA)",pct:4.2},{name:"Amazon (AMZN)",pct:3.6},{name:"Alphabet (GOOGL)",pct:3.1}],
  "VGS-NDQ": [{name:"Apple (AAPL)",pct:5.1},{name:"Microsoft (MSFT)",pct:4.8},{name:"NVIDIA (NVDA)",pct:4.2},{name:"Amazon (AMZN)",pct:3.6}],
  "NDQ-IVV": [{name:"Apple (AAPL)",pct:8.2},{name:"Microsoft (MSFT)",pct:7.1},{name:"NVIDIA (NVDA)",pct:6.8},{name:"Amazon (AMZN)",pct:5.5}],
  "VAS-A200":[{name:"Commonwealth Bank",pct:10.2},{name:"BHP Group",pct:9.8},{name:"CSL Limited",pct:6.1},{name:"NAB",pct:5.4}],
};
function getTopHoldings(a:string,b:string){return TOP_HOLDINGS[`${a}-${b}`]||TOP_HOLDINGS[`${b}-${a}`]||[];}

export default function OverlapPage({profile,isSubscriber,onUnlock}:Props){
  const analysis=useMemo(()=>analysePortfolio(profile),[profile]);
  const holdings=profile.portfolio?.holdings.filter(h=>h.balance>0)??[];

  if(!analysis||holdings.length<2) return(
    <div>
      <PageHeader badge="SmartETF · Free tool" title="Overlap scanner" subtitle="Company-level duplicate detection across your entire portfolio."/>
      <Card><div style={{textAlign:"center",padding:"40px 0"}}>
        <div style={{fontSize:40,marginBottom:12}}>⊗</div>
        <div style={{fontSize:15,fontWeight:600,color:C.gray700}}>Add at least 2 ETFs to scan for overlap</div>
        <a href="/settings" style={{...S.btnPrimary,display:"inline-flex",marginTop:16}}>Add holdings →</a>
      </div></Card>
    </div>
  );

  return(
    <div>
      <PageHeader badge="SmartETF · Free tool" title="Overlap scanner" subtitle="See exactly which companies you own twice across your ETFs and super fund."/>
      <Card>
        {analysis.overlapPairs.length===0?(
          <div style={{display:"flex",alignItems:"center",gap:16,padding:"8px 0"}}>
            <div style={{fontSize:40}}>✅</div>
            <div><div style={{fontSize:16,fontWeight:600,color:C.teal}}>No significant overlap detected</div>
            <div style={{fontSize:13,color:C.gray500,marginTop:3}}>Your {holdings.length} ETFs have clean non-duplicating exposure.</div></div>
          </div>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:16,padding:"8px 0"}}>
            <div style={{fontSize:40}}>⚠️</div>
            <div><div style={{fontSize:16,fontWeight:600,color:C.amber}}>
              {analysis.overlapPairs.filter(p=>p.overlapPct>50).length} high-overlap pairs found
            </div>
            <div style={{fontSize:13,color:C.gray500,marginTop:3}}>You may be paying duplicate fees for the same companies.</div></div>
          </div>
        )}
      </Card>

      {analysis.overlapPairs.map((pair,i)=>(
        <Card key={i} accent={pair.overlapPct>70?C.red:pair.overlapPct>35?C.amber:C.teal}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:12,flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:17,fontWeight:700,color:C.gray900}}>{pair.etfA} + {pair.etfB}</div>
              <div style={{fontSize:12,color:C.gray400,marginTop:2}}>{ETF_DB[pair.etfA]?.name} · {ETF_DB[pair.etfB]?.name}</div>
            </div>
            <OverlapBadge pct={pair.overlapPct}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <MiniBar value={pair.overlapPct} color={pair.overlapPct>70?C.red:pair.overlapPct>35?C.amber:C.teal} height={8}/>
            <span style={{fontSize:13,fontWeight:700,color:pair.overlapPct>70?C.red:pair.overlapPct>35?C.amber:C.teal,minWidth:36}}>{pair.overlapPct}%</span>
          </div>
          <p style={{fontSize:13,color:C.gray600,lineHeight:1.6,marginBottom:12}}>
            {pair.overlapPct>85?`${pair.etfA} and ${pair.etfB} track essentially the same index. Paying two MERs for no additional diversification.`
              :pair.overlapPct>50?`More than half the underlying companies are the same. Both funds hold Apple, Microsoft, and NVIDIA in similar weights.`
              :`Some overlap in large-cap holdings. The diversification benefit of holding both is modest but present.`}
          </p>
          {isSubscriber?(
            <>{
              getTopHoldings(pair.etfA,pair.etfB).length>0&&(
              <><SectionLabel>Top overlapping companies</SectionLabel>
              {getTopHoldings(pair.etfA,pair.etfB).map((co,j)=>(
                <div key={j} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{width:180,fontSize:13,color:C.gray700,flexShrink:0}}>{co.name}</div>
                  <MiniBar value={co.pct} max={12} color={C.red} height={5}/>
                  <span style={{fontSize:12,fontWeight:600,color:C.redDark,minWidth:36,textAlign:"right"}}>{co.pct}%</span>
                </div>
              ))}</>)
            }</>
          ):(
            <><SectionLabel>Top overlapping companies</SectionLabel><LockOverlay onUnlock={onUnlock}/></>
          )}
          <div style={{marginTop:14,padding:"12px 16px",background:C.gray50,borderRadius:8,border:`1px solid ${C.gray200}`}}>
            <div style={{fontSize:12,fontWeight:600,color:C.gray700,marginBottom:4}}>How to fix this</div>
            <div style={{fontSize:12,color:C.gray600,lineHeight:1.6}}>
              {pair.overlapPct>85?`Choose one of ${pair.etfA} or ${pair.etfB}. ${(ETF_DB[pair.etfB]?.mer??0)<(ETF_DB[pair.etfA]?.mer??0)?pair.etfB:pair.etfA} has the lower MER — consolidate into that one.`
                :`Consider whether holding both funds justifies paying two MERs. Use the Optimiser to model a cleaner single-fund equivalent.`}
            </div>
          </div>
        </Card>
      ))}

      <Card>
        <SectionLabel>MER comparison</SectionLabel>
        {holdings.map(h=>{
          const etf=ETF_DB[h.ticker]; if(!etf) return null;
          return(<div key={h.ticker} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${C.gray100}`}}>
            <div style={{width:52,flexShrink:0}}>
              <div style={{fontSize:14,fontWeight:700,color:C.gray900}}>{h.ticker}</div>
              <div style={{fontSize:10,color:C.gray400}}>{etf.issuer}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:C.gray500,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{etf.name}</div>
              <MiniBar value={etf.mer} max={0.8} color={etf.mer<0.1?C.teal:etf.mer<0.3?C.amber:C.red}/>
            </div>
            <div style={{textAlign:"right",flexShrink:0,minWidth:56}}>
              <div style={{fontSize:14,fontWeight:700,color:etf.mer<0.1?C.teal:etf.mer<0.3?C.amber:C.red}}>{etf.mer}%</div>
              <div style={{fontSize:10,color:C.gray400}}>MER</div>
            </div>
          </div>);
        })}
      </Card>
    </div>
  );
}
