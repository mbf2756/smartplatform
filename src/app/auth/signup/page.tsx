import { Suspense } from "react";
import SignupClient from "./SignupClient";
export const dynamic = "force-dynamic";

// Signup is locked until compliance approval is received.
// To unlock: set NEXT_PUBLIC_SIGNUP_OPEN=true in Vercel environment variables.
// To grant individual access: set NEXT_PUBLIC_SIGNUP_ALLOWLIST=email1@x.com,email2@x.com
const SIGNUP_OPEN     = process.env.NEXT_PUBLIC_SIGNUP_OPEN === "true";
const ALLOWLIST       = (process.env.NEXT_PUBLIC_SIGNUP_ALLOWLIST ?? "deepakjames@gmail.com")
                          .split(",").map(e => e.trim().toLowerCase());

export default function SignupPage() {
  return (
    <Suspense fallback={<div/>}>
      <SignupClient signupOpen={SIGNUP_OPEN} allowlist={ALLOWLIST}/>
    </Suspense>
  );
}
