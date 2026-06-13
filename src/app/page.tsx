// SmartETF homepage — root page for smartetf.com.au
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-lg font-semibold">Smart<span className="text-teal-600">ETF</span></span>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-800">Sign in</Link>
          <Link href="/analyse" className="text-sm font-medium px-4 py-2 rounded-lg text-white bg-teal-600 hover:bg-teal-700">Analyse free</Link>
        </div>
      </nav>
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest uppercase text-teal-600 mb-4">SmartETF · by SuperSmart AU</p>
          <h1 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight mb-5">
            See what your ETF portfolio is <em className="not-italic text-teal-600">really</em> doing
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
            Most Australians hold ETFs that duplicate each other — paying double fees for the same exposure. Get your free Portfolio Health Score in 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/analyse" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white rounded-xl bg-teal-600 hover:bg-teal-700">Analyse my portfolio — free</Link>
            <Link href="/auth/signup" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">See plans from $19/mo</Link>
          </div>
          <p className="text-xs text-gray-400 mt-3">No account required for free score · Full analysis from $19/mo</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg">
          {[["1.8M","AU ETF holders"],["82%","have overlap"],["$4,200","avg 10yr fee drag"]].map(([v,l])=>(
            <div key={l} className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-medium text-gray-900">{v}</div>
              <div className="text-xs text-gray-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 border-y border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <blockquote className="text-xl md:text-2xl text-gray-900 font-medium leading-relaxed max-w-3xl">
            "I hold VGS, BGBL, and NDQ. <span className="text-red-500">83% of my global allocation is duplicated</span> across two funds — paying two MERs for the same Apple and Microsoft stock."
          </blockquote>
          <p className="text-sm text-gray-500 mt-3">The r/AusFinance realisation SmartETF surfaces in 60 seconds.</p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            ["Overlap X-ray","Company-level duplicate detection across every ETF and your super fund."],
            ["True exposure","Consolidated geographic, sector, and factor breakdown for your whole portfolio."],
            ["Health score","A single 0–100 score combining overlap, fees, diversification, and super alignment."],
            ["Portfolio optimiser","Choose a goal — minimise fees, FIRE, or maximise growth — and get an ETF mix."],
            ["SIP coordinator","Monthly DCA instructions to maintain target allocation without selling."],
            ["Super alignment","See if your super fund duplicates your brokerage ETF holdings."],
          ].map(([t,d])=>(
            <div key={t} className="border border-gray-100 rounded-xl p-5">
              <h3 className="font-medium text-gray-900 mb-2">{t}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-medium text-gray-900 mb-8">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {name:"Free",price:"$0",desc:"Health score + basic overlap scan",cta:"Get free score",href:"/analyse",hi:false},
              {name:"Pro",price:"$19/mo",desc:"Full analysis, optimiser, SIP coordinator",cta:"Start Pro",href:"/auth/signup?plan=pro",hi:true},
              {name:"Premium",price:"$35/mo",desc:"Pro + CGT tracking, franking credits",cta:"Start Premium",href:"/auth/signup?plan=premium",hi:false},
              {name:"Bundle",price:"$49/mo",desc:"SmartETF Premium + SmartSuper full access",cta:"Best value",href:"/auth/signup?plan=bundle",hi:false},
            ].map(p=>(
              <div key={p.name} className={`rounded-xl p-5 bg-white ${p.hi?"border-2 border-teal-500":"border border-gray-100"}`}>
                {p.hi&&<div className="text-xs font-medium mb-2 px-2 py-0.5 rounded-md inline-block bg-teal-50 text-teal-700">Most popular</div>}
                <div className="text-lg font-medium text-gray-900">{p.name}</div>
                <div className="text-2xl font-medium my-1 text-gray-900">{p.price}</div>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{p.desc}</p>
                <Link href={p.href} className={`block text-center text-sm font-medium py-2 rounded-lg ${p.hi?"bg-teal-600 text-white":"border border-gray-200 text-gray-700"}`}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© 2025 SmartETF · by SuperSmart AU · smartetf.com.au</p>
          <p className="text-xs text-gray-400">Not financial advice. AFSL considerations apply.</p>
        </div>
      </footer>
    </main>
  );
}
