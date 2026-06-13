"use client";
import React, { useState } from "react";
import { C, S, fmtAUD } from "@/lib/styles";
import {
  MODEL_SHARES, SHARE_CATEGORIES, SHARE_RISK_FILTERS, getSharesByCategory,
  type ModelShare, type ShareCategory, type ShareMarket, type ShareSector,
} from "@/data/sharePortfolio";

// ── Sector colour dot ─────────────────────────────────────────────────────────
function SectorDot({ color, size=8 }: { color:string; size?:number }) {
  return <div style={{width:size,height:size,borderRadius:2,background:color,flexShrink:0}}/>;
}

// ── Risk dots ─────────────────────────────────────────────────────────────────
function RiskDots({ level, color }: { level:number; color:string }) {
  return (
    <span style={{display:"inline-flex",alignItems:"flex-end",gap:2}}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} style={{display:"inline-block",width:4,
          height:4+i*3,borderRadius:2,
          background:i<=level?color:"#CBD5E1"}}/>
      ))}
    </span>
  );
}

// ── Return badge ──────────────────────────────────────────────────────────────
function RetBadge({ value, label }: { value:number; label:string }) {
  const c = value >= 20 ? "#1D9E75" : value >= 8 ? "#1D9E75" : value >= 0 ? "#BA7517" : "#DC2626";
  return (
    <div>
      <div style={{fontSize:13,fontWeight:700,color:c}}>
        {value >= 0 ? "+" : ""}{value}%
      </div>
      <div style={{fontSize:11,color:"#94A3B8",marginTop:1}}>{label}</div>
    </div>
  );
}

// ── Category badge ────────────────────────────────────────────────────────────
function Badge({ label, tagColor, tagBg }: { label:string; tagColor:string; tagBg:string }) {
  return (
    <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4,
      background:tagBg,color:tagColor,whiteSpace:"nowrap"}}>{label}</span>
  );
}

// ── Market pill ───────────────────────────────────────────────────────────────
function MarketPill({ market }: { market:string }) {
  const c = market==="ASX"?"#0F6E56":market==="NASDAQ"?"#185FA5":"#854F0B";
  const bg = market==="ASX"?"#E1F5EE":market==="NASDAQ"?"#E6F1FB":"#FAEEDA";
  return (
    <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,
      background:bg,color:c,letterSpacing:".03em"}}>{market}</span>
  );
}

// ── Filter pill ───────────────────────────────────────────────────────────────
function Pill({ active, onClick, children }: { active:boolean; onClick:()=>void; children:React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding:"5px 14px",fontSize:13,borderRadius:20,cursor:"pointer",
      border:active?"2px solid #1E1B4B":"1px solid #CBD5E1",
      background:active?"#1E1B4B":"#fff",
      color:active?"#fff":"#475569",fontWeight:active?600:400,
    }}>{children}</button>
  );
}

