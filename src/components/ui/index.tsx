"use client";
import React, { useState } from "react";
import { C, S, scoreColor } from "@/lib/styles";

// ── ScoreRing ─────────────────────────────────────────────────────────────────
export function ScoreRing({ score, size=80, label }: { score:number; size?:number; label?:string }) {
  const r = size/2 - 7;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - score/100);
  const col = scoreColor(score);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <svg width={size} height={size} aria-label={`Score: ${score}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F3F4F6" strokeWidth={7}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={fill}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{transition:"stroke-dashoffset 0.6s ease"}}/>
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
          fill={col} fontSize={size*0.26} fontWeight={700} fontFamily="inherit">{score}</text>
      </svg>
      {label && <div style={{fontSize:12,color:C.gray500,fontWeight:500}}>{label}</div>}
    </div>
  );
}

// ── MiniBar ───────────────────────────────────────────────────────────────────
export function MiniBar({ value, max=100, color=C.teal, height=6 }:
  { value:number; max?:number; color?:string; height?:number }) {
  const pct = Math.min(100, (value/max)*100);
  return (
    <div style={{flex:1,height,background:"#F3F4F6",borderRadius:height/2,overflow:"hidden"}}>
      <div style={{width:`${pct}%`,height,background:color,borderRadius:height/2,
        transition:"width 0.4s ease"}}/>
    </div>
  );
}

// ── ScoreRow ──────────────────────────────────────────────────────────────────
export function ScoreRow({ label, score, max=100 }: { label:string; score:number; max?:number }) {
  const col = scoreColor(score);
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
      <div style={{width:160,fontSize:13,color:C.gray600,flexShrink:0}}>{label}</div>
      <MiniBar value={score} max={max} color={col}/>
      <div style={{fontSize:13,fontWeight:700,color:col,minWidth:28,textAlign:"right"}}>{score}</div>
    </div>
  );
}

// ── MetricGrid ────────────────────────────────────────────────────────────────
export function MetricGrid({ items }: { items: {value:string; label:string; color?:string}[] }) {
  return (
    <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(items.length,4)},1fr)`,gap:10,margin:"12px 0"}}>
      {items.map(({value,label,color}) => (
        <div key={label} style={S.metricBox}>
          <span style={{...S.metricValue, color: color ?? C.gray900}}>{value}</span>
          <span style={S.metricLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── IssueCard ─────────────────────────────────────────────────────────────────
export function IssueCard({ severity, message, impact }:
  { severity:"high"|"medium"|"low"; message:string; impact?:string }) {
  const colors = {
    high:   { dot:C.red, bg:C.redLight, text:C.redDark },
    medium: { dot:C.amber, bg:C.amberLight, text:C.amberDark },
    low:    { dot:C.gray400, bg:"#F9FAFB", text:C.gray600 },
  };
  const c = colors[severity];
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",
      borderBottom:`1px solid ${C.gray100}`}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:c.dot,
        flexShrink:0,marginTop:5}}/>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
          <span style={{fontSize:14,color:C.gray800,lineHeight:1.5}}>{message}</span>
          <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:5,
            background:c.bg,color:c.text,flexShrink:0}}>{severity}</span>
        </div>
        {impact && <p style={{fontSize:12,color:C.gray500,margin:"3px 0 0",lineHeight:1.5}}>{impact}</p>}
      </div>
    </div>
  );
}

// ── StrengthCard ──────────────────────────────────────────────────────────────
export function StrengthCard({ message }: { message:string }) {
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0"}}>
      <span style={{color:C.teal,fontSize:16,flexShrink:0,marginTop:1}}>✓</span>
      <span style={{fontSize:14,color:C.gray700,lineHeight:1.5}}>{message}</span>
    </div>
  );
}

// ── SectionLabel ──────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children:React.ReactNode }) {
  return <div style={S.sectionLabel}>{children}</div>;
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, badge }:
  { title:string; subtitle?:string; badge?:string }) {
  return (
    <div style={{marginBottom:24}}>
      {badge && (
        <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",
          color:C.teal,marginBottom:6}}>{badge}</div>
      )}
      <h1 style={{fontSize:26,fontWeight:700,color:C.gray900,margin:0,lineHeight:1.25}}>{title}</h1>
      {subtitle && <p style={{fontSize:15,color:C.gray500,margin:"6px 0 0",lineHeight:1.6}}>{subtitle}</p>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, accent, style: extraStyle }:
  { children:React.ReactNode; accent?:string; style?:React.CSSProperties }) {
  return (
    <div style={{
      ...S.card,
      ...(accent ? {borderLeft:`4px solid ${accent}`,borderRadius:"0 12px 12px 0"} : {}),
      ...extraStyle,
    }}>
      {children}
    </div>
  );
}

