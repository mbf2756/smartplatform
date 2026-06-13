"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAVY = "#0F172A";
const NAVY2 = "#1E293B";
const SIDEBAR_TEXT = "#94A3B8";
const SIDEBAR_MUTED = "rgba(148,163,184,0.45)";
const TEAL = "#1D9E75";
const TEAL_BG = "rgba(29,158,117,0.15)";
const PAGE_BG = "#F1F5F9";
const TOP_BG = "#FFFFFF";

const NAV = [
  { href:"/dashboard",  icon:"○", label:"Health score",          tier:"free" },
  { href:"/overlap",    icon:"⊗", label:"Overlap scanner",       tier:"free" },
  { href:"/exposure",   icon:"◎", label:"Exposure map",          tier:"free" },
  { href:"/optimiser",  icon:"↗", label:"Portfolio optimiser",   tier:"sub"  },
  { href:"/sip",        icon:"⟳", label:"SIP coordinator",       tier:"sub"  },
  { href:"/scenarios",  icon:"◈", label:"What if scenarios",     tier:"sub"  },
  { href:"/portfolios", icon:"⊞", label:"Model ETF portfolios",  tier:"sub"  },
  { href:"/settings",   icon:"⚙", label:"My portfolio",          tier:"free" },
];

interface Props {
  children: React.ReactNode;
  isSubscriber: boolean;
  userEmail?: string;
}