// ── Stock card ────────────────────────────────────────────────────────────────
function StockCard({ s, active, onSelect }: {
  s:ModelShare; active:boolean; onSelect:()=>void;
}) {
  const rc = s.riskLevel>=5?"#DC2626":s.riskLevel>=4?"#D97706":s.riskLevel>=3?"#B45309":"#059669";
  return (
    <div onClick={onSelect} style={{
      background:"#fff",
      border:`1px solid ${active?"#3B82F6":"#E2E8F0"}`,
      borderRadius:10,padding:"16px 18px",cursor:"pointer",
      boxShadow:active?"0 0 0 3px rgba(59,130,246,0.12)":"none",
      transition:"border-color .12s,box-shadow .12s",
      marginBottom:10,
    }}>
      <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
        {/* Ticker badge */}
        <div style={{flexShrink:0,textAlign:"center",minWidth:60}}>
          <div style={{fontSize:16,fontWeight:800,color:"#0F172A",lineHeight:1}}>{s.ticker}</div>
          <div style={{marginTop:4}}><MarketPill market={s.market}/></div>
        </div>

        {/* Content */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
            <span style={{fontSize:14,fontWeight:700,color:"#0F172A"}}>{s.name}</span>
            <Badge label={SHARE_CATEGORIES[s.category]?.label ?? s.category}
              tagColor={s.tagColor} tagBg={s.tagBg}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <SectorDot color={s.color}/>
            <span style={{fontSize:12,color:"#64748B"}}>{s.sector}</span>
            <span style={{color:"#CBD5E1"}}>·</span>
            <span style={{fontSize:12,color:"#64748B"}}>{s.index}</span>
          </div>
          <p style={{fontSize:13,color:"#64748B",lineHeight:1.5,margin:"0 0 10px",
            overflow:"hidden",display:"-webkit-box",
            WebkitLineClamp:2,WebkitBoxOrient:"vertical" as any}}>
            {s.desc}
          </p>
          {/* Stats row */}
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <RetBadge value={s.return1yr} label="1yr return"/>
            <RetBadge value={s.return3yr} label="3yr p.a."/>
            <RetBadge value={s.return5yr} label="5yr p.a."/>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#0F172A"}}>{s.peRatio}x</div>
              <div style={{fontSize:11,color:"#94A3B8",marginTop:1}}>P/E ratio</div>
            </div>
            {s.divYield > 0 && (
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#1D9E75"}}>
                  {s.divYield}%{s.franked&&"*"}
                </div>
                <div style={{fontSize:11,color:"#94A3B8",marginTop:1}}>
                  Yield{s.franked?" (franked)":""}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,
        paddingTop:10,borderTop:"1px solid #F1F5F9",flexWrap:"wrap"}}>
        <RiskDots level={s.riskLevel} color={rc}/>
        <span style={{fontSize:11,fontWeight:600,color:rc}}>{s.riskLabel}</span>
        <span style={{color:"#CBD5E1"}}>·</span>
        <span style={{fontSize:11,color:"#94A3B8"}}>Market cap: A${s.marketCapBn >= 1000
          ? `${(s.marketCapBn/1000).toFixed(1)}T`
          : `${s.marketCapBn}B`}</span>
        <span style={{marginLeft:"auto",fontSize:10,fontWeight:600,
          color:"#166534",background:"#F0FDF4",padding:"2px 7px",
          borderRadius:4,border:"1px solid #BBF7D0",whiteSpace:"nowrap"}}>
          🔄 Updated monthly
        </span>
      </div>
    </div>
  );
}

// ── Right detail panel ────────────────────────────────────────────────────────
function DetailPanel({ s }: { s:ModelShare }) {
  const rc = s.riskLevel>=5?"#DC2626":s.riskLevel>=4?"#D97706":s.riskLevel>=3?"#B45309":"#059669";
  return (
    <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,
      padding:"20px 22px",position:"sticky",top:80,
      maxHeight:"calc(100vh - 100px)",overflowY:"auto"}}>

      {/* Header */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
          <SectorDot color={s.color} size={10}/>
          <span style={{fontSize:19,fontWeight:800,color:"#0F172A"}}>{s.ticker}</span>
          <MarketPill market={s.market}/>
          <Badge label={SHARE_CATEGORIES[s.category]?.label ?? s.category}
            tagColor={s.tagColor} tagBg={s.tagBg}/>
        </div>
        <div style={{fontSize:14,fontWeight:600,color:"#475569",marginBottom:4}}>{s.name}</div>
        <div style={{fontSize:12,color:"#94A3B8",marginBottom:8}}>{s.sector} · {s.index}</div>
        <p style={{fontSize:13,color:"#475569",lineHeight:1.65,margin:0}}>{s.desc}</p>
      </div>

      {/* Monthly review badge */}
      <div style={{display:"inline-flex",alignItems:"center",gap:6,marginBottom:14,
        padding:"6px 11px",background:"#F0FDF4",borderRadius:6,border:"1px solid #BBF7D0"}}>
        <span style={{fontSize:11}}>🔄</span>
        <span style={{fontSize:11,color:"#166534",fontWeight:600}}>
          Reviewed monthly · Last updated June 2025
        </span>
      </div>

      {/* Key metrics */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0,
        borderTop:"1px solid #F1F5F9",paddingTop:14,marginBottom:16}}>
        {[
          {v:`${s.return1yr>=0?"+":""}${s.return1yr}%`, l:"1yr return"},
          {v:`${s.return3yr>=0?"+":""}${s.return3yr}%`, l:"3yr p.a."},
          {v:`${s.return5yr>=0?"+":""}${s.return5yr}%`, l:"5yr p.a."},
        ].map(({v,l})=>{
          const n = parseFloat(v);
          const c = n>=15?"#1D9E75":n>=5?"#1D9E75":n>=0?"#BA7517":"#DC2626";
          return(
            <div key={l} style={{textAlign:"center",padding:"0 6px",
              borderRight:"1px solid #F1F5F9"}}>
              <div style={{fontSize:20,fontWeight:800,color:c,letterSpacing:"-0.02em",lineHeight:1.1}}>{v}</div>
              <div style={{fontSize:11,color:"#94A3B8",marginTop:4}}>{l}</div>
            </div>
          );
        })}
      </div>

      {/* Valuation + dividend metrics */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {[
          {l:"P/E ratio",    v:`${s.peRatio}x`,         note:"Price to earnings"},
          {l:"Market cap",   v:`A$${s.marketCapBn>=1000?(s.marketCapBn/1000).toFixed(1)+"T":s.marketCapBn+"B"}`, note:s.market+" listed"},
          ...(s.divYield > 0 ? [
            {l:"Dividend yield", v:`${s.divYield}%`,    note:s.franked?`${s.frankingPct}% franked`:"Unfranked"},
            {l:"After-tax yield (30%)", v:`${(s.divYield * (1 + (s.frankingPct??0)/100 * 0.3/0.7)).toFixed(1)}%`, note:"Est. for 30% tax bracket"},
          ] : [
            {l:"Dividend",    v:"None",                  note:"Growth stock — reinvests earnings"},
          ]),
        ].map(({l,v,note})=>(
          <div key={l} style={{background:"#F8FAFC",borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontSize:11,color:"#94A3B8",marginBottom:3}}>{l}</div>
            <div style={{fontSize:15,fontWeight:700,color:"#0F172A",lineHeight:1.2}}>{v}</div>
            <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{note}</div>
          </div>
        ))}
      </div>

      {/* Moat */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",
          textTransform:"uppercase",color:"#94A3B8",marginBottom:6}}>Competitive advantage</div>
        <div style={{padding:"10px 14px",background:"#EFF6FF",borderRadius:8,
          fontSize:13,color:"#1E40AF",lineHeight:1.55,fontStyle:"italic"}}>
          "{s.moat}"
        </div>
      </div>

      {/* Investment thesis */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",
          textTransform:"uppercase",color:"#94A3B8",marginBottom:6}}>Investment thesis</div>
        <p style={{fontSize:13,color:"#475569",lineHeight:1.65,margin:0}}>{s.thesis}</p>
      </div>

      {/* Watch for */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.08em",
          textTransform:"uppercase",color:"#94A3B8",marginBottom:6}}>Key risk to watch</div>
        <div style={{padding:"10px 14px",background:"#FFFBEB",borderRadius:8,
          border:"1px solid #FDE68A",display:"flex",gap:8,alignItems:"flex-start"}}>
          <span style={{color:"#D97706",flexShrink:0}}>⚠</span>
          <span style={{fontSize:13,color:"#78350F",lineHeight:1.55}}>{s.watchFor}</span>
        </div>
      </div>

      {/* Risk level */}
      <div style={{display:"flex",alignItems:"center",gap:8,
        padding:"10px 12px",background:"#F8FAFC",borderRadius:8}}>
        <RiskDots level={s.riskLevel} color={rc}/>
        <span style={{fontSize:12,fontWeight:600,color:rc}}>{s.riskLabel} risk</span>
        {s.franked && (
          <>
            <span style={{color:"#CBD5E1"}}>·</span>
            <span style={{fontSize:12,color:"#1D9E75",fontWeight:500}}>
              ✓ {s.frankingPct}% franked dividends
            </span>
          </>
        )}
      </div>

      <p style={{fontSize:11,color:"#94A3B8",marginTop:12,lineHeight:1.6}}>
        Returns are indicative based on historical share price data to June 2025.
        Past performance is not a reliable indicator of future returns.
        General information only — not financial advice. Always consult a licensed adviser.
      </p>
    </div>
  );
}

