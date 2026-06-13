"use client";
import React, { useState } from "react";
import {
  MODEL_PORTFOLIOS, RISK_FILTERS, getByCategory,
  type ModelPortfolio, type PortfolioCategory,
} from "@/data/portfolioMarketplace";

// ─── Donut chart ──────────────────────────────────────────────────────────────
function Donut({ holdings, size=72 }: { holdings: ModelPortfolio["holdings"]; size?: number }) {
  const cx=size/2, cy=size/2, r=size/2-5;
  let ang=-90;
  const slices = holdings.map(h=>{
    const a0=ang, sw=(h.pct/100)*360; ang+=sw;
    const s=xy(cx,cy,r,a0), e=xy(cx,cy,r,a0+sw);
    return {d:`M${cx} ${cy} L${s.x} ${s.y} A${r} ${r} 0 ${sw>180?1:0} 1 ${e.x} ${e.y}Z`, color:h.color};
  });
  const merText = holdings.reduce((s,h)=>s+h.mer*h.pct/100,0).toFixed(2)+"%";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      {slices.map((s,i)=><path key={i} d={s.d} fill={s.color} stroke="#fff" strokeWidth={1.2}/>)}
      <circle cx={cx} cy={cy} r={r*0.56} fill="#F8FAFC"/>
      <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
        fontSize={size*0.126} fontWeight={700} fill="#475569">{merText}</text>
    </svg>
  );
}
function xy(cx:number,cy:number,r:number,deg:number){
  const a=deg*Math.PI/180;
  return {x:+(cx+r*Math.cos(a)).toFixed(2),y:+(cy+r*Math.sin(a)).toFixed(2)};
}

// ─── Risk dots ────────────────────────────────────────────────────────────────
function RiskDots({level,color}:{level:number;color:string}){
  return(
    <span style={{display:"inline-flex",alignItems:"flex-end",gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} style={{display:"inline-block",width:4,height:4+i*3,
          borderRadius:2,background:i<=level?color:"#CBD5E1"}}/>
      ))}
    </span>
  );
}

// ─── Category badge ───────────────────────────────────────────────────────────
function Badge({label,color,bg}:{label:string;color:string;bg:string}){
  return(
    <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4,
      background:bg,color,display:"inline-block",whiteSpace:"nowrap"}}>{label}</span>
  );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────
function FilterPill({active,onClick,children}:{active:boolean;onClick:()=>void;children:React.ReactNode}){
  return(
    <button onClick={onClick} style={{
      padding:"5px 14px",fontSize:13,borderRadius:20,cursor:"pointer",
      border:active?"2px solid #1E1B4B":"1px solid #CBD5E1",
      background:active?"#1E1B4B":"#fff",
      color:active?"#fff":"#475569",fontWeight:active?600:400,
    }}>{children}</button>
  );
}

