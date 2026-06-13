"use client";
import React, { useState } from "react";
import {
  MODEL_PORTFOLIOS, RISK_FILTERS, getByCategory,
  type ModelPortfolio, type PortfolioCategory,
} from "@/data/portfolioMarketplace";

// ── Donut chart ───────────────────────────────────────────────────────────────
function Donut({ holdings, size=68 }: { holdings: ModelPortfolio["holdings"]; size?: number }) {
  const cx=size/2, cy=size/2, r=size/2-4;
  let ang=-90;
  const slices = holdings.map(h=>{
    const a0=ang, sw=(h.pct/100)*360; ang+=sw;
    const s=pt(cx,cy,r,a0), e=pt(cx,cy,r,a0+sw);
    return { d:`M${cx} ${cy} L${s.x} ${s.y} A${r} ${r} 0 ${sw>180?1:0} 1 ${e.x} ${e.y}Z`, color:h.color };
  });
  const merLabel = holdings.reduce((s,h)=>s+h.mer*h.pct/100,0).toFixed(2)+"%";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      {slices.map((s,i)=><path key={i} d={s.d} fill={s.color} stroke="#fff" strokeWidth={1}/>)}
      <circle cx={cx} cy={cy} r={r*0.54} fill="#F8FAFC"/>
      <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
        fontSize={size*0.13} fontWeight={700} fill="#475569">{merLabel}</text>
    </svg>
  );
}
function pt(cx:number,cy:number,r:number,deg:number){
  const a=deg*Math.PI/180;
  return {x:+(cx+r*Math.cos(a)).toFixed(2),y:+(cy+r*Math.sin(a)).toFixed(2)};
}

// ── Risk dots ─────────────────────────────────────────────────────────────────
function RiskDots({level,color}:{level:number;color:string}){
  return(
    <span style={{display:"inline-flex",alignItems:"flex-end",gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} style={{display:"inline-block",width:4,
          height:4+i*3,borderRadius:2,
          background:i<=level?color:"#CBD5E1"}}/>
      ))}
    </span>
  );
}

// ── Category badge ────────────────────────────────────────────────────────────
function Badge({label,color,bg}:{label:string;color:string;bg:string}){
  return(
    <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4,
      background:bg,color,whiteSpace:"nowrap"}}>{label}</span>
  );
}

// ── Filter pill ───────────────────────────────────────────────────────────────
function Pill({active,onClick,children}:{active:boolean;onClick:()=>void;children:React.ReactNode}){
  return(
    <button onClick={onClick} style={{
      padding:"5px 14px",fontSize:13,borderRadius:20,cursor:"pointer",
      border:active?"2px solid #1E1B4B":"1px solid #CBD5E1",
      background:active?"#1E1B4B":"#fff",
      color:active?"#fff":"#475569",fontWeight:active?600:400,
    }}>{children}</button>
  );
}

// ── Left-column card ──────────────────────────────────────────────────────────
function PortfolioCard({p,active,onSelect}:{
  p:ModelPortfolio; active:boolean; onSelect:()=>void;
}){
  const rc=p.risk>=5?"#DC2626":p.risk>=4?"#D97706":p.risk>=3?"#B45309":"#059669";
  return(
    <div onClick={onSelect} style={{
      background:"#fff",
      border:`1px solid ${active?"#3B82F6":"#E2E8F0"}`,
      borderRadius:10,padding:"16px 18px",cursor:"pointer",
      boxShadow:active?"0 0 0 3px rgba(59,130,246,0.12)":"none",
      transition:"border-color .12s,box-shadow .12s",
      marginBottom:10,
    }}>
      <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
        <Donut holdings={p.holdings} size={64}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontSize:15,fontWeight:700,color:"#0F172A"}}>{p.name}</span>
            <Badge label={p.tag} color={p.tagColor} bg={p.tagBg}/>
          </div>
          <p style={{fontSize:13,color:"#64748B",lineHeight:1.5,margin:"0 0 10px",
            overflow:"hidden",display:"-webkit-box",
            WebkitLineClamp:2,WebkitBoxOrient:"vertical" as any}}>
            {p.desc}
          </p>
          <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
            {[
              {v:`${p.mer}%`,     l:"MER p.a."},
              {v:`${p.returns["3yr"]}%`,l:"3yr est."},
              {v:`${p.returns["5yr"]}%`,l:"5yr est."},
              {v:`$${p.annualCostOn430k.toLocaleString()}/yr`,l:"on $430k"},
            ].map(({v,l})=>(
              <div key={l}>
                <div style={{fontSize:13,fontWeight:700,color:"#1D9E75"}}>{v}</div>
                <div style={{fontSize:11,color:"#94A3B8",marginTop:1}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,
        paddingTop:10,borderTop:"1px solid #F1F5F9"}}>
        <RiskDots level={p.risk} color={rc}/>
        <span style={{fontSize:11,fontWeight:600,color:rc}}>{p.riskLabel}</span>
        <span style={{color:"#CBD5E1"}}>·</span>
        <span style={{fontSize:11,color:"#94A3B8"}}>{p.holdings.length} ETFs</span>
        <span style={{color:"#CBD5E1"}}>·</span>
        <span style={{fontSize:11,color:"#94A3B8"}}>{p.horizon}</span>
      </div>
    </div>
  );
}

