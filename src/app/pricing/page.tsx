import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Pricing — SmartETF AU",
  description: "Start free. Upgrade when ready. No lock-in, cancel any time.",
};

const T = "#1D9E75";
const DARK = "#0A0F1E";
const GY = "#F8FAFC";
const BR = "#E2E8F0";

export default function PricingPage() {
  const plans = [
    {
      name:"Free", price:"$0", period:"forever",
      desc:"Get your health score, overlap scan, and exposure map. No credit card needed.",
      features:[
        "Portfolio health score (0–100)",
        "Overlap scanner — company level",
        "Exposure map — geo, sector, factor",
        "Build your portfolio guide",
        "My portfolio tracker",
      ],
      cta:"Start free", href:"/auth/signup", highlight:false,
    },
    {
      name:"Pro", price:"$19", period:"/month",
      desc:"Full analysis suite for serious DIY investors.",
      features:[
        "Everything in Free",
        "Portfolio optimiser — 6 goals",
        "Monthly buy planner (DCA)",
        "What if scenarios",
        "15 model ETF portfolios (updated monthly)",
        "45 curated model shares",
        "Fee drag calculator",
      ],
      cta:"Start Pro", href:"/auth/signup?plan=pro", highlight:true,
    },
    {
      name:"Premium", price:"$35", period:"/month",
      desc:"Pro plus tax-effective features and super alignment.",
      features:[
        "Everything in Pro",
        "CGT harvest alerts",
        "Franking credit analysis",
        "Super alignment tools",
        "Advanced exposure breakdown",
      ],
      cta:"Start Premium", href:"/auth/signup?plan=premium", highlight:false,
    },
    {
      name:"Bundle", price:"$49", period:"/month",
      desc:"SmartETF Premium + SmartSuper AU full access — one login.",
      features:[
        "SmartETF Premium (all tools)",
        "SmartSuper AU full access",
        "One login across both platforms",
        "Priority support",
      ],
      cta:"Get Bundle", href:"/auth/signup?plan=bundle", highlight:false,
    },
  ];

  const comparison = [
    {f:"Portfolio health score",         free:true,  pro:true},
    {f:"Overlap scanner",                free:true,  pro:true},
    {f:"Exposure map",                   free:true,  pro:true},
    {f:"Build your portfolio guide",     free:true,  pro:true},
    {f:"Portfolio optimiser (6 goals)",  free:false, pro:true},
    {f:"Monthly buy planner (DCA)",      free:false, pro:true},
    {f:"What if scenarios",              free:false, pro:true},
    {f:"15 model ETF portfolios",        free:false, pro:true},
    {f:"45 curated model shares",        free:false, pro:true},
    {f:"CGT harvest alerts",             free:false, pro:false, premium:true},
    {f:"Franking credit analysis",       free:false, pro:false, premium:true},
    {f:"SmartSuper AU access",           free:false, pro:false, premium:false, bundle:true},
  ];

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      background:GY,color:"#0F172A",minHeight:"100vh"}}>

      {/* Nav */}
      <nav style={{background:DARK,borderBottom:"1px solid rgba(255,255,255,0.07)",
        position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:1120,margin:"0 auto",padding:"0 32px",height:60,
          display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link href="/" style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",
            color:"#fff",textDecoration:"none"}}>
            Smart<span style={{color:T}}>ETF</span>
          </Link>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <Link href="/auth/login" style={{padding:"8px 18px",fontSize:14,fontWeight:500,
              color:"rgba(255,255,255,0.7)",textDecoration:"none",borderRadius:8}}>
              Sign in
            </Link>
            <Link href="/auth/signup" style={{padding:"9px 22px",fontSize:14,fontWeight:700,
              color:"#fff",background:T,textDecoration:"none",borderRadius:8}}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{background:DARK,padding:"64px 32px 72px",textAlign:"center"}}>
        <div style={{fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
          color:T,marginBottom:12}}>Pricing</div>
        <h1 style={{fontSize:48,fontWeight:800,letterSpacing:"-0.04em",color:"#fff",
          margin:"0 0 14px",lineHeight:1.1}}>
          Start free. Upgrade when you're ready.
        </h1>
        <p style={{fontSize:18,color:"rgba(255,255,255,0.55)",margin:0,lineHeight:1.6}}>
          No lock-in contracts. Cancel any time. Every plan includes the free tools.
        </p>
      </div>

      {/* Plan cards */}
      <div style={{maxWidth:1120,margin:"-36px auto 0",padding:"0 32px 64px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {plans.map(p=>(
            <div key={p.name} style={{
              background:p.highlight?DARK:"#fff",
              border:p.highlight?`2px solid ${T}`:"1px solid ${BR}",
              borderRadius:14,padding:"28px 22px",
              position:"relative",
              boxShadow:p.highlight?"0 12px 40px rgba(0,0,0,0.2)":"0 1px 3px rgba(0,0,0,0.06)",
            }}>
              {p.highlight&&(
                <div style={{position:"absolute",top:-13,left:"50%",
                  transform:"translateX(-50%)",
                  background:T,color:"#fff",fontSize:11,fontWeight:700,
                  padding:"3px 14px",borderRadius:20,whiteSpace:"nowrap",
                  letterSpacing:".05em"}}>MOST POPULAR</div>
              )}
              <div style={{fontSize:13,fontWeight:600,marginBottom:4,
                color:p.highlight?"rgba(255,255,255,0.5)":"#64748B"}}>{p.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:3,marginBottom:8}}>
                <span style={{fontSize:38,fontWeight:800,letterSpacing:"-0.03em",
                  color:p.highlight?"#fff":"#0F172A"}}>{p.price}</span>
                <span style={{fontSize:14,color:p.highlight?"rgba(255,255,255,0.4)":"#94A3B8"}}>
                  {p.period}
                </span>
              </div>
              <p style={{fontSize:13,color:p.highlight?"rgba(255,255,255,0.5)":"#64748B",
                marginBottom:20,lineHeight:1.55,minHeight:52}}>{p.desc}</p>
              <Link href={p.href} style={{
                display:"block",textAlign:"center",padding:"11px 0",
                fontSize:14,fontWeight:700,borderRadius:9,textDecoration:"none",
                background:p.highlight?T:"transparent",
                color:p.highlight?"#fff":"#0F172A",
                border:p.highlight?"none":"1.5px solid #CBD5E1",
                marginBottom:22}}>
                {p.cta}
              </Link>
              {p.features.map(f=>(
                <div key={f} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                  <span style={{color:T,flexShrink:0,marginTop:1}}>✓</span>
                  <span style={{fontSize:13,
                    color:p.highlight?"rgba(255,255,255,0.65)":"#475569",
                    lineHeight:1.4}}>{f}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div style={{marginTop:64}}>
          <h2 style={{fontSize:28,fontWeight:700,color:"#0F172A",
            textAlign:"center",marginBottom:32,letterSpacing:"-0.02em"}}>
            Full feature comparison
          </h2>
          <div style={{background:"#fff",borderRadius:14,border:`1px solid ${BR}`,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 90px 90px 90px 90px",
              background:"#F8FAFC",borderBottom:`1px solid ${BR}`,padding:"12px 24px",gap:8}}>
              {["Feature","Free","Pro","Premium","Bundle"].map((h,i)=>(
                <div key={h} style={{fontSize:12,fontWeight:700,
                  color:i===0?"#64748B":i===2?T:"#64748B",
                  textAlign:i===0?"left":"center"}}>
                  {h}
                </div>
              ))}
            </div>
            {comparison.map(({f,free,pro,premium,bundle},i)=>(
              <div key={f} style={{display:"grid",
                gridTemplateColumns:"1fr 90px 90px 90px 90px",
                padding:"12px 24px",gap:8,
                borderBottom:i<comparison.length-1?`1px solid #F1F5F9`:"none",
                background:i%2===0?"#fff":"#FAFBFC"}}>
                <div style={{fontSize:13,color:"#475569"}}>{f}</div>
                {[free, pro, premium??pro, bundle??premium??pro].map((v,j)=>(
                  <div key={j} style={{textAlign:"center",
                    fontSize:v?16:14,
                    color:v?T:"#CBD5E1",fontWeight:v?600:400}}>
                    {v?"✓":"—"}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ strip */}
        <div style={{marginTop:48,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {[
            {q:"Can I cancel anytime?",
             a:"Yes — cancel from your account settings at any time. No questions asked, no lock-in period."},
            {q:"Is my data safe?",
             a:"All data is stored in Supabase (Sydney region, ISO 27001). We never connect to your bank or broker."},
            {q:"Does the Bundle include SmartSuper?",
             a:"Yes. The $49/mo Bundle covers SmartETF Premium and full SmartSuper AU access under the same login."},
          ].map(({q,a})=>(
            <div key={q} style={{background:"#fff",borderRadius:12,padding:"20px",
              border:`1px solid ${BR}`}}>
              <div style={{fontSize:14,fontWeight:700,color:"#0F172A",marginBottom:8}}>{q}</div>
              <div style={{fontSize:13,color:"#64748B",lineHeight:1.6}}>{a}</div>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div style={{textAlign:"center",marginTop:40}}>
          <Link href="/" style={{fontSize:14,color:"#94A3B8",textDecoration:"none",
            fontWeight:500}}>← Back to SmartETF</Link>
        </div>
      </div>
    </div>
  );
}
