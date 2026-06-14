import React from "react";
import Link from "next/link";

export const metadata = {
  title: "SmartETF AU — Know exactly what your ETF portfolio is doing",
  description: "Free portfolio health score, overlap scanner, and fee analysis for Australian ETF investors. Trusted by thousands of DIY investors.",
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = "#1D9E75";      // teal brand
const TD = "#0F6E56";     // teal dark
const TL = "#E1F5EE";     // teal light
const DARK = "#0A0F1E";   // near-black hero bg
const DARK2 = "#111827";  // section dark
const INDIGO = "#1E1B4B"; // indigo accent
const GY = "#F8FAFC";     // light grey
const BR = "#E2E8F0";

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#1D9E75" fillOpacity=".15"/>
    <path d="M5 8l2.5 2.5L11 5.5" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Homepage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      background:"#fff",color:"#0F172A",overflowX:"hidden"}}>

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:50,
        background:"rgba(10,15,30,0.92)",backdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{maxWidth:1120,margin:"0 auto",padding:"0 32px",
          height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",color:"#fff"}}>
            Smart<span style={{color:T}}>ETF</span>
            <span style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",
              marginLeft:6,background:"rgba(255,255,255,0.08)",padding:"2px 7px",
              borderRadius:4,letterSpacing:".05em"}}>AU</span>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <Link href="/auth/login"
              style={{padding:"8px 18px",fontSize:14,color:"rgba(255,255,255,0.7)",
                textDecoration:"none",borderRadius:8,fontWeight:500}}>
              Sign in
            </Link>
            <Link href="/pricing"
              style={{padding:"8px 18px",fontSize:14,color:"rgba(255,255,255,0.7)",
                textDecoration:"none",borderRadius:8,fontWeight:500}}>
              Pricing
            </Link>
            <Link href="/auth/signup"
              style={{padding:"9px 22px",fontSize:14,fontWeight:700,
                color:"#fff",background:T,textDecoration:"none",borderRadius:8}}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{background:`linear-gradient(160deg, ${DARK} 0%, #0F172A 50%, #0F2318 100%)`,
        minHeight:"100vh",display:"flex",alignItems:"center",paddingTop:60,position:"relative",
        overflow:"hidden"}}>

        {/* Background glow */}
        <div style={{position:"absolute",top:"-20%",right:"-10%",width:600,height:600,
          background:"radial-gradient(circle, rgba(29,158,117,0.12) 0%, transparent 70%)",
          pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-10%",left:"-5%",width:400,height:400,
          background:"radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          pointerEvents:"none"}}/>

        <div style={{maxWidth:1120,margin:"0 auto",padding:"80px 32px",
          display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center",
          width:"100%",boxSizing:"border-box" as const}}>

          {/* Left */}
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,
              padding:"6px 14px",borderRadius:20,
              background:"rgba(29,158,117,0.12)",border:"1px solid rgba(29,158,117,0.25)",
              marginBottom:24}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:T}}/>
              <span style={{fontSize:12,fontWeight:600,color:T,letterSpacing:".05em"}}>
                FREE PORTFOLIO HEALTH SCORE
              </span>
            </div>

            <h1 style={{fontSize:58,fontWeight:800,lineHeight:1.08,
              letterSpacing:"-0.04em",color:"#fff",margin:"0 0 24px"}}>
              Know exactly what your ETF portfolio is{" "}
              <span style={{color:T,fontStyle:"italic"}}>really</span>{" "}doing.
            </h1>

            <p style={{fontSize:19,color:"rgba(255,255,255,0.6)",lineHeight:1.65,
              margin:"0 0 36px",maxWidth:480}}>
              Most Australians hold ETFs that duplicate each other — paying double
              fees for the same exposure. Find out in 2 minutes, free.
            </p>

            <div style={{display:"flex",gap:12,flexWrap:"wrap" as const,marginBottom:28}}>
              <Link href="/auth/signup"
                style={{padding:"15px 32px",fontSize:16,fontWeight:700,
                  color:"#fff",background:T,textDecoration:"none",borderRadius:10,
                  display:"inline-flex",alignItems:"center",gap:8,
                  boxShadow:"0 4px 24px rgba(29,158,117,0.35)"}}>
                Analyse my portfolio free →
              </Link>
              <Link href="/auth/login"
                style={{padding:"15px 24px",fontSize:15,fontWeight:500,
                  color:"rgba(255,255,255,0.8)",border:"1px solid rgba(255,255,255,0.15)",
                  textDecoration:"none",borderRadius:10,display:"inline-flex",
                  alignItems:"center",gap:8,background:"rgba(255,255,255,0.05)"}}>
                Sign in
              </Link>
            </div>

            <div style={{display:"flex",gap:20,flexWrap:"wrap" as const}}>
              {[
                "No credit card required",
                "Free health score in 2 min",
                "20+ ASX ETFs in database",
              ].map(t=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:7}}>
                  <IconCheck/>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — score card preview */}
          <div style={{position:"relative"}}>
            {/* Main card */}
            <div style={{background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:20,padding:"28px 28px 24px",backdropFilter:"blur(8px)"}}>

              {/* Score ring mock */}
              <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <svg width={90} height={90}>
                    <circle cx={45} cy={45} r={38} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8}/>
                    <circle cx={45} cy={45} r={38} fill="none" stroke={T} strokeWidth={8}
                      strokeDasharray={`${2*Math.PI*38*0.72} ${2*Math.PI*38*0.28}`}
                      strokeLinecap="round" transform="rotate(-90 45 45)"/>
                    <text x={45} y={45} textAnchor="middle" dominantBaseline="middle"
                      fill={T} fontSize={22} fontWeight={800}>72</text>
                  </svg>
                </div>
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",
                    letterSpacing:".08em",textTransform:"uppercase",marginBottom:4}}>
                    Portfolio health score
                  </div>
                  <div style={{fontSize:20,fontWeight:700,color:"#fff",marginBottom:2}}>
                    Good — 2 issues found
                  </div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.45)"}}>
                    VGS + BGBL · 83% overlap detected
                  </div>
                </div>
              </div>

              {/* Issue highlight */}
              <div style={{background:"rgba(239,159,39,0.1)",border:"1px solid rgba(239,159,39,0.25)",
                borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#EF9F27",marginBottom:3}}>
                  ⚠ High overlap — VGS & BGBL
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>
                  83% of holdings duplicated. You're paying 2× MER for the same Apple, Microsoft, and NVIDIA exposure.
                </div>
              </div>

              {/* Stats row */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[
                  {v:"0.18%",l:"Blended MER",warn:true},
                  {v:"$1,240",l:"Annual fees",warn:true},
                  {v:"$8,400",l:"10yr fee drag",warn:true},
                ].map(({v,l,warn})=>(
                  <div key={l} style={{background:"rgba(255,255,255,0.04)",
                    borderRadius:8,padding:"10px 12px",textAlign:"center" as const}}>
                    <div style={{fontSize:15,fontWeight:700,color:warn?"#EF9F27":"#fff"}}>{v}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div style={{position:"absolute",top:-16,right:-16,
              background:T,borderRadius:12,padding:"10px 16px",
              boxShadow:"0 8px 24px rgba(29,158,117,0.4)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#fff",letterSpacing:".05em"}}>FREE TOOL</div>
              <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>2 min</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",
          textAlign:"center" as const}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.25)",marginBottom:6}}>Scroll to explore</div>
          <div style={{width:1,height:32,background:"linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
            margin:"0 auto"}}/>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────────── */}
      <section style={{background:INDIGO,padding:"28px 32px"}}>
        <div style={{maxWidth:1120,margin:"0 auto",
          display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0}}>
          {[
            {n:"1.8M",l:"Australians hold ETFs"},
            {n:"82%",  l:"Have hidden overlap they don't know about"},
            {n:"$4,200",l:"Average 10yr fee drag from duplicate ETFs"},
            {n:"15 min",l:"Time to fix it with SmartETF"},
          ].map(({n,l},i)=>(
            <div key={l} style={{textAlign:"center" as const,
              padding:"0 24px",
              borderRight:i<3?"1px solid rgba(255,255,255,0.1)":"none"}}>
              <div style={{fontSize:36,fontWeight:800,color:"#fff",
                letterSpacing:"-0.03em",lineHeight:1}}>{n}</div>
              <div style={{fontSize:13,color:"rgba(165,180,252,0.7)",marginTop:6,lineHeight:1.4}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────────── */}
      <section style={{padding:"96px 32px",background:GY}}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>
          <div style={{textAlign:"center" as const,marginBottom:64}}>
            <div style={{fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
              color:T,marginBottom:12}}>What SmartETF does</div>
            <h2 style={{fontSize:44,fontWeight:800,letterSpacing:"-0.03em",
              color:"#0F172A",margin:"0 0 16px",lineHeight:1.1}}>
              Built for serious DIY investors
            </h2>
            <p style={{fontSize:18,color:"#64748B",margin:0}}>
              No other Australian tool gives you this level of insight into your ETF portfolio.
            </p>
          </div>

          {/* Feature grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:16}}>
            {[
              {icon:"⊗",title:"Overlap X-ray",tier:"Free",
               desc:"Company-level duplicate detection across every ETF and your super fund. See if VGS + BGBL costs you double fees for identical exposure.",
               color:"#1D9E75"},
              {icon:"⊕",title:"Health score",tier:"Free",
               desc:"A single 0–100 score combining overlap efficiency, fee drag, diversification, super alignment, and age-appropriate risk.",
               color:"#3B82F6"},
              {icon:"◎",title:"Exposure map",tier:"Free",
               desc:"Your consolidated geographic, sector, and factor breakdown — not per fund, but your whole portfolio combined including super.",
               color:"#7F77DD"},
            ].map(f=>(
              <div key={f.title} style={{background:"#fff",borderRadius:14,padding:"28px 24px",
                border:"1px solid #E2E8F0",position:"relative" as const}}>
                <div style={{width:44,height:44,borderRadius:12,marginBottom:16,
                  background:`${f.color}12`,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:22}}>{f.icon}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#0F172A"}}>{f.title}</div>
                  <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4,
                    background:"#DCFCE7",color:"#166534"}}>{f.tier}</span>
                </div>
                <p style={{fontSize:14,color:"#64748B",lineHeight:1.65,margin:0}}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
            {[
              {icon:"↗",title:"Portfolio optimiser",tier:"Pro",
               desc:"Choose a goal — minimise fees, maximise growth, minimise risk, or FIRE — and get a complete ETF mix with exact dollar buy/sell amounts.",
               color:"#D85A30"},
              {icon:"📖",title:"Monthly buy planner",tier:"Pro",
               desc:"Tell SmartETF your monthly investment amount. It tells you exactly which ETF to buy each month to stay on target without selling.",
               color:"#BA7517"},
              {icon:"⊞",title:"Model portfolios",tier:"Pro",
               desc:"15 model ETF portfolios and 45 curated shares across growth, balanced, and income — reviewed and updated monthly.",
               color:"#1E1B4B"},
            ].map(f=>(
              <div key={f.title} style={{background:"#fff",borderRadius:14,padding:"28px 24px",
                border:"1px solid #E2E8F0",position:"relative" as const}}>
                <div style={{width:44,height:44,borderRadius:12,marginBottom:16,
                  background:`${f.color}12`,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:22}}>{f.icon}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#0F172A"}}>{f.title}</div>
                  <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4,
                    background:"#EFF6FF",color:"#1E40AF"}}>{f.tier}</span>
                </div>
                <p style={{fontSize:14,color:"#64748B",lineHeight:1.65,margin:0}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section style={{padding:"96px 32px",background:"#fff"}}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>
          <div style={{textAlign:"center" as const,marginBottom:64}}>
            <div style={{fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
              color:T,marginBottom:12}}>Simple to start</div>
            <h2 style={{fontSize:44,fontWeight:800,letterSpacing:"-0.03em",
              color:"#0F172A",margin:0,lineHeight:1.1}}>
              Up and running in 5 minutes
            </h2>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:0}}>
            {[
              {n:"01",title:"Create free account",
               desc:"Email and password. No credit card. No bank connection needed.",icon:"📧"},
              {n:"02",title:"Add your ETFs",
               desc:"Enter your ticker symbols and balances. Takes about 2 minutes.",icon:"📊"},
              {n:"03",title:"Get your health score",
               desc:"Instantly see your overlap, fees, and diversification gaps.",icon:"⊕"},
              {n:"04",title:"Take action",
               desc:"Follow the optimiser's exact buy/sell plan to fix what's wrong.",icon:"✅"},
            ].map(({n,title,desc,icon},i)=>(
              <div key={n} style={{padding:"0 32px",
                borderRight:i<3?"1px solid #E2E8F0":"none",
                borderLeft:i>0?"none":"none"}}>
                <div style={{fontSize:11,fontWeight:700,color:T,letterSpacing:".1em",
                  marginBottom:14}}>{n}</div>
                <div style={{fontSize:28,marginBottom:12}}>{icon}</div>
                <div style={{fontSize:16,fontWeight:700,color:"#0F172A",marginBottom:8}}>
                  {title}
                </div>
                <p style={{fontSize:14,color:"#64748B",lineHeight:1.65,margin:0}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────────────────── */}
      <section style={{padding:"96px 32px",background:GY}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{textAlign:"center" as const,marginBottom:48}}>
            <div style={{fontSize:12,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
              color:T,marginBottom:12}}>Why SmartETF</div>
            <h2 style={{fontSize:44,fontWeight:800,letterSpacing:"-0.03em",
              color:"#0F172A",margin:0,lineHeight:1.1}}>
              What you actually get
            </h2>
          </div>

          <div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",overflow:"hidden"}}>
            {/* Header */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 120px 120px",
              background:"#F8FAFC",borderBottom:"1px solid #E2E8F0",padding:"12px 24px"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#94A3B8"}}>Feature</div>
              <div style={{fontSize:12,fontWeight:600,color:"#94A3B8",textAlign:"center" as const}}>Free</div>
              <div style={{fontSize:12,fontWeight:700,color:T,textAlign:"center" as const}}>Pro $19/mo</div>
            </div>
            {[
              {f:"Portfolio health score (0–100)",free:true,pro:true},
              {f:"Overlap scanner — company level",free:true,pro:true},
              {f:"Exposure map — geo, sector, factor",free:true,pro:true},
              {f:"Build your portfolio guide",free:true,pro:true},
              {f:"Portfolio optimiser — 6 goals",free:false,pro:true},
              {f:"Monthly buy planner (DCA)",free:false,pro:true},
              {f:"What if scenarios",free:false,pro:true},
              {f:"15 model ETF portfolios",free:false,pro:true},
              {f:"45 curated model shares",free:false,pro:true},
              {f:"Fee drag calculator",free:false,pro:true},
            ].map(({f,free,pro},i)=>(
              <div key={f} style={{display:"grid",gridTemplateColumns:"1fr 120px 120px",
                padding:"14px 24px",
                borderBottom:i<9?"1px solid #F1F5F9":"none",
                background:i%2===0?"#fff":"#FAFBFC"}}>
                <div style={{fontSize:14,color:"#475569"}}>{f}</div>
                <div style={{textAlign:"center" as const,fontSize:16}}>
                  {free?"✓":"—"}
                  {free && <span style={{display:"none"}}/>}
                </div>
                <div style={{textAlign:"center" as const,fontSize:16,color:T,fontWeight:600}}>✓</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SMARTSUPER CROSSLINK ──────────────────────────────────────────────── */}
      <section style={{padding:"64px 32px",background:GY}}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>
          <div style={{background:`linear-gradient(135deg, ${INDIGO} 0%, #2D2A6E 100%)`,
            borderRadius:20,padding:"48px 56px",
            display:"grid",gridTemplateColumns:"1fr auto",gap:40,alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
                color:"#A5B4FC",marginBottom:12}}>
                Part of the SuperSmart AU ecosystem
              </div>
              <h3 style={{fontSize:32,fontWeight:800,color:"#fff",margin:"0 0 12px",
                letterSpacing:"-0.02em",lineHeight:1.2}}>
                Already have a SmartSuper account?
              </h3>
              <p style={{fontSize:16,color:"rgba(165,180,252,0.75)",margin:"0 0 20px",
                lineHeight:1.65,maxWidth:500}}>
                Your SmartETF account uses the same login. Sign in once, access both platforms.
                The Bundle plan ($49/mo) covers SmartETF Premium + SmartSuper full access.
              </p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap" as const}}>
                <Link href="/auth/login"
                  style={{padding:"11px 24px",fontSize:14,fontWeight:700,
                    background:"#7C3AED",color:"#fff",borderRadius:9,
                    textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>
                  <div style={{width:18,height:18,borderRadius:4,background:"rgba(255,255,255,0.2)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:9,fontWeight:800}}>S</div>
                  Go to SmartSuper AU ↗
                </Link>
                <Link href="/auth/signup?plan=bundle"
                  style={{padding:"11px 24px",fontSize:14,fontWeight:600,
                    background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.8)",
                    border:"1px solid rgba(255,255,255,0.15)",
                    borderRadius:9,textDecoration:"none"}}>
                  View Bundle plan
                </Link>
              </div>
            </div>
            <div style={{textAlign:"center" as const,flexShrink:0}}>
              <div style={{fontSize:48,marginBottom:4}}>🔗</div>
              <div style={{fontSize:13,fontWeight:600,color:"#A5B4FC"}}>Same login</div>
              <div style={{fontSize:12,color:"rgba(165,180,252,0.5)"}}>across both platforms</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer style={{background:DARK2,padding:"40px 32px"}}>
        <div style={{maxWidth:1120,margin:"0 auto",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          flexWrap:"wrap" as const,gap:16}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:4,
              letterSpacing:"-0.02em"}}>
              Smart<span style={{color:T}}>ETF</span>
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>
              © 2025 SmartETF · by SuperSmart AU · smartetfau.com
            </div>
          </div>
          <div style={{display:"flex",gap:24}}>
            {[
              {l:"Health score",h:"/dashboard"},
              {l:"Model portfolios",h:"/portfolios"},
              {l:"Build your portfolio",h:"/guide"},
              {l:"Pricing",h:"/auth/signup"},
              {l:"SmartSuper AU",h:"https://smartsuperau.com"},
            ].map(({l,h})=>(
              <Link key={l} href={h}
                style={{fontSize:13,color:"rgba(255,255,255,0.4)",textDecoration:"none",
                  fontWeight:500}}>{l}</Link>
            ))}
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",maxWidth:380,
            textAlign:"right" as const,lineHeight:1.5}}>
            General information only. Not financial advice. Always consult a licensed financial adviser.
          </div>
        </div>
      </footer>

      {/* Responsive */}
      <style>{`
        @media(max-width:768px){
          section > div { grid-template-columns: 1fr !important; }
          h1 { font-size: 38px !important; }
          h2 { font-size: 30px !important; }
        }
      `}</style>
    </div>
  );
}
