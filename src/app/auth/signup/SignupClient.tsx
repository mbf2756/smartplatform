"use client";
import React, { useState } from "react";
import Link from "next/link";
import { C, S } from "@/lib/styles";
import { createClient } from "@/lib/supabase";

export default function SignupClient() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false); const [error,setError]=useState<string|null>(null);
  const [success,setSuccess]=useState(false);
  const supabase=createClient();

  async function handleSignup(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError(null);
    const{error}=await supabase.auth.signUp({email,password,
      options:{emailRedirectTo:`${window.location.origin}/auth/callback?next=/dashboard`}});
    if(error){setError(error.message);setLoading(false);}else setSuccess(true);
  }

  if(success)return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:"#F7F8FA",fontFamily:"-apple-system,sans-serif",padding:"20px"}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:52,marginBottom:16}}>📬</div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.gray900,marginBottom:8}}>Check your email</h2>
        <p style={{fontSize:14,color:C.gray500,marginBottom:20,lineHeight:1.6}}>
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <Link href="/auth/login" style={{color:C.teal,fontSize:14,fontWeight:600,textDecoration:"none"}}>← Back to sign in</Link>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:"#F7F8FA",fontFamily:"-apple-system,sans-serif",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:28,fontWeight:800,letterSpacing:"-0.03em",marginBottom:6}}>Smart<span style={{color:C.teal}}>ETF</span></div>
          <p style={{fontSize:14,color:C.gray500,margin:0}}>Create your free account</p>
        </div>
        <div style={{background:"#fff",borderRadius:16,border:`1px solid ${C.gray200}`,padding:"32px"}}>
          <form onSubmit={handleSignup}>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:C.gray600,marginBottom:6}}>Email</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com" style={{...S.input,padding:"11px 14px",fontSize:14}}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:C.gray600,marginBottom:6}}>Password</label>
              <input type="password" required value={password} minLength={6} onChange={e=>setPassword(e.target.value)}
                placeholder="Min. 6 characters" style={{...S.input,padding:"11px 14px",fontSize:14}}/>
            </div>
            {error&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,
              padding:"10px 14px",fontSize:13,color:C.redDark,marginBottom:16}}>{error}</div>}
            <button type="submit" disabled={loading} style={{...S.btnPrimary,width:"100%",
              padding:"12px",fontSize:15,fontWeight:700,opacity:loading?0.7:1}}>
              {loading?"Creating account…":"Create free account"}
            </button>
          </form>
          <p style={{textAlign:"center",fontSize:13,color:C.gray400,marginTop:20,marginBottom:0}}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{color:C.teal,fontWeight:600,textDecoration:"none"}}>Sign in</Link>
          </p>
        </div>
        <p style={{textAlign:"center",fontSize:12,color:C.gray400,marginTop:16}}>Same account for SmartETF and SmartSuper AU.</p>
      </div>
    </div>
  );
}
