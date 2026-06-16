"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SB    = "#1E1B4B";   // sidebar bg — deep indigo
const ACC   = "#3B82F6";   // accent — electric blue
const ACCL  = "rgba(59,130,246,0.14)";
const STX   = "#A5B4FC";   // sidebar text
const SMT   = "rgba(165,180,252,0.38)"; // sidebar muted
const PBG   = "#F1F5F9";   // page bg
const WH    = "#FFFFFF";
const BR    = "#E2E8F0";

const FREE = [
  {href:"/dashboard", label:"Health score",       icon:"○"},
  {href:"/overlap",   label:"Overlap scanner",    icon:"⊗"},
  {href:"/exposure",  label:"Exposure map",       icon:"◎"},
  {href:"/guide",     label:"Build your portfolio",icon:"📖"},
  {href:"/settings",  label:"My portfolio",       icon:"⊙"},
];
const SUB = [
  {href:"/optimiser",  label:"Portfolio optimiser",  icon:"↗"},
  {href:"/sip",        label:"Monthly buy planner",  icon:"⟳"},
  {href:"/scenarios",  label:"What if scenarios",    icon:"◈"},
  {href:"/portfolios", label:"Model ETF portfolios", icon:"⊞"},
  {href:"/shares",     label:"Model share portfolio",icon:"◉"},
];
const ALL = [...FREE,...SUB];

interface P { children:React.ReactNode; isSubscriber:boolean; userEmail?:string }

