"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) { setError(error.message); setLoading(false); }
    else setSuccess(true);
  }

  const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400";

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Check your email</h2>
        <p className="text-sm text-gray-500 mb-4">
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account and go to your dashboard.
        </p>
        <Link href="/auth/login" className="text-sm text-teal-600 hover:text-teal-700">
          Back to sign in
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-xl font-semibold text-gray-900 mb-1">
            Smart<span className="text-teal-600">ETF</span>
          </div>
          <p className="text-sm text-gray-500">Create your free account</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Password</label>
              <input type="password" required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters" minLength={6} className={inputClass} />
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 text-sm font-medium text-white rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-60 mt-1">
              {loading ? "Creating account…" : "Create free account"}
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-teal-600 font-medium">Sign in</Link>
          </p>
        </div>
        <p className="text-xs text-center text-gray-400 mt-4">
          Same account for SmartETF and SmartSuper AU.
        </p>
      </div>
    </div>
  );
}