// ── Right-side detail panel (matches SmartSuper exactly) ──────────────────────
function DetailPanel({p}:{p:ModelPortfolio}){
  const rc=p.risk>=5?"#DC2626":p.risk>=4?"#D97706":p.risk>=3?"#B45309":"#059669";
  const overlapClean = p.holdings.length <= 3 ||
    !p.holdings.some(h=>["VGS","BGBL"].includes(h.ticker) &&
      p.holdings.some(h2=>["NDQ","IVV"].includes(h2.ticker)));

  return(
    <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,
      padding:"20px 22px",position:"sticky",top:80,maxHeight:"calc(100vh - 100px)",
      overflowY:"auto"}}>

      {/* Name + description */}
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
          <Donut holdings={p.holdings} size={36}/>
          <span style={{fontSize:17,fontWeight:700,color:"#0F172A"}}>{p.name}</span>
        </div>
        <p style={{fontSize:13,color:"#475569",lineHeight:1.65,margin:0}}>{p.desc}</p>
      </div>

      {/* 3 big stats — exact SmartSuper style */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0,
        borderTop:"1px solid #F1F5F9",paddingTop:16,marginBottom:18}}>
        {[
          {v:`${p.mer}%`,          l:"Weighted MER"},
          {v:`${p.returns["3yr"]}% p.a.`, l:"3yr est. return"},
          {v:`${p.returns["5yr"]}% p.a.`, l:"5yr est. return"},
        ].map(({v,l})=>(
          <div key={l} style={{textAlign:"center",padding:"0 8px",
            borderRight:"1px solid #F1F5F9"}}>
            <div style={{fontSize:20,fontWeight:800,color:"#1D9E75",letterSpacing:"-0.02em",lineHeight:1.1}}>
              {v}
            </div>
            <div style={{fontSize:11,color:"#94A3B8",marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Holdings list */}
      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",
        textTransform:"uppercase",color:"#94A3B8",marginBottom:10}}>Holdings</div>
      <div style={{marginBottom:16}}>
        {p.holdings.map(h=>(
          <div key={h.ticker} style={{display:"flex",alignItems:"flex-start",
            gap:10,padding:"9px 0",borderBottom:"1px solid #F8FAFC"}}>
            {/* Color dot */}
            <div style={{width:8,height:8,borderRadius:2,background:h.color,
              flexShrink:0,marginTop:4}}/>
            {/* Ticker + details */}
            <div style={{flex:1,minWidth:0}}>
              <span style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{h.ticker}</span>
              {" "}
              <span style={{fontSize:13,color:"#475569"}}>{h.name}</span>
              <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>
                {h.mer}% MER · {h.asset}
                {p.returns["3yr"] && ` · 3yr ${(p.returns["3yr"]*h.pct/100).toFixed(1)}%`}
              </div>
            </div>
            {/* Weight right-aligned */}
            <div style={{fontSize:15,fontWeight:700,color:"#0F172A",flexShrink:0}}>
              {h.pct}%
            </div>
          </div>
        ))}
      </div>

      {/* Annual cost dark box — exact SmartSuper */}
      <div style={{background:"#1E293B",borderRadius:8,padding:"14px 18px",marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",
          textTransform:"uppercase",color:"#94A3B8",marginBottom:10}}>
          Annual cost on $430,000
        </div>
        {[
          {l:"Investment fees (weighted MER)",
           v:`$${Math.round(430000*p.mer/100).toLocaleString()}/yr`},
          {l:"Platform / admin fee",
           v:"Varies by broker"},
        ].map(({l,v})=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",
            alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:13,color:"#94A3B8"}}>{l}</span>
            <span style={{fontSize:13,color:"#E2E8F0",fontWeight:500}}>{v}</span>
          </div>
        ))}
        <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:8,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:600,color:"#E2E8F0"}}>Total annual cost</span>
          <span style={{fontSize:16,fontWeight:800,color:"#34D399"}}>
            ${p.annualCostOn430k.toLocaleString()}/yr
          </span>
        </div>
      </div>

      {/* Overlap indicator */}
      <div style={{fontSize:12,color:overlapClean?"#059669":"#D97706",
        display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
        <span>{overlapClean?"✓":"⚠"}</span>
        <span>{overlapClean
          ?"No significant ETF overlap detected"
          :"Potential overlap between holdings — check Overlap Scanner"}</span>
      </div>

      {/* Risk + horizon */}
      <div style={{display:"flex",alignItems:"center",gap:8,
        padding:"10px 12px",background:"#F8FAFC",borderRadius:8,marginBottom:14}}>
        <RiskDots level={p.risk} color={rc}/>
        <span style={{fontSize:12,fontWeight:600,color:rc}}>{p.riskLabel} risk</span>
        <span style={{color:"#CBD5E1"}}>·</span>
        <span style={{fontSize:12,color:"#64748B"}}>Min. horizon: {p.horizon}</span>
        <span style={{color:"#CBD5E1"}}>·</span>
        <span style={{fontSize:12,color:"#64748B"}}>Rebalance: {p.rebalance}</span>
      </div>

      {/* Strengths + cons */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",
          textTransform:"uppercase",color:"#94A3B8",marginBottom:8}}>Strengths</div>
        {p.pros.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>
            <span style={{color:"#059669",flexShrink:0,marginTop:1}}>✓</span>
            <span style={{fontSize:13,color:"#475569",lineHeight:1.45}}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",
          textTransform:"uppercase",color:"#94A3B8",marginBottom:8}}>Watch out for</div>
        {p.cons.map((c,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>
            <span style={{color:"#D97706",flexShrink:0,marginTop:1}}>!</span>
            <span style={{fontSize:13,color:"#475569",lineHeight:1.45}}>{c}</span>
          </div>
        ))}
      </div>

      <p style={{fontSize:11,color:"#94A3B8",lineHeight:1.6,margin:0}}>{p.disclaimer}</p>
    </div>
  );
}