// ── Empty panel ───────────────────────────────────────────────────────────────
function EmptyPanel() {
  return (
    <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,
      padding:"40px 24px",textAlign:"center",position:"sticky",top:80}}>
      <div style={{fontSize:40,marginBottom:12}}>📈</div>
      <div style={{fontSize:15,fontWeight:600,color:"#0F172A",marginBottom:6}}>Select a stock</div>
      <div style={{fontSize:13,color:"#64748B",lineHeight:1.6}}>
        Click any stock card to see the investment thesis, competitive advantage, key risks, and full metrics.
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SharePortfolio() {
  const [cat,   setCat]   = useState<ShareCategory|"all">("all");
  const [risk,  setRisk]  = useState("all");
  const [mkt,   setMkt]   = useState<ShareMarket|"all">("all");
  const [search,setSearch]= useState("");
  const [selId, setSelId] = useState<string|null>(null);

  // Filter
  let visible = getSharesByCategory(cat);
  if (mkt !== "all")    visible = visible.filter(s=>s.market===mkt);
  if (risk !== "all")   visible = visible.filter(s=>{
    if (risk==="1-2") return s.riskLevel<=2;
    if (risk==="3")   return s.riskLevel===3;
    if (risk==="4")   return s.riskLevel===4;
    if (risk==="5")   return s.riskLevel===5;
    return true;
  });
  if (search.trim()) {
    const q = search.toLowerCase();
    visible = visible.filter(s=>
      s.ticker.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    );
  }

  const selStock = selId ? MODEL_SHARES.find(s=>s.ticker===selId) : null;
  const auCount  = MODEL_SHARES.filter(s=>s.market==="ASX").length;
  const usCount  = MODEL_SHARES.filter(s=>s.market!=="ASX").length;

  const CAT_TABS: {id:ShareCategory|"all";label:string}[] = [
    {id:"all",         label:`All ${MODEL_SHARES.length}`},
    {id:"high-growth", label:"High growth"},
    {id:"large-cap",   label:"Large cap"},
    {id:"mid-cap",     label:"Mid cap"},
    {id:"income",      label:"Income"},
    {id:"defensive",   label:"Defensive"},
  ];

  return (
    <div>
      {/* Page subtitle */}
      <p style={{fontSize:13,color:"#64748B",margin:"0 0 14px"}}>
        High-quality stocks from ASX 100, S&P 500, and Nasdaq-100
      </p>

      {/* Quality scope banner */}
      <div style={{background:"#1E1B4B",borderRadius:8,padding:"14px 18px",
        marginBottom:16,display:"flex",alignItems:"flex-start",
        justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:20,flexShrink:0}}>🔍</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:3}}>
              Curated high-quality stocks only — {MODEL_SHARES.length} stocks total
            </div>
            <div style={{fontSize:12,color:"#A5B4FC",lineHeight:1.5}}>
              This list includes only stocks from the <strong style={{color:"#fff"}}>ASX 100</strong>,{" "}
              <strong style={{color:"#fff"}}>S&P 500</strong>, and{" "}
              <strong style={{color:"#fff"}}>Nasdaq-100</strong> with strong competitive moats.
              No speculative, micro-cap, or unproven companies.
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:16,flexShrink:0,flexWrap:"wrap"}}>
          {[
            {label:`${auCount} AU stocks`, sub:"ASX 100",     icon:"🇦🇺"},
            {label:`${usCount} US stocks`, sub:"S&P 500 / Nasdaq", icon:"🇺🇸"},
            {label:"Updated monthly",      sub:"MER & returns data",icon:"🔄"},
          ].map(({label,sub,icon})=>(
            <div key={label} style={{textAlign:"center"}}>
              <div style={{fontSize:16,marginBottom:2}}>{icon}</div>
              <div style={{fontSize:11,color:"#34D399",fontWeight:700}}>{label}</div>
              <div style={{fontSize:10,color:"#A5B4FC",marginTop:1}}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:8,
        padding:"10px 16px",marginBottom:16,display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{color:"#2563EB",fontSize:15,flexShrink:0}}>ℹ</span>
        <p style={{fontSize:13,color:"#1E40AF",margin:0,lineHeight:1.5}}>
          Click any stock to see the full analysis on the right — investment thesis, competitive advantage, and key risks.
          Returns are indicative based on historical share price data to June 2025.
          <strong> General information only — not financial advice.</strong>
        </p>
      </div>

      {/* Filters */}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:10}}>
        <span style={{fontSize:12,color:"#94A3B8",fontWeight:500}}>Category:</span>
        {CAT_TABS.map(t=>(
          <Pill key={t.id} active={cat===t.id}
            onClick={()=>{setCat(t.id);setSelId(null);}}>
            {t.label}
          </Pill>
        ))}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:10}}>
        <span style={{fontSize:12,color:"#94A3B8",fontWeight:500}}>Market:</span>
        {(["all","ASX","NASDAQ","NYSE"] as const).map(m=>(
          <Pill key={m} active={mkt===m} onClick={()=>{setMkt(m);setSelId(null);}}>
            {m==="all"?"All markets":m}
          </Pill>
        ))}
        <span style={{color:"#CBD5E1",margin:"0 4px"}}>|</span>
        <span style={{fontSize:12,color:"#94A3B8",fontWeight:500}}>Risk level:</span>
        {SHARE_RISK_FILTERS.map(r=>(
          <Pill key={r.id} active={risk===r.id} onClick={()=>setRisk(r.id)}>
            {r.label}
          </Pill>
        ))}
      </div>

      {/* Search */}
      <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
        <div style={{position:"relative",flex:1,maxWidth:340}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
            fontSize:14,color:"#94A3B8"}}>🔍</span>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search ticker, name, or sector…"
            style={{...S.input,paddingLeft:36,background:"#fff",fontSize:13}}
          />
        </div>
        <span style={{fontSize:12,color:"#94A3B8"}}>
          {visible.length} stock{visible.length!==1?"s":""} shown
        </span>
      </div>

      {/* Split layout */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 400px",gap:14,alignItems:"start"}}>
        {/* Left — list */}
        <div>
          {visible.length===0 ? (
            <div style={{textAlign:"center",padding:"48px",color:"#94A3B8",fontSize:14}}>
              No stocks match the selected filters.
            </div>
          ) : (
            visible.map(s=>(
              <StockCard key={s.ticker} s={s}
                active={selId===s.ticker}
                onSelect={()=>setSelId(prev=>prev===s.ticker?null:s.ticker)}/>
            ))
          )}
        </div>

        {/* Right — detail */}
        <div>
          {selStock ? <DetailPanel s={selStock}/> : <EmptyPanel/>}
        </div>
      </div>

      {/* Franking footnote */}
      {visible.some(s=>s.franked) && (
        <p style={{fontSize:11,color:"#94A3B8",marginTop:8,lineHeight:1.6}}>
          * Franked yields shown are the cash dividend rate. After-tax yield is higher for Australian
          investors in the 30%+ tax bracket due to franking credits. Franking credit value depends on
          individual tax position — consult a tax adviser.
        </p>
      )}
      <p style={{fontSize:11,color:"#94A3B8",marginTop:4,lineHeight:1.6}}>
        Returns are indicative based on historical share price data to June 2025.
        Past performance is not a reliable indicator of future returns.
        General information only — not financial advice. Always consult a licensed financial adviser
        before making investment decisions.
      </p>
    </div>
  );
}
