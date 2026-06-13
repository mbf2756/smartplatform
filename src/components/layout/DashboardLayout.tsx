"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { C } from "@/lib/styles";

const NAV = [
  { href:"/dashboard",  icon:"⊕", label:"Health score",      tier:"free" },
  { href:"/overlap",    icon:"⊗", label:"Overlap scanner",   tier:"free" },
  { href:"/exposure",   icon:"◎", label:"Exposure map",      tier:"free" },
  { href:"/optimiser",  icon:"↗", label:"Portfolio optimiser",tier:"sub"  },
  { href:"/sip",        icon:"⟳", label:"SIP coordinator",   tier:"sub"  },
  { href:"/scenarios",  icon:"◈", label:"What if scenarios",  tier:"sub"  },
  { href:"/settings",   icon:"⚙", label:"My portfolio",      tier:"free" },
];

interface Props {
  children: React.ReactNode;
  isSubscriber: boolean;
  userEmail?: string;
}

export default function DashboardLayout({ children, isSubscriber, userEmail }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Logo */}
      <div style={{padding:"24px 20px 20px",borderBottom:`1px solid rgba(255,255,255,0.07)`}}>
        <div style={{fontSize:20,fontWeight:700,color:"#fff",letterSpacing:"-0.02em"}}>
          Smart<span style={{color:C.teal}}>ETF</span>
        </div>
        <div style={{fontSize:11,color:C.sidebarText,marginTop:2}}>Portfolio intelligence</div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
        {/* Free tools */}
        <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
          color:"rgba(148,163,184,0.5)",padding:"8px 10px 4px"}}>
          Free tools
        </div>
        {NAV.filter(n=>n.tier==="free").map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"9px 12px", borderRadius:8, marginBottom:2,
                textDecoration:"none",
                background: active ? "rgba(29,158,117,0.15)" : "transparent",
                color: active ? C.teal : C.sidebarText,
                fontWeight: active ? 600 : 400,
                fontSize:14,
                transition:"background 0.1s, color 0.1s",
              }}>
              <span style={{fontSize:16,width:20,textAlign:"center"}}>{item.icon}</span>
              {item.label}
              {active && <span style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:C.teal}}/>}
            </Link>
          );
        })}

        {/* Subscriber tools */}
        <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
          color:"rgba(148,163,184,0.5)",padding:"16px 10px 4px"}}>
          Subscriber tools
        </div>
        {NAV.filter(n=>n.tier==="sub").map(item => {
          const active = pathname === item.href;
          const locked = !isSubscriber;
          return (
            <Link key={item.href} href={locked ? "/upgrade" : item.href}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"9px 12px", borderRadius:8, marginBottom:2,
                textDecoration:"none",
                background: active ? "rgba(29,158,117,0.15)" : "transparent",
                color: locked ? "rgba(148,163,184,0.4)" : active ? C.teal : C.sidebarText,
                fontWeight: active ? 600 : 400,
                fontSize:14,
                transition:"background 0.1s",
              }}>
              <span style={{fontSize:16,width:20,textAlign:"center"}}>{item.icon}</span>
              {item.label}
              {locked && <span style={{marginLeft:"auto",fontSize:11,color:"rgba(148,163,184,0.4)"}}>🔒</span>}
              {active && !locked && <span style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:C.teal}}/>}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade prompt */}
      {!isSubscriber && (
        <div style={{margin:"0 10px 12px",padding:"14px 16px",background:"rgba(29,158,117,0.12)",
          borderRadius:10,border:`1px solid rgba(29,158,117,0.25)`}}>
          <div style={{fontSize:13,fontWeight:600,color:C.teal,marginBottom:4}}>Unlock all tools</div>
          <div style={{fontSize:12,color:C.sidebarText,lineHeight:1.5,marginBottom:10}}>
            Optimiser, SIP coordinator, and scenario modelling from $19/mo
          </div>
          <Link href="/upgrade" style={{
            display:"block",textAlign:"center",padding:"8px",
            background:C.teal,color:"#fff",borderRadius:6,
            fontSize:13,fontWeight:600,textDecoration:"none"}}>
            Upgrade now
          </Link>
        </div>
      )}

      {/* User */}
      <div style={{padding:"12px 20px",borderTop:`1px solid rgba(255,255,255,0.07)`,
        display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:C.teal,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>
          {userEmail?.[0]?.toUpperCase() ?? "U"}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,color:"#fff",fontWeight:500,
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {userEmail ?? "My account"}
          </div>
          <div style={{fontSize:11,color:C.sidebarText}}>
            {isSubscriber ? "Pro subscriber" : "Free plan"}
          </div>
        </div>
        <Link href="/auth/logout" style={{fontSize:18,color:C.sidebarText,textDecoration:"none"}}>↩</Link>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#F7F8FA",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"}}>
      {/* Desktop sidebar */}
      <div style={{
        width:240,flexShrink:0,background:C.sidebarBg,
        position:"sticky",top:0,height:"100vh",overflowY:"auto",
        display:"none",
        ["@media(min-width:768px)" as any]:{}
      }} className="sidebar-desktop">
        <SidebarContent/>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{position:"fixed",inset:0,zIndex:50,display:"flex"}}>
          <div style={{width:240,background:C.sidebarBg,height:"100%",overflowY:"auto"}}>
            <SidebarContent/>
          </div>
          <div style={{flex:1,background:"rgba(0,0,0,0.5)"}} onClick={()=>setMobileOpen(false)}/>
        </div>
      )}

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Mobile topbar */}
        <div style={{
          background:"#fff",borderBottom:`1px solid #E5E7EB`,
          padding:"12px 16px",display:"flex",alignItems:"center",gap:12,
          position:"sticky",top:0,zIndex:10,
        }} className="mobile-topbar">
          <button onClick={()=>setMobileOpen(true)}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#374151",padding:0}}>
            ☰
          </button>
          <div style={{fontSize:18,fontWeight:700,color:"#111"}}>
            Smart<span style={{color:C.teal}}>ETF</span>
          </div>
          {!isSubscriber && (
            <Link href="/upgrade" style={{
              marginLeft:"auto",padding:"6px 14px",background:C.teal,
              color:"#fff",borderRadius:6,fontSize:13,fontWeight:600,textDecoration:"none"}}>
              Upgrade
            </Link>
          )}
        </div>

        {/* Page content */}
        <main style={{flex:1,padding:"28px 32px",maxWidth:900}}>
          {children}
        </main>
      </div>

      <style>{`
        @media(min-width:768px){
          .sidebar-desktop{display:block!important}
          .mobile-topbar{display:none!important}
        }
        @media(max-width:767px){
          main{padding:20px 16px!important}
        }
      `}</style>
    </div>
  );
}
