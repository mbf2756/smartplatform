import Link from "next/link";
export default function UpgradePage() {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      fontFamily:"-apple-system,sans-serif",padding:40}}>
      <div style={{maxWidth:480,textAlign:"center"}}>
        <h1 style={{fontSize:28,fontWeight:700}}>Upgrade to SmartETF Pro</h1>
        <p style={{color:"#6B7280",marginBottom:32}}>Unlock the optimiser, SIP coordinator, and scenario modelling.</p>
        <Link href="/auth/signup?plan=pro" style={{display:"inline-block",padding:"12px 28px",
          background:"#1D9E75",color:"#fff",borderRadius:8,textDecoration:"none",fontWeight:600}}>
          Start Pro — $19/mo
        </Link>
        <br/><br/>
        <Link href="/dashboard" style={{color:"#9CA3AF",fontSize:14,textDecoration:"none"}}>
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
