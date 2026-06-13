"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { C, S } from "@/lib/styles";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else router.push(redirectTo);
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:"#F7F8FA",fontFamily:"-apple-system,sans-serif",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:28,fontWeight:800,letterSpacing:"-0.03em",marginBottom:6}}>
            Smart<span style={{color:C.teal}}>ETF</span>
          </div>
          <p style={{fontSize:14,color:C.gray500,margin:0}}>Sign in to your account</p>
        </div>
        <div style={{background:"#fff",borderRadius:16,border:`1px solid ${C.gray200}`,padding:"32px"}}>
          <form onSubmit={handleLogin}>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:C.gray600,marginBottom:6}}>Email</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com" style={{...S.input,padding:"11px 14px",fontSize:14}}/>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <label style={{fontSize:12,fontWeight:600,color:C.gray600}}>Password</label>
                <Link href="/auth/forgot-password" style={{fontSize:12,color:C.teal,textDecoration:"none"}}>Forgot?</Link>
              </div>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
                placeholder="••••••••" style={{...S.input,padding:"11px 14px",fontSize:14}}/>
            </div>
            {error&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,
              padding:"10px 14px",fontSize:13,color:C.redDark,marginBottom:16}}>{error}</div>}
            <button type="submit" disabled={loading} style={{...S.btnPrimary,width:"100%",
              padding:"12px",fontSize:15,fontWeight:700,opacity:loading?0.7:1}}>
              {loading?"Signing in…":"Sign in"}
            </button>
          </form>
          <p style={{textAlign:"center",fontSize:13,color:C.gray400,marginTop:20,marginBottom:0}}>
            No account?{" "}
            <Link href="/auth/signup" style={{color:C.teal,fontWeight:600,textDecoration:"none"}}>Create one free</Link>
          </p>
        </div>
        <p style={{textAlign:"center",fontSize:12,color:C.gray400,marginTop:16}}>Same account for SmartETF and SmartSuper AU.</p>
      </div>
    </div>
  );
}