// ─── Portfolio card — exact SmartSuper layout ─────────────────────────────────
function PortfolioCard({p,active,onSelect,inCompare,onToggleCompare}:{
  p:ModelPortfolio; active:boolean; onSelect:()=>void;
  inCompare:boolean; onToggleCompare:(e:React.MouseEvent)=>void;
}){
  const rc=p.risk>=5?"#DC2626":p.risk>=4?"#D97706":p.risk>=3?"#B45309":"#059669";
  return(
    <div onClick={onSelect} style={{
      background:"#fff",
      border:`1px solid ${active?"#3B82F6":"#E2E8F0"}`,
      borderRadius:10,padding:"18px 20px",cursor:"pointer",
      boxShadow:active?"0 0 0 3px rgba(59,130,246,0.15)":"none",
      transition:"border-color .12s,box-shadow .12s",
    }}>
      {/* Card body — donut left, content right */}
      <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
        <Donut holdings={p.holdings} size={72}/>
        <div style={{flex:1,minWidth:0}}>
          {/* Name + badge row */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
            <span style={{fontSize:15,fontWeight:700,color:"#0F172A"}}>{p.name}</span>
            <Badge label={p.tag} color={p.tagColor} bg={p.tagBg}/>
          </div>
          {/* Description */}
          <p style={{fontSize:13,color:"#64748B",lineHeight:1.55,margin:"0 0 10px",
            overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,
            WebkitBoxOrient:"vertical" as any}}>
            {p.desc}
          </p>
          {/* Stats row — exact SmartSuper style: value in blue/green, label below in grey */}
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            {[
              {v:`${p.mer}%`,     l:"MER p.a."},
              {v:`${p.returns["3yr"]}%`, l:"3yr est."},
              {v:`${p.returns["5yr"]}%`, l:"5yr est."},
              {v:`$${p.annualCostOn430k.toLocaleString()}/yr`, l:"on $430k"},
            ].map(({v,l})=>(
              <div key={l}>
                <div style={{fontSize:13,fontWeight:700,color:"#1D9E75",lineHeight:1.1}}>{v}</div>
                <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        marginTop:12,paddingTop:12,borderTop:"1px solid #F1F5F9"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <RiskDots level={p.risk} color={rc}/>
          <span style={{fontSize:11,fontWeight:600,color:rc}}>{p.riskLabel}</span>
          <span style={{color:"#CBD5E1",fontSize:11}}>·</span>
          <span style={{fontSize:11,color:"#94A3B8"}}>{p.holdings.length} ETFs</span>
          <span style={{color:"#CBD5E1",fontSize:11}}>·</span>
          <span style={{fontSize:11,color:"#94A3B8"}}>{p.horizon}</span>
        </div>
        <button onClick={onToggleCompare} style={{
          fontSize:11,padding:"3px 10px",borderRadius:5,cursor:"pointer",
          background:inCompare?"#EFF6FF":"transparent",
          color:inCompare?"#1D4ED8":"#94A3B8",
          border:`1px solid ${inCompare?"#93C5FD":"#E2E8F0"}`,
          fontWeight:inCompare?600:400,
        }}>{inCompare?"✓ Added":"+ Compare"}</button>
      </div>
    </div>
  );
}

// ─── Detail drawer ────────────────────────────────────────────────────────────
function DetailDrawer({p,onClose}:{p:ModelPortfolio;onClose:()=>void}){
  const rc=p.risk>=5?"#DC2626":p.risk>=4?"#D97706":p.risk>=3?"#B45309":"#059669";
  return(
    <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,
      padding:"20px 24px",marginBottom:14}}>
      {/* Header */}
      <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:16}}>
        <Donut holdings={p.holdings} size={80}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontSize:18,fontWeight:700,color:"#0F172A"}}>{p.name}</span>
            <Badge label={p.tag} color={p.tagColor} bg={p.tagBg}/>
          </div>
          <p style={{fontSize:14,color:"#475569",lineHeight:1.6,margin:0}}>{p.desc}</p>
        </div>
        <button onClick={onClose} style={{padding:"6px 14px",fontSize:12,borderRadius:7,
          border:"1px solid #E2E8F0",background:"transparent",cursor:"pointer",color:"#64748B",flexShrink:0}}>
          Close ×
        </button>
      </div>

      {/* Stats grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,marginBottom:16}}>
        {[
          {v:`+${p.returns["1yr"]}%`,l:"1yr return",c:"#1D9E75"},
          {v:`+${p.returns["3yr"]}%`,l:"3yr p.a.",c:"#1D9E75"},
          {v:`+${p.returns["5yr"]}%`,l:"5yr p.a.",c:"#1D9E75"},
          {v:`${p.mer}%`,l:"Blended MER",c:p.mer<0.1?"#1D9E75":"#475569"},
          {v:`${p.yield}%`,l:"Yield",c:"#475569"},
          {v:p.riskLabel,l:"Risk level",c:rc},
          {v:p.horizon,l:"Min. horizon",c:"#475569"},
          {v:`$${p.annualCostOn430k.toLocaleString()}/yr`,l:"Cost on $430k",c:"#475569"},
        ].map(({v,l,c})=>(
          <div key={l} style={{background:"#F8FAFC",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
            <div style={{fontSize:15,fontWeight:600,color:c,lineHeight:1.2}}>{v}</div>
            <div style={{fontSize:11,color:"#94A3B8",marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Holdings table */}
      <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",
        color:"#94A3B8",marginBottom:8}}>ETF holdings</div>
      <div style={{border:"1px solid #F1F5F9",borderRadius:8,overflow:"hidden",marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"52px 1fr 90px 44px 110px",
          gap:8,padding:"7px 12px",background:"#F8FAFC",borderBottom:"1px solid #F1F5F9"}}>
          {["Ticker","Fund","Weight","MER","Asset class"].map(h=>(
            <div key={h} style={{fontSize:11,fontWeight:600,color:"#94A3B8",
              textTransform:"uppercase",letterSpacing:".05em"}}>{h}</div>
          ))}
        </div>
        {p.holdings.map((h,i)=>(
          <div key={h.ticker} style={{display:"grid",
            gridTemplateColumns:"52px 1fr 90px 44px 110px",
            gap:8,padding:"9px 12px",alignItems:"center",
            borderBottom:i<p.holdings.length-1?"1px solid #F1F5F9":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:h.color,flexShrink:0}}/>
              <span style={{fontSize:13,fontWeight:600,color:"#0F172A"}}>{h.ticker}</span>
            </div>
            <div>
              <div style={{fontSize:13,color:"#475569",overflow:"hidden",
                textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.name}</div>
              <div style={{fontSize:11,color:"#94A3B8",overflow:"hidden",
                textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.index}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{flex:1,height:4,background:"#F1F5F9",borderRadius:2,overflow:"hidden"}}>
                <div style={{width:`${h.pct}%`,height:4,background:h.color,borderRadius:2}}/>
              </div>
              <span style={{fontSize:12,fontWeight:600,color:"#0F172A",minWidth:26}}>{h.pct}%</span>
            </div>
            <div style={{fontSize:12,fontWeight:600,
              color:h.mer<0.1?"#1D9E75":h.mer<0.3?"#D97706":"#DC2626"}}>{h.mer}%</div>
            <div style={{fontSize:11,color:"#64748B"}}>{h.asset}</div>
          </div>
        ))}
      </div>

      {/* Pros / cons */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{background:"#F0FDF8",borderRadius:8,padding:"14px 16px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#065F46",textTransform:"uppercase",
            letterSpacing:".06em",marginBottom:8}}>Strengths</div>
          {p.pros.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
              <span style={{color:"#059669",flexShrink:0}}>✓</span>
              <span style={{fontSize:13,color:"#065F46",lineHeight:1.5}}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{background:"#FFFBEB",borderRadius:8,padding:"14px 16px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#78350F",textTransform:"uppercase",
            letterSpacing:".06em",marginBottom:8}}>Watch out for</div>
          {p.cons.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
              <span style={{color:"#D97706",flexShrink:0}}>!</span>
              <span style={{fontSize:13,color:"#78350F",lineHeight:1.5}}>{c}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{fontSize:11,color:"#94A3B8",marginTop:12,lineHeight:1.6}}>{p.disclaimer}</p>
    </div>
  );
}