export default function DashboardLayout({children,isSubscriber,userEmail}:P){
  const path = usePathname();
  const [mob,setMob]=useState(false);
  const pageTitle = ALL.find(n=>n.href===path)?.label ?? "Dashboard";

  const SidebarContent=()=>(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:SB,minHeight:"100vh"}}>

      {/* Logo */}
      <div style={{padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:SMT,marginBottom:5}}>AU · ETF</div>
        <div style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-0.02em",lineHeight:1.1}}>
          Smart<span style={{color:ACC}}>ETF</span>
        </div>
        <div style={{fontSize:12,color:STX,marginTop:2}}>Portfolio intelligence</div>
      </div>

      {/* Free tools */}
      <div style={{paddingTop:10}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:SMT,padding:"6px 16px 4px"}}>Free tools</div>
        {FREE.map(n=>{
          const a=path===n.href;

          // Build your portfolio — prominent highlighted card
          if(n.href==="/guide") return(
            <Link key={n.href} href={n.href} style={{
              display:"block",margin:"6px 10px 4px",
              padding:"10px 12px",borderRadius:8,
              textDecoration:"none",
              background:a?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.06)",
              border:`1px solid ${a?"rgba(59,130,246,0.5)":"rgba(255,255,255,0.1)"}`,
              transition:"background .15s",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:15}}>{n.icon}</span>
                <span style={{fontSize:13,fontWeight:700,color:"#fff",lineHeight:1.2}}>
                  {n.label}
                </span>
                <span style={{marginLeft:"auto",fontSize:10,fontWeight:700,
                  padding:"2px 6px",borderRadius:4,
                  background:"rgba(52,211,153,0.2)",color:"#34D399",
                  border:"1px solid rgba(52,211,153,0.3)",whiteSpace:"nowrap"}}>
                  NEW
                </span>
              </div>
              <div style={{fontSize:11,color:"rgba(165,180,252,0.7)",lineHeight:1.4,paddingLeft:23}}>
                New to investing? Start here — brokers, buying, and more.
              </div>
            </Link>
          );

          // Regular nav items
          return(
            <Link key={n.href} href={n.href} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 16px",
              textDecoration:"none",fontSize:14,
              borderLeft:a?`3px solid ${ACC}`:"3px solid transparent",
              background:a?ACCL:"transparent",
              color:a?"#fff":STX,fontWeight:a?600:400,
            }}>
              <span style={{fontSize:14,width:18,textAlign:"center",flexShrink:0}}>{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </div>

      {/* Subscriber tools */}
      <div style={{paddingTop:10}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:SMT,padding:"6px 16px 4px"}}>Subscriber tools</div>
        {SUB.map(n=>{
          const a=path===n.href;
          const lk=!isSubscriber;
          return(
            <Link key={n.href} href={lk?"/upgrade":n.href} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 16px",
              textDecoration:"none",fontSize:14,
              borderLeft:a?`3px solid ${ACC}`:"3px solid transparent",
              background:a?ACCL:"transparent",
              color:lk?SMT:a?"#fff":STX,fontWeight:a?600:400,
            }}>
              <span style={{fontSize:14,width:18,textAlign:"center",flexShrink:0,opacity:lk?0.5:1}}>{n.icon}</span>
              <span style={{opacity:lk?0.5:1}}>{n.label}</span>
              {lk&&<span style={{marginLeft:"auto",fontSize:11,opacity:0.5}}>🔒</span>}
            </Link>
          );
        })}
      </div>

      <div style={{flex:1}}/>

      {/* Subscriber badge */}
      {isSubscriber&&(
        <div style={{margin:"0 12px 8px",padding:"7px 12px",background:"rgba(59,130,246,0.15)",
          borderRadius:7,border:"1px solid rgba(59,130,246,0.28)",
          fontSize:12,color:ACC,fontWeight:700,textAlign:"center"}}>
          Subscriber ✓
        </div>
      )}
      {!isSubscriber&&(
        <div style={{margin:"0 12px 8px",padding:"12px 14px",background:"rgba(59,130,246,0.1)",
          borderRadius:8,border:"1px solid rgba(59,130,246,0.18)"}}>
          <div style={{fontSize:12,fontWeight:700,color:ACC,marginBottom:3}}>Unlock all tools</div>
          <div style={{fontSize:11,color:STX,lineHeight:1.5,marginBottom:8}}>Full analysis from $19/mo</div>
          <Link href="/upgrade" style={{display:"block",textAlign:"center",padding:"7px",
            background:ACC,color:"#fff",borderRadius:6,fontSize:12,fontWeight:700,textDecoration:"none"}}>
            Upgrade now
          </Link>
        </div>
      )}

      {/* Bottom links — exactly SmartSuper */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <Link href="/settings" style={{display:"flex",alignItems:"center",gap:8,
          padding:"11px 16px",fontSize:13,color:STX,textDecoration:"none"}}>
          <span style={{fontSize:14}}>✎</span> Edit profile
        </Link>
        <a href="mailto:support@smartetfau.com" style={{display:"flex",alignItems:"center",gap:8,
          padding:"11px 16px",fontSize:13,color:STX,textDecoration:"none"}}>
          <span style={{fontSize:14}}>✉</span> Contact support
        </a>
        <Link href="/auth/logout" style={{display:"flex",alignItems:"center",gap:8,
          padding:"11px 16px",fontSize:13,color:"#F87171",textDecoration:"none"}}>
          <span style={{fontSize:14}}>↩</span> Sign out
        </Link>
        <div style={{padding:"6px 16px 16px",fontSize:10,color:SMT,lineHeight:1.5}}>
          General information only.<br/>Not financial advice.
        </div>
      </div>
    </div>
  );

  return(
    <div style={{display:"flex",minHeight:"100vh",background:PBG,
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>

      {/* SIDEBAR — inline display:flex so it is ALWAYS visible on desktop regardless of CSS loading */}
      <div id="smartetf-sidebar" style={{
        width:260,minWidth:260,flexShrink:0,
        position:"sticky",top:0,height:"100vh",overflowY:"auto",
        display:"flex",flexDirection:"column",  /* <-- explicit, not relying on CSS class */
      }}>
        <SidebarContent/>
      </div>

      {/* Mobile overlay */}
      {mob&&(
        <div style={{position:"fixed",inset:0,zIndex:100,display:"flex"}}>
          <div style={{width:260,height:"100%",overflowY:"auto",flexShrink:0}}>
            <SidebarContent/>
          </div>
          <div style={{flex:1,background:"rgba(0,0,0,0.5)"}} onClick={()=>setMob(false)}/>
        </div>
      )}

      {/* Main column */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>

        {/* TOP BAR — always rendered, same structure as SmartSuper */}
        <div style={{
          background:WH,borderBottom:`1px solid ${BR}`,
          padding:"0 28px",height:64,flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          position:"sticky",top:0,zIndex:10,
        }}>
          {/* Left: hamburger (mobile) + title */}
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setMob(true)}
              style={{display:"none",background:"none",border:"none",
                cursor:"pointer",fontSize:22,color:"#374151",padding:0,lineHeight:1}}
              id="smartetf-hamburger">☰</button>
            <div>
              <div style={{fontSize:20,fontWeight:700,color:"#0F172A",lineHeight:1.2}}>{pageTitle}</div>
              <div style={{fontSize:12,color:"#64748B",marginTop:1}}>
                {path==="/portfolios"&&"15 model ETF portfolios — fee and overlap analysis"}
                {path==="/dashboard" &&"Your personalised portfolio health score"}
                {path==="/overlap"   &&"Company-level duplicate detection across your ETFs"}
                {path==="/exposure"  &&"Geographic, sector, and factor breakdown"}
                {path==="/optimiser" &&"Personalised ETF action plan based on your goal"}
                {path==="/sip"       &&"Tell us your monthly amount — we tell you exactly which ETF to buy"}
                {path==="/scenarios" &&"Goal-based portfolio modelling and comparison"}
                {path==="/settings"  &&"Update your ETF holdings and personal details"}
                {path==="/shares"    &&"High-quality stocks from ASX 100, S&P 500 and Nasdaq-100"}
                {path==="/guide"     &&"Step-by-step guide to building and managing your portfolio"}
              </div>
            </div>
          </div>
          {/* Right: switch app + action buttons */}
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {/* SmartSuper switcher pill */}
            <a href="https://smartsuperau.com/dashboard"
              target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:7,
                padding:"7px 13px",fontSize:12,fontWeight:600,borderRadius:8,
                border:"1px solid #DDD6FE",textDecoration:"none",
                color:"#7C3AED",background:"#F5F3FF"}}>
              <div style={{width:18,height:18,borderRadius:4,background:"#7C3AED",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:9,fontWeight:800,color:"#fff",flexShrink:0}}>S</div>
              SmartSuper AU
              <span style={{fontSize:11,opacity:0.55}}>↗</span>
            </a>
            <div style={{width:1,height:20,background:BR,flexShrink:0}}/>
            <Link href="/settings" style={{display:"flex",alignItems:"center",gap:6,
              padding:"8px 16px",fontSize:13,fontWeight:500,borderRadius:8,
              border:`1px solid ${BR}`,textDecoration:"none",color:"#374151",background:WH}}>
              ✎ Edit profile
            </Link>
            <a href="mailto:support@smartetfau.com" style={{display:"flex",alignItems:"center",gap:6,
              padding:"8px 16px",fontSize:13,fontWeight:500,borderRadius:8,
              border:`1px solid ${BR}`,textDecoration:"none",color:"#374151",background:WH}}>
              ✉ Contact
            </a>
            <Link href="/auth/logout" style={{display:"flex",alignItems:"center",gap:6,
              padding:"8px 16px",fontSize:13,fontWeight:500,borderRadius:8,
              border:"1px solid #FECACA",textDecoration:"none",color:"#DC2626",background:"#FEF2F2"}}>
              ↩ Sign out
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main style={{flex:1,padding:"28px 32px",maxWidth:1100,width:"100%",boxSizing:"border-box"}}>
          {children}
        </main>
      </div>

      {/* Responsive — only hides sidebar on mobile, top bar always shows */}
      <style>{`
        @media(max-width:767px){
          #smartetf-sidebar{display:none!important}
          #smartetf-hamburger{display:flex!important}
          main{padding:16px!important}
        }
      `}</style>
    </div>
  );
}
