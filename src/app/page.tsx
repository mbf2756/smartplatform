import React from "react";
import Link from "next/link";
import { C } from "@/lib/styles";

export const metadata = {
  title:"SmartETF — Australian ETF Portfolio Analyser",
  description:"Scan your ETF portfolio for overlap, fee drag, and diversification gaps. Free portfolio health score in 2 minutes.",
};

export default function HomePage() {
  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      background:"#fff",minHeight:"100vh",color:C.gray900}}>

      {/* Nav */}
      <nav style={{borderBottom:`1px solid ${C.gray100}`,padding:"0 40px",
        display:"flex",alignItems:"center",height:64,maxWidth:1100,margin:"0 auto",position:"sticky",top:0,background:"#fff",zIndex:20}}>
        <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",flex:1}}>
          Smart<span style={{color:C.teal}}>ETF</span>
          <span style={{fontSize:12,fontWeight:500,color:C.gray400,marginLeft:6,
            background:C.gray100,padding:"2px 7px",borderRadius:4}}>AU</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Link href="/auth/login" style={{padding:"8px 16px",fontSize:14,color:C.gray600,
            textDecoration:"none",borderRadius:7}}>Sign in</Link>
          <Link href="/auth/signup" style={{padding:"9px 20px",fontSize:14,fontWeight:600,
            color:"#fff",background:C.teal,textDecoration:"none",borderRadius:8}}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"72px 40px 60px"}}>
        <div style={{maxWidth:640}}>
          <div style={{fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
            color:C.teal,marginBottom:16}}>SmartETF · by SuperSmart AU</div>
          <h1 style={{fontSize:52,fontWeight:800,lineHeight:1.1,letterSpacing:"-0.03em",
            margin:"0 0 20px",color:C.gray900}}>
            See what your ETF portfolio is{" "}
            <em style={{fontStyle:"italic",color:C.teal}}>really</em> doing
          </h1>
          <p style={{fontSize:20,color:C.gray500,lineHeight:1.65,margin:"0 0 32px",maxWidth:520}}>
            Most Australians hold ETFs that duplicate each other — paying double fees for the same
            exposure. Get your free Portfolio Health Score in 2 minutes.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
            <Link href="/auth/signup" style={{padding:"14px 28px",fontSize:16,fontWeight:700,
              color:"#fff",background:C.teal,textDecoration:"none",borderRadius:10,
              display:"inline-block"}}>
              Analyse my portfolio — free →
            </Link>
            <Link href="/auth/login" style={{padding:"14px 24px",fontSize:15,fontWeight:500,
              color:C.gray700,border:`1px solid ${C.gray300}`,textDecoration:"none",
              borderRadius:10,display:"inline-block"}}>
              Sign in
            </Link>
          </div>
          <p style={{fontSize:13,color:C.gray400,marginTop:14}}>
            No account required for health score · Full analysis from $19/mo
          </p>
        </div>

        {/* Stats row */}
        <div style={{display:"flex",gap:32,marginTop:56,flexWrap:"wrap"}}>
          {[["1.8M","Australians hold ETFs"],["82%","have hidden overlap"],
            ["$4,200","avg 10yr fee drag"],["20+","ASX ETFs in database"]].map(([v,l]) => (
            <div key={l}>
              <div style={{fontSize:32,fontWeight:800,color:C.gray900,letterSpacing:"-0.02em"}}>{v}</div>
              <div style={{fontSize:13,color:C.gray400,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* The insight */}
      <section style={{background:C.gray50,borderTop:`1px solid ${C.gray100}`,
        borderBottom:`1px solid ${C.gray100}`,padding:"48px 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <blockquote style={{fontSize:22,fontWeight:500,color:C.gray800,lineHeight:1.6,
            maxWidth:760,margin:0,borderLeft:`4px solid ${C.teal}`,paddingLeft:24}}>
            "I hold VGS, BGBL, and NDQ.{" "}
            <span style={{color:C.red,fontWeight:700}}>83% of my global allocation is duplicated</span>
            {" "}across two funds — paying two MERs for the same Apple and Microsoft stock."
          </blockquote>
          <p style={{fontSize:14,color:C.gray400,marginTop:12,paddingLeft:28}}>
            The r/AusFinance realisation SmartETF surfaces in 60 seconds.
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"64px 40px"}}>
        <div style={{fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
          color:C.gray400,marginBottom:8}}>What no other AU tool does</div>
        <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-0.02em",
          color:C.gray900,margin:"0 0 48px"}}>Built for serious DIY investors</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          {[
            {icon:"⊗",title:"Overlap X-ray",tier:"Free",
              desc:"Company-level duplicate detection across every ETF and your super fund. See if VGS + BGBL costs you double fees for identical exposure."},
            {icon:"◎",title:"True exposure map",tier:"Free",
              desc:"Consolidated geographic, sector, and factor breakdown for your whole portfolio — not per-fund, but combined including super."},
            {icon:"⊕",title:"Portfolio health score",tier:"Free",
              desc:"A single 0–100 score combining overlap efficiency, fee drag, diversification, super alignment, and age-appropriate risk."},
            {icon:"↗",title:"Portfolio optimiser",tier:"Subscriber",
              desc:"Choose a goal — minimise fees, maximise growth, or FIRE — and get a complete ETF mix with exact dollar buy/sell amounts."},
            {icon:"⟳",title:"SIP coordinator",tier:"Subscriber",
              desc:"Tell SmartETF your monthly DCA amount. It tells you exactly which ETF to buy each month to stay on target without selling."},
            {icon:"◈",title:"What if scenarios",tier:"Subscriber",
              desc:"Model four goal-based portfolios — FIRE at 50, retire at 60, aggressive growth, balanced — with projected balances and a rebalance calculator."},
          ].map(f => (
            <div key={f.title} style={{border:`1px solid ${C.gray200}`,borderRadius:12,padding:"24px",
              background:"#fff",position:"relative"}}>
              <div style={{fontSize:28,marginBottom:14}}>{f.icon}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{fontSize:16,fontWeight:700,color:C.gray900}}>{f.title}</div>
                <span style={{fontSize:11,fontWeight:600,padding:"2px 7px",borderRadius:4,
                  background:f.tier==="Free"?C.greenLight:C.blueLight,
                  color:f.tier==="Free"?C.greenDark:C.blueDark}}>
                  {f.tier}
                </span>
              </div>
              <p style={{fontSize:14,color:C.gray500,lineHeight:1.65,margin:0}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{background:C.gray50,borderTop:`1px solid ${C.gray100}`,
        borderBottom:`1px solid ${C.gray100}`,padding:"64px 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
            color:C.gray400,marginBottom:8}}>Pricing</div>
          <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-0.02em",color:C.gray900,
            margin:"0 0 40px"}}>Start free, upgrade when ready</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
            {[
              {name:"Free",price:"$0",desc:"Health score, overlap scan, exposure map",
               cta:"Start free",href:"/auth/signup",highlight:false},
              {name:"Pro",price:"$19/mo",desc:"Full analysis + optimiser + SIP coordinator",
               cta:"Start Pro",href:"/auth/signup?plan=pro",highlight:true},
              {name:"Premium",price:"$35/mo",desc:"Pro + CGT tracking + franking credits + super alignment",
               cta:"Start Premium",href:"/auth/signup?plan=premium",highlight:false},
              {name:"Bundle",price:"$49/mo",desc:"SmartETF Premium + SmartSuper full access",
               cta:"Best value",href:"/auth/signup?plan=bundle",highlight:false},
            ].map(p => (
              <div key={p.name} style={{
                background:"#fff",borderRadius:14,padding:"24px",
                border:`${p.highlight?"2px":"1px"} solid ${p.highlight?C.teal:C.gray200}`,
                position:"relative",
              }}>
                {p.highlight && (
                  <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",
                    background:C.teal,color:"#fff",fontSize:11,fontWeight:700,
                    padding:"3px 12px",borderRadius:20}}>Most popular</div>
                )}
                <div style={{fontSize:16,fontWeight:700,color:C.gray900,marginBottom:4}}>{p.name}</div>
                <div style={{fontSize:28,fontWeight:800,color:C.gray900,marginBottom:8,
                  letterSpacing:"-0.02em"}}>{p.price}</div>
                <p style={{fontSize:13,color:C.gray500,marginBottom:20,lineHeight:1.6,minHeight:52}}>
                  {p.desc}
                </p>
                <Link href={p.href} style={{
                  display:"block",textAlign:"center",padding:"10px",fontSize:14,
                  fontWeight:600,borderRadius:8,textDecoration:"none",
                  background:p.highlight?C.teal:"transparent",
                  color:p.highlight?"#fff":C.gray700,
                  border:`1.5px solid ${p.highlight?C.teal:C.gray200}`,
                }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SmartSuper crosslink */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"48px 40px"}}>
        <div style={{borderRadius:16,border:`1px solid #DDD8F7`,background:"#F8F7FF",padding:"32px"}}>
          <div style={{fontSize:12,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",
            color:C.purple,marginBottom:8}}>Part of the SuperSmart AU ecosystem</div>
          <h3 style={{fontSize:22,fontWeight:700,color:C.gray900,margin:"0 0 8px"}}>
            Already have a SmartSuper account?
          </h3>
          <p style={{fontSize:14,color:C.gray500,marginBottom:16,maxWidth:520,lineHeight:1.6}}>
            Your SmartETF account is the same login. Sign in once, access both platforms.
            The Bundle ($49/mo) covers SmartETF Premium + SmartSuper full access.
          </p>
          <Link href="https://smartsuperau.com" style={{fontSize:14,fontWeight:600,
            color:C.purple,textDecoration:"none"}}>
            Go to SmartSuper AU →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:`1px solid ${C.gray100}`,padding:"32px 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",
          justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{fontSize:13,color:C.gray400}}>
            © 2025 SmartETF · by SuperSmart AU · smartetfau.com
          </div>
          <div style={{fontSize:12,color:C.gray400,maxWidth:480,textAlign:"right"}}>
            SmartETF provides general information and educational modelling only.
            Not a financial advice service. Consult a licensed adviser before making investment decisions.
          </div>
        </div>
      </footer>
    </div>
  );
}