// ─── Compare panel ────────────────────────────────────────────────────────────
function ComparePanel({portfolios,onClose}:{portfolios:ModelPortfolio[];onClose:()=>void}){
  const b1=Math.max(...portfolios.map(p=>p.returns["1yr"]));
  const b5=Math.max(...portfolios.map(p=>p.returns["5yr"]));
  const bm=Math.min(...portfolios.map(p=>p.mer));
  const by=Math.max(...portfolios.map(p=>p.yield));
  return(
    <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,
      padding:"20px 24px",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:700,color:"#0F172A"}}>
          Comparing {portfolios.length} portfolios
        </div>
        <button onClick={onClose} style={{padding:"6px 14px",fontSize:12,borderRadius:7,
          border:"1px solid #E2E8F0",background:"transparent",cursor:"pointer",color:"#64748B"}}>
          Close
        </button>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{borderBottom:"1px solid #F1F5F9"}}>
              <th style={{textAlign:"left",padding:"8px 10px",fontSize:11,fontWeight:600,
                color:"#94A3B8",textTransform:"uppercase",letterSpacing:".05em",width:120}}>Metric</th>
              {portfolios.map(p=>(
                <th key={p.id} style={{textAlign:"center",padding:"8px 10px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:p.color}}/>
                    <span style={{fontSize:12,fontWeight:600,color:"#0F172A"}}>{p.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {l:"1yr return",vals:portfolios.map(p=>p.returns["1yr"]),best:b1,fmt:(v:number)=>`+${v}%`,inv:false},
              {l:"5yr p.a.",  vals:portfolios.map(p=>p.returns["5yr"]),best:b5,fmt:(v:number)=>`+${v}%`,inv:false},
              {l:"Blended MER",vals:portfolios.map(p=>p.mer),         best:bm,fmt:(v:number)=>`${v}%`, inv:true},
              {l:"Yield",     vals:portfolios.map(p=>p.yield),        best:by,fmt:(v:number)=>`${v}%`, inv:false},
              {l:"Risk level",vals:portfolios.map(p=>p.risk),         best:0, fmt:(_:number,i:number)=>portfolios[i].riskLabel,inv:false,noStar:true},
            ].map(row=>(
              <tr key={row.l} style={{borderBottom:"1px solid #F8FAFC"}}>
                <td style={{padding:"9px 10px",fontSize:12,color:"#475569"}}>{row.l}</td>
                {portfolios.map((p,i)=>{
                  const v=row.vals[i];
                  const best=!row.noStar&&(row.inv?v===row.best:v===row.best);
                  return(
                    <td key={p.id} style={{textAlign:"center",padding:"9px 10px",
                      fontWeight:best?700:400,color:best?"#1D9E75":"#475569"}}>
                      {(row.fmt as any)(v,i)}{best?" ★":""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 10yr projection */}
      <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",
        color:"#94A3B8",margin:"16px 0 8px"}}>10yr projection — $50K start + $1,500/mo</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8}}>
        {portfolios.map(p=>{
          const r=p.returns["5yr"]/100;
          const proj=50000*Math.pow(1+r,10)+1500*12*(Math.pow(1+r,10)-1)/r;
          return(
            <div key={p.id} style={{background:"#F8FAFC",borderRadius:8,padding:"12px",textAlign:"center"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:4}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:p.color}}/>
                <span style={{fontSize:11,color:"#64748B"}}>{p.name}</span>
              </div>
              <div style={{fontSize:20,fontWeight:700,color:p.color}}>${Math.round(proj/1000)}K</div>
            </div>
          );
        })}
      </div>
      <p style={{fontSize:11,color:"#94A3B8",marginTop:12,lineHeight:1.6}}>
        ★ = best in category. Past performance is not a reliable indicator of future returns. Not financial advice.
      </p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PortfolioMarketplace(){
  const [cat,setCat]=useState<PortfolioCategory|"all">("all");
  const [risk,setRisk]=useState("all");
  const [selId,setSelId]=useState<string|null>(null);
  const [cmpIds,setCmpIds]=useState<Set<string>>(new Set());
  const [showCmp,setShowCmp]=useState(false);

  let visible=getByCategory(cat);
  if(risk!=="all") visible=visible.filter(p=>{
    if(risk==="1-2") return p.risk<=2;
    if(risk==="3")   return p.risk===3;
    if(risk==="4")   return p.risk===4;
    if(risk==="5")   return p.risk===5;
    return true;
  });

  const selPortfolio=selId?MODEL_PORTFOLIOS.find(p=>p.id===selId):null;
  const cmpPortfolios=MODEL_PORTFOLIOS.filter(p=>cmpIds.has(p.id));

  const CAT_TABS=[
    {id:"all"         as const,label:`All ${MODEL_PORTFOLIOS.length}`},
    {id:"high-growth" as const,label:"High growth"},
    {id:"growth"      as const,label:"Growth"},
    {id:"balanced"    as const,label:"Balanced"},
    {id:"income"      as const,label:"Income"},
  ];

  function toggleCmp(e:React.MouseEvent,id:string){
    e.stopPropagation();
    setCmpIds(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  }
  function selectCard(id:string){
    setSelId(prev=>prev===id?null:id);
    setShowCmp(false);
  }

  return(
    <div>
      {/* Page subtitle */}
      <p style={{fontSize:13,color:"#64748B",margin:"0 0 18px",lineHeight:1.5}}>
        ETF model portfolios across high growth, growth, balanced, and income — with fee and overlap analysis
      </p>

      {/* Info banner — same as SmartSuper */}
      <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:8,
        padding:"10px 16px",marginBottom:18,display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{color:"#2563EB",fontSize:16,flexShrink:0,marginTop:1}}>ℹ</span>
        <p style={{fontSize:13,color:"#1E40AF",margin:0,lineHeight:1.55}}>
          Returns are indicative based on historical index data to June 2025.
          Click any portfolio card to see the full ETF breakdown and analysis.
          Use <strong>+ Compare</strong> to compare portfolios side by side.
          <strong> General information only — not financial advice.</strong>
        </p>
      </div>

      {/* Filters — Category + Risk, same as SmartSuper filter row */}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:16}}>
        <span style={{fontSize:12,color:"#94A3B8",fontWeight:500,marginRight:4}}>Category:</span>
        {CAT_TABS.map(t=>(
          <FilterPill key={t.id} active={cat===t.id}
            onClick={()=>{setCat(t.id);setSelId(null);setShowCmp(false);}}>
            {t.label}
          </FilterPill>
        ))}
        <span style={{color:"#CBD5E1",margin:"0 6px",fontSize:16}}>|</span>
        <span style={{fontSize:12,color:"#94A3B8",fontWeight:500,marginRight:4}}>Risk:</span>
        {RISK_FILTERS.map(r=>(
          <FilterPill key={r.id} active={risk===r.id} onClick={()=>setRisk(r.id)}>
            {r.label}
          </FilterPill>
        ))}
      </div>

      {/* Compare bar */}
      {cmpIds.size>0&&(
        <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:8,
          padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",
          justifyContent:"space-between",gap:12}}>
          <span style={{fontSize:13,color:"#1E40AF",fontWeight:500}}>
            {cmpIds.size} portfolio{cmpIds.size>1?"s":""} selected
            {cmpIds.size===1?" — select one more to compare":""}
          </span>
          <div style={{display:"flex",gap:8}}>
            {cmpIds.size>=2&&(
              <button onClick={()=>{setShowCmp(true);setSelId(null);}}
                style={{padding:"7px 18px",fontSize:13,fontWeight:600,borderRadius:7,
                  background:"#1E1B4B",color:"#fff",border:"none",cursor:"pointer"}}>
                Compare now →
              </button>
            )}
            <button onClick={()=>setCmpIds(new Set())}
              style={{padding:"7px 14px",fontSize:13,borderRadius:7,
                background:"transparent",color:"#64748B",
                border:"1px solid #E2E8F0",cursor:"pointer"}}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Compare panel */}
      {showCmp&&cmpPortfolios.length>=2&&(
        <ComparePanel portfolios={cmpPortfolios} onClose={()=>setShowCmp(false)}/>
      )}

      {/* Detail drawer */}
      {selPortfolio&&!showCmp&&(
        <DetailDrawer p={selPortfolio} onClose={()=>setSelId(null)}/>
      )}

      {/* 2-column portfolio grid */}
      {visible.length===0?(
        <div style={{textAlign:"center",padding:"48px",color:"#94A3B8",fontSize:14}}>
          No portfolios match the selected filters.
        </div>
      ):(
        <div style={{display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(420px,1fr))",gap:12}}>
          {visible.map(p=>(
            <PortfolioCard key={p.id} p={p}
              active={selId===p.id}
              onSelect={()=>selectCard(p.id)}
              inCompare={cmpIds.has(p.id)}
              onToggleCompare={e=>toggleCmp(e,p.id)}/>
          ))}
        </div>
      )}

      <p style={{fontSize:11,color:"#94A3B8",marginTop:18,lineHeight:1.6}}>
        Returns are indicative based on historical index data to June 2025.
        Past performance is not a reliable indicator of future returns.
        SmartETF is an educational platform — general information only, not financial advice.
        Always consult a licensed financial adviser before making investment decisions.
      </p>
    </div>
  );
}
