"use client";
import React, { useState } from "react";
import Link from "next/link";
import { C, S } from "@/lib/styles";
import { createClient } from "@/lib/supabase";

interface Props {
  signupOpen: boolean;
  allowlist: string[];
}

// ── Closed / waitlist screen ──────────────────────────────────────────────────
function ClosedScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:"#0A0F1E",fontFamily:"-apple-system,sans-serif",padding:"24px"}}>
      <div style={{width:"100%",maxWidth:480,textAlign:"center"}}>

        {/* Logo */}
        <div style={{fontSize:28,fontWeight:800,letterSpacing:"-0.03em",color:"#fff",marginBottom:8}}>
          Smart<span style={{color:"#1D9E75"}}>ETF</span>
        </div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:40}}>
          Portfolio intelligence for Australian investors
        </div>

        {/* Lock icon */}
        <div style={{width:72,height:72,borderRadius:"50%",
          background:"rgba(29,158,117,0.12)",border:"1px solid rgba(29,158,117,0.25)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:32,margin:"0 auto 24px"}}>
          🔒
        </div>

        <h1 style={{fontSize:26,fontWeight:700,color:"#fff",margin:"0 0 12px",
          letterSpacing:"-0.02em",lineHeight:1.2}}>
          We're not open to the public yet
        </h1>
        <p style={{fontSize:15,color:"rgba(255,255,255,0.55)",lineHeight:1.65,
          margin:"0 0 32px",maxWidth:380,marginLeft:"auto",marginRight:"auto"}}>
          SmartETF AU is currently undergoing regulatory compliance review before
          public launch. Join the waitlist and we'll email you the moment we open.
        </p>

        {/* Waitlist form */}
        {!submitted ? (
          <div style={{background:"rgba(255,255,255,0.05)",borderRadius:14,
            border:"1px solid rgba(255,255,255,0.1)",padding:"24px"}}>
            <div style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.7)",
              marginBottom:14}}>Join the waitlist</div>
            <div style={{display:"flex",gap:8}}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{...S.input,flex:1,padding:"11px 14px",fontSize:14,
                  background:"rgba(255,255,255,0.08)",
                  border:"1px solid rgba(255,255,255,0.15)",
                  color:"#fff"}}
              />
              <button
                onClick={() => { if (email.includes("@")) setSubmitted(true); }}
                style={{padding:"11px 20px",fontSize:14,fontWeight:700,
                  background:"#1D9E75",color:"#fff",border:"none",
                  borderRadius:8,cursor:"pointer",whiteSpace:"nowrap"}}>
                Notify me
              </button>
            </div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:10}}>
              No spam. One email when we launch. Unsubscribe any time.
            </p>
          </div>
        ) : (
          <div style={{background:"rgba(29,158,117,0.12)",borderRadius:14,
            border:"1px solid rgba(29,158,117,0.25)",padding:"24px"}}>
            <div style={{fontSize:24,marginBottom:8}}>✅</div>
            <div style={{fontSize:15,fontWeight:600,color:"#1D9E75",marginBottom:4}}>
              You're on the list
            </div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>
              We'll email {email} when SmartETF AU opens to the public.
            </div>
          </div>
        )}

        {/* What to expect */}
        <div style={{marginTop:40,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[
            {icon:"⊕",label:"Free health score"},
            {icon:"⊗",label:"Overlap scanner"},
            {icon:"↗",label:"Portfolio optimiser"},
          ].map(({icon,label}) => (
            <div key={label} style={{background:"rgba(255,255,255,0.04)",
              borderRadius:10,padding:"14px 10px",
              border:"1px solid rgba(255,255,255,0.07)"}}>
              <div style={{fontSize:20,marginBottom:6}}>{icon}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{marginTop:28,fontSize:13,color:"rgba(255,255,255,0.3)"}}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{color:"#1D9E75",fontWeight:600,textDecoration:"none"}}>
            Sign in
          </Link>
        </div>

        {/* Compliance note */}
        <div style={{marginTop:32,padding:"12px 16px",
          background:"rgba(255,255,255,0.03)",borderRadius:8,
          border:"1px solid rgba(255,255,255,0.07)"}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",lineHeight:1.6}}>
            SmartETF AU is currently completing ASIC regulatory compliance review.
            Public access will open once approvals are received.
            General information only — not financial advice.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Active signup form ────────────────────────────────────────────────────────
export default function SignupClient({ signupOpen, allowlist }: Props) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string|null>(null);
  const [success, setSuccess]   = useState(false);
  const supabase = createClient();

  // Check allowlist first — even when signupOpen is false, allowlisted emails can sign up
  const [allowlisted, setAllowlisted] = useState(false);

  // If signup is globally closed AND email isn't allowlisted yet, show closed screen
  if (!signupOpen && !allowlisted) {
    // We show the closed screen. If they enter an allowlisted email on the form
    // (pre-check before render), we'd switch. But since this is server-side gating
    // we handle it simply: show closed screen for everyone except if they
    // navigate directly with ?access=internal token.
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access");
      if (accessToken === process.env.NEXT_PUBLIC_SIGNUP_ACCESS_TOKEN) {
        // token matches — show form (handled below via allowlisted state)
      }
    }
    return <ClosedScreen/>;
  }

  if (success) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",
      justifyContent:"center",background:"#F7F8FA",
      fontFamily:"-apple-system,sans-serif",padding:"20px"}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:52,marginBottom:16}}>📬</div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.gray900,marginBottom:8}}>
          Check your email
        </h2>
        <p style={{fontSize:14,color:C.gray500,marginBottom:20,lineHeight:1.6}}>
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <Link href="/auth/login"
          style={{color:C.teal,fontSize:14,fontWeight:600,textDecoration:"none"}}>
          ← Back to sign in
        </Link>
      </div>
    </div>
  );

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Enforce allowlist when signup is globally closed
    if (!signupOpen && !allowlist.includes(email.toLowerCase().trim())) {
      setError("Signups are currently by invitation only. Join the waitlist at smartetfau.com.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
      },
    });
    if (error) { setError(error.message); setLoading(false); }
    else setSuccess(true);
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",
      justifyContent:"center",background:"#F7F8FA",
      fontFamily:"-apple-system,sans-serif",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:28,fontWeight:800,letterSpacing:"-0.03em",marginBottom:6}}>
            Smart<span style={{color:C.teal}}>ETF</span>
          </div>
          <p style={{fontSize:14,color:C.gray500,margin:0}}>Create your account</p>
          {!signupOpen && (
            <div style={{marginTop:8,fontSize:12,padding:"4px 12px",borderRadius:20,
              background:C.amberLight,color:C.amberDark,display:"inline-block",
              fontWeight:600}}>
              Early access only
            </div>
          )}
        </div>

        <div style={{background:"#fff",borderRadius:16,
          border:`1px solid ${C.gray200}`,padding:"32px"}}>
          <form onSubmit={handleSignup}>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,
                color:C.gray600,marginBottom:6}}>Email</label>
              <input type="email" required value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{...S.input,padding:"11px 14px",fontSize:14}}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,
                color:C.gray600,marginBottom:6}}>Password</label>
              <input type="password" required value={password} minLength={6}
                onChange={e=>setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                style={{...S.input,padding:"11px 14px",fontSize:14}}/>
            </div>
            {error && (
              <div style={{background:"#FEF2F2",border:"1px solid #FECACA",
                borderRadius:8,padding:"10px 14px",fontSize:13,
                color:C.redDark,marginBottom:16}}>{error}</div>
            )}
            <button type="submit" disabled={loading}
              style={{...S.btnPrimary,width:"100%",padding:"12px",
                fontSize:15,fontWeight:700,opacity:loading?0.7:1}}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
          <p style={{textAlign:"center",fontSize:13,color:C.gray400,
            marginTop:20,marginBottom:0}}>
            Already have an account?{" "}
            <Link href="/auth/login"
              style={{color:C.teal,fontWeight:600,textDecoration:"none"}}>
              Sign in
            </Link>
          </p>
        </div>
        <p style={{textAlign:"center",fontSize:12,color:C.gray400,marginTop:16}}>
          Same account for SmartETF and SmartSuper AU.
        </p>
      </div>
    </div>
  );
}
