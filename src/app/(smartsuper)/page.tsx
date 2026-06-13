// src/app/(smartsuper)/page.tsx
// SmartSuper homepage — rendered when host is smartsuper.com.au
// The middleware routes that domain's traffic here.
// Note: in a Vercel deployment, you'd use rewrites in next.config.ts
// to route smartsuper.com.au → /smartsuper/* path group.

import Link from "next/link";

export default function SmartSuperHomePage() {
  return (
    <main className="min-h-screen">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Smart<span className="text-purple-600">Super</span> AU</span>
          <span className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">AU</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-800">Sign in</Link>
          <Link href="/auth/signup" className="text-sm font-medium px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700">
            Get started free
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest uppercase text-purple-600 mb-4">SmartSuper AU</p>
          <h1 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight mb-5">
            Australia's independent super optimisation platform
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
            Most Australians leave $2,000–$8,000 on the table annually through suboptimal contribution strategy.
            SmartSuper fixes that — personalised to your income, age, and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/analyse" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white rounded-xl bg-purple-600 hover:bg-purple-700">
              Analyse my super — free
            </Link>
            <Link href="/auth/signup" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">
              See plans from $29/mo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg">
          {[["$4,800","avg annual saving"],["6.2M","Australians affected"],["$0","to get your free score"]].map(([v,l])=>(
            <div key={l} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-medium text-gray-900">{v}</div>
              <div className="text-xs text-gray-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-gray-900 mb-8">What SmartSuper covers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ["Contribution optimiser","Before-tax vs after-tax strategy personalised to your marginal rate and carry-forward balance."],
              ["Division 296 modeller","See if the $3M super threshold affects you and model strategies to reduce impact."],
              ["FIRE calculator","Monte Carlo retirement modelling with super, ETFs, property, and Centrelink combined."],
              ["Retirement income","Account-based pension sequencing to maximise Centrelink eligibility and minimise tax."],
              ["Salary packaging","FBT optimiser for employees and hospital/NFP workers."],
              ["SMSF strategy","Setup analysis, investment strategy, and ongoing compliance guidance."],
            ].map(([t,d])=>(
              <div key={t} className="border border-gray-100 bg-white rounded-xl p-5">
                <h3 className="font-medium text-gray-900 mb-2">{t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sell SmartETF */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6 md:p-8">
          <p className="text-xs font-medium tracking-widest uppercase text-teal-600 mb-2">Part of the SuperSmart AU ecosystem</p>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Want to analyse your ETF portfolio too?
          </h2>
          <p className="text-sm text-gray-500 mb-4 max-w-lg">
            Your SmartSuper account works on SmartETF too — same login.
            The Bundle plan ($49/mo) covers both platforms.
          </p>
          <Link href="https://smartetf.com.au" className="text-sm font-medium text-teal-600 hover:text-teal-700">
            Go to SmartETF →
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2025 SmartSuper AU · smartsuper.com.au</p>
          <p className="text-xs text-gray-400">Not financial advice. AFSL considerations apply.</p>
        </div>
      </footer>
    </main>
  );
}