// ── Empty state for right panel ───────────────────────────────────────────────
function EmptyPanel(){
  return(
    <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,
      padding:"40px 24px",textAlign:"center",position:"sticky",top:80}}>
      <div style={{fontSize:40,marginBottom:12}}>📊</div>
      <div style={{fontSize:15,fontWeight:600,color:"#0F172A",marginBottom:6}}>
        Select a portfolio
      </div>
      <div style={{fontSize:13,color:"#64748B",lineHeight:1.6}}>
        Click any card on the left to see the full ETF breakdown, holdings, cost analysis, and overlap check.
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PortfolioMarketplace(){
  const [cat,setCat]=useState<PortfolioCategory|"all">("all");
  const [risk,setRisk]=useState("all");
  const [selId,setSelId]=useState<string|null>(null);

  let visible=getByCategory(cat);
  if(risk!=="all") visible=visible.filter(p=>{
    if(risk==="1-2") return p.risk<=2;
    if(risk==="3")   return p.risk===3;
    if(risk==="4")   return p.risk===4;
    if(risk==="5")   return p.risk===5;
    return true;
  });

  const selPortfolio = selId ? MODEL_PORTFOLIOS.find(p=>p.id===selId) : null;

  const CAT_TABS=[
    {id:"all"         as const, label:`All ${MODEL_PORTFOLIOS.length}`},
    {id:"high-growth" as const, label:"High growth"},
    {id:"growth"      as const, label:"Growth"},
    {id:"balanced"    as const, label:"Balanced"},
    {id:"income"      as const, label:"Income"},
  ];

  function selectCard(id:string){
    setSelId(prev=>prev===id?null:id);
  }

  return(
    <div>
      {/* Subtitle */}
      <p style={{fontSize:13,color:"#64748B",margin:"0 0 14px"}}>
        ETF model portfolios across high growth, growth, balanced, and income — with fee and overlap analysis
      </p>

      {/* Info banner */}
      <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:8,
        padding:"10px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{color:"#2563EB",fontSize:15,flexShrink:0}}>ℹ</span>
        <p style={{fontSize:13,color:"#1E40AF",margin:0,lineHeight:1.5}}>
          Click any portfolio to see the full analysis on the right.
          Returns are indicative based on historical index data to June 2025.
          <strong> General information only — not financial advice.</strong>
        </p>
      </div>

      {/* Filter row */}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:16}}>
        <span style={{fontSize:12,color:"#94A3B8",fontWeight:500}}>Category:</span>
        {CAT_TABS.map(t=>(
          <Pill key={t.id} active={cat===t.id}
            onClick={()=>{setCat(t.id);setSelId(null);}}>
            {t.label}
          </Pill>
        ))}
        <span style={{color:"#CBD5E1",margin:"0 4px"}}>|</span>
        <span style={{fontSize:12,color:"#94A3B8",fontWeight:500}}>Risk level:</span>
        {RISK_FILTERS.map(r=>(
          <Pill key={r.id} active={risk===r.id} onClick={()=>setRisk(r.id)}>
            {r.label}
          </Pill>
        ))}
      </div>

      {/* Split layout: list left, detail right */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 420px",gap:16,alignItems:"start"}}>

        {/* Left — card list */}
        <div>
          {visible.length===0?(
            <div style={{textAlign:"center",padding:"48px",color:"#94A3B8",fontSize:14}}>
              No portfolios match the selected filters.
            </div>
          ):(
            visible.map(p=>(
              <PortfolioCard key={p.id} p={p}
                active={selId===p.id}
                onSelect={()=>selectCard(p.id)}/>
            ))
          )}
        </div>

        {/* Right — detail panel */}
        <div>
          {selPortfolio ? <DetailPanel p={selPortfolio}/> : <EmptyPanel/>}
        </div>
      </div>

      <p style={{fontSize:11,color:"#94A3B8",marginTop:18,lineHeight:1.6}}>
        Returns are indicative based on historical index data to June 2025.
        Past performance is not a reliable indicator of future returns.
        General information only — not financial advice.
      </p>
    </div>
  );
}