// ── LockOverlay ───────────────────────────────────────────────────────────────
export function LockOverlay({ onUnlock }: { onUnlock:()=>void }) {
  return (
    <div style={{position:"relative",marginTop:8}}>
      <div style={{filter:"blur(4px)",pointerEvents:"none",opacity:0.3,
        background:"#F9FAFB",borderRadius:10,padding:"16px",
        fontSize:13,color:C.gray500,lineHeight:2}}>
        Overlap score: 72 · Fee efficiency: 88 · Diversification: 68 · Factor: growth 74%
      </div>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",gap:10}}>
        <div style={{fontSize:24,color:C.gray300}}>🔒</div>
        <div style={{fontSize:14,fontWeight:600,color:C.gray800}}>Subscriber feature</div>
        <div style={{fontSize:13,color:C.gray500,textAlign:"center",maxWidth:240}}>
          Unlock full analysis, optimiser, and SIP coordinator
        </div>
        <button onClick={onUnlock} style={{
          ...S.btnPrimary, marginTop:4}}>
          Unlock — $19/mo
        </button>
      </div>
    </div>
  );
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
export function ProgressBar({ value, max=100, color=C.teal, showLabel=true }:
  { value:number; max?:number; color?:string; showLabel?:boolean }) {
  const pct = Math.min(100, (value/max)*100);
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{flex:1,height:8,background:"#F3F4F6",borderRadius:4,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:8,background:color,borderRadius:4,
          transition:"width 0.5s ease"}}/>
      </div>
      {showLabel && <span style={{fontSize:12,fontWeight:600,color,minWidth:32,textAlign:"right"}}>
        {Math.round(value)}%
      </span>}
    </div>
  );
}

// ── GeoBar ────────────────────────────────────────────────────────────────────
export function GeoBar({ region, pct, color }: { region:string; pct:number; color:string }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
      <div style={{width:64,fontSize:13,color:C.gray600,flexShrink:0}}>{region}</div>
      <div style={{flex:1,height:8,background:"#F3F4F6",borderRadius:4,overflow:"hidden"}}>
        <div style={{width:`${Math.min(100,pct)}%`,height:8,background:color,borderRadius:4,
          transition:"width 0.5s"}}/>
      </div>
      <div style={{fontSize:13,fontWeight:600,color:C.gray800,minWidth:44,textAlign:"right"}}>
        {pct.toFixed(1)}%
      </div>
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, ...props }: { label?:string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label style={{display:"block",fontSize:12,color:C.gray500,
        fontWeight:500,marginBottom:5}}>{label}</label>}
      <input style={S.input} {...props}/>
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, children, ...props }: { label?:string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label style={{display:"block",fontSize:12,color:C.gray500,
        fontWeight:500,marginBottom:5}}>{label}</label>}
      <select style={{...S.input,appearance:"none" as const}} {...props}>{children}</select>
    </div>
  );
}

// ── OverlapBadge ──────────────────────────────────────────────────────────────
export function OverlapBadge({ pct }: { pct:number }) {
  const sev = pct > 70 ? "high" : pct > 35 ? "medium" : "low";
  const colors = {
    high:   { bg:C.redLight, text:C.redDark },
    medium: { bg:C.amberLight, text:C.amberDark },
    low:    { bg:C.greenLight, text:C.greenDark },
  };
  const c = colors[sev];
  return (
    <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:20,
      background:c.bg,color:c.text}}>{pct}% overlap</span>
  );
}

// ── ScoreBand — horizontal gauge strip ───────────────────────────────────────
export function ScoreBand({ score }: { score:number }) {
  const label = score >= 85 ? "Excellent" : score >= 70 ? "Good"
    : score >= 50 ? "Fair" : "Needs work";
  const color = scoreColor(score);
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,
      padding:"12px 16px",background:C.gray50,borderRadius:10}}>
      <div style={{fontSize:32,fontWeight:800,color,lineHeight:1}}>{score}</div>
      <div>
        <div style={{fontSize:15,fontWeight:700,color}}>{label}</div>
        <div style={{fontSize:12,color:C.gray400,marginTop:1}}>Portfolio health score</div>
      </div>
      <div style={{flex:1,marginLeft:8}}>
        <div style={{height:10,background:"#E5E7EB",borderRadius:5,overflow:"hidden",position:"relative"}}>
          <div style={{width:`${score}%`,height:10,borderRadius:5,
            background:`linear-gradient(90deg, ${C.red} 0%, ${C.amber} 45%, ${C.teal} 80%)`,
            transition:"width 0.6s ease"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",
          fontSize:10,color:C.gray400,marginTop:3}}>
          <span>0</span><span>50</span><span>100</span>
        </div>
      </div>
    </div>
  );
}

// ── FeatureCard — for landing/upgrade pages ───────────────────────────────────
export function FeatureCard({ icon, title, desc, badge }:
  { icon:string; title:string; desc:string; badge?:string }) {
  return (
    <div style={{...S.card,display:"flex",gap:16,alignItems:"flex-start"}}>
      <div style={{width:40,height:40,borderRadius:10,background:C.tealLight,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:20,flexShrink:0}}>{icon}</div>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <div style={{fontSize:15,fontWeight:600,color:C.gray900}}>{title}</div>
          {badge && <span style={S.badgeGreen}>{badge}</span>}
        </div>
        <div style={{fontSize:13,color:C.gray500,lineHeight:1.6}}>{desc}</div>
      </div>
    </div>
  );
}