export default function DashboardLayout({ children, isSubscriber, userEmail }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavItems = () => (
    <>
      {/* Free tools */}
      <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
        color:SIDEBAR_MUTED,padding:"16px 16px 6px"}}>Free tools</div>
      {NAV.filter(n=>n.tier==="free").map(item=>{
        const active = pathname===item.href;
        return (
          <Link key={item.href} href={item.href} style={{
            display:"flex",alignItems:"center",gap:10,
            padding:"9px 16px",margin:"1px 8px",borderRadius:8,
            textDecoration:"none",fontSize:14,
            background:active?TEAL_BG:"transparent",
            color:active?TEAL:SIDEBAR_TEXT,
            fontWeight:active?600:400,
          }}>
            <span style={{fontSize:15,width:18,textAlign:"center",flexShrink:0}}>{item.icon}</span>
            <span>{item.label}</span>
            {active&&<span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:TEAL}}/>}
          </Link>
        );
      })}

      {/* Subscriber tools */}
      <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
        color:SIDEBAR_MUTED,padding:"20px 16px 6px"}}>Subscriber tools</div>
      {NAV.filter(n=>n.tier==="sub").map(item=>{
        const active = pathname===item.href;
        const locked = !isSubscriber;
        return (
          <Link key={item.href} href={locked?"/upgrade":item.href} style={{
            display:"flex",alignItems:"center",gap:10,
            padding:"9px 16px",margin:"1px 8px",borderRadius:8,
            textDecoration:"none",fontSize:14,
            background:active?TEAL_BG:"transparent",
            color:locked?"rgba(148,163,184,0.35)":active?TEAL:SIDEBAR_TEXT,
            fontWeight:active?600:400,
          }}>
            <span style={{fontSize:15,width:18,textAlign:"center",flexShrink:0}}>{item.icon}</span>
            <span>{item.label}</span>
            {locked&&<span style={{marginLeft:"auto",fontSize:12}}>🔒</span>}
            {active&&!locked&&<span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:TEAL}}/>}
          </Link>
        );
      })}
    </>
  );

  const SidebarInner = () => (
    <div style={{display:"flex",flexDirection:"column",height:"100%",minHeight:"100vh"}}>
      {/* Logo */}
      <div style={{padding:"24px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",
          color:SIDEBAR_MUTED,marginBottom:6}}>AU · ETF</div>
        <div style={{fontSize:20,fontWeight:700,color:"#fff",letterSpacing:"-0.02em",lineHeight:1.1}}>
          Smart<span style={{color:TEAL}}>ETF</span>
        </div>
        <div style={{fontSize:12,color:SIDEBAR_TEXT,marginTop:3}}>Portfolio intelligence</div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,paddingTop:4,overflowY:"auto"}}><NavItems/></nav>

      {/* Upgrade box */}
      {!isSubscriber&&(
        <div style={{margin:"8px",padding:"14px 16px",background:"rgba(29,158,117,0.1)",
          borderRadius:10,border:"1px solid rgba(29,158,117,0.22)"}}>
          <div style={{fontSize:12,fontWeight:600,color:TEAL,marginBottom:3}}>Unlock all tools</div>
          <div style={{fontSize:12,color:SIDEBAR_TEXT,lineHeight:1.5,marginBottom:10}}>
            Full analysis suite from $19/mo
          </div>
          <Link href="/upgrade" style={{display:"block",textAlign:"center",padding:"8px",
            background:TEAL,color:"#fff",borderRadius:7,fontSize:13,fontWeight:600,
            textDecoration:"none"}}>Upgrade now</Link>
        </div>
      )}

      {/* Subscriber badge */}
      {isSubscriber&&(
        <div style={{margin:"8px 16px",padding:"7px 12px",background:"rgba(29,158,117,0.1)",
          borderRadius:7,border:"1px solid rgba(29,158,117,0.2)",
          fontSize:12,color:TEAL,fontWeight:600,textAlign:"center"}}>
          Subscriber ✓
        </div>
      )}

      {/* User + sign out */}
      <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:TEAL,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>
            {userEmail?.[0]?.toUpperCase()??"U"}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,color:"#fff",fontWeight:500,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {userEmail??"My account"}
            </div>
            <div style={{fontSize:11,color:SIDEBAR_TEXT}}>
              {isSubscriber?"Pro subscriber":"Free plan"}
            </div>
          </div>
        </div>
        <Link href="/auth/logout" style={{display:"flex",alignItems:"center",gap:8,
          padding:"8px 10px",borderRadius:7,textDecoration:"none",fontSize:13,
          color:"#E24B4A",background:"rgba(226,75,74,0.08)",
          border:"1px solid rgba(226,75,74,0.15)"}}>
          <span style={{fontSize:14}}>↩</span> Sign out
        </Link>
        <div style={{fontSize:10,color:SIDEBAR_MUTED,marginTop:10,lineHeight:1.5}}>
          General information only. Not financial advice.
        </div>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",minHeight:"100vh",background:PAGE_BG,
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"}}>

      {/* Desktop sidebar — always visible ≥768px */}
      <aside style={{width:220,flexShrink:0,background:NAVY,
        position:"sticky",top:0,height:"100vh",overflowY:"auto"}}
        className="smartetf-sidebar">
        <SidebarInner/>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:50,display:"flex"}}>
          <aside style={{width:220,background:NAVY,height:"100%",overflowY:"auto"}}>
            <SidebarInner/>
          </aside>
          <div style={{flex:1,background:"rgba(0,0,0,0.55)"}}
            onClick={()=>setMobileOpen(false)}/>
        </div>
      )}

      {/* Right side */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Top bar */}
        <header style={{background:TOP_BG,borderBottom:"1px solid #E2E8F0",
          padding:"0 32px",height:56,display:"flex",alignItems:"center",
          justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          {/* Mobile menu button */}
          <button onClick={()=>setMobileOpen(true)}
            className="smartetf-menu-btn"
            style={{background:"none",border:"none",cursor:"pointer",
              fontSize:20,color:"#374151",padding:0,marginRight:12}}>
            ☰
          </button>
          {/* Breadcrumb */}
          <div style={{fontSize:13,color:"#94A3B8",display:"flex",alignItems:"center",gap:6}}>
            <span style={{color:TEAL,fontWeight:600}}>SmartETF</span>
            <span>›</span>
            <span style={{color:"#475569",fontWeight:500}}>
              {NAV.find(n=>n.href===pathname)?.label??"Dashboard"}
            </span>
          </div>
          {/* Right actions */}
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <Link href="/settings" style={{padding:"6px 14px",fontSize:13,
              border:"1px solid #E2E8F0",borderRadius:7,textDecoration:"none",
              color:"#475569",background:"#fff"}}>
              Edit profile
            </Link>
            <Link href="/auth/logout" style={{padding:"6px 14px",fontSize:13,
              border:"1px solid #FECACA",borderRadius:7,textDecoration:"none",
              color:"#E24B4A",background:"#FEF2F2"}}>
              Sign out
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{flex:1,padding:"28px 32px",maxWidth:1100}}>
          {children}
        </main>
      </div>

      <style>{`
        @media(max-width:767px){
          .smartetf-sidebar{display:none!important}
          .smartetf-menu-btn{display:flex!important}
          main{padding:16px!important}
        }
        @media(min-width:768px){
          .smartetf-menu-btn{display:none!important}
        }
      `}</style>
    </div>
  );
}
