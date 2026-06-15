import Link from 'next/link'
import { SmartSuitePricing } from '@/components/SmartSuitePricing'

export const metadata = {
  title: 'Pricing — SmartETF AU',
  description: 'Start free. Build your bundle. One app or all three.',
}

const T    = '#1D9E75'
const DARK = '#0A0F1E'
const GY   = '#F8FAFC'

const FREE_FEATURES = [
  'Portfolio health score (0–100)',
  'Overlap scanner — company level',
  'Exposure map — geo, sector, factor',
  'Build your portfolio guide',
  'My portfolio tracker',
]

export default function PricingPage() {
  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", background: GY, color: '#0F172A', minHeight: '100vh' }}>
      <nav style={{ background: DARK, borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', textDecoration: 'none' }}>
            Smart<span style={{ color: T }}>ETF</span>
          </Link>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/auth/login" style={{ padding: '8px 18px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderRadius: 8 }}>Sign in</Link>
            <Link href="/auth/signup" style={{ padding: '9px 22px', fontSize: 14, fontWeight: 700, background: T, color: '#fff', textDecoration: 'none', borderRadius: 8 }}>Start free</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Smart Suite pricing</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: DARK, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            One app or all three.<br />You choose.
          </h1>
          <p style={{ fontSize: 16, color: '#64748B', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            SmartETF is part of the Smart Suite alongside SmartSuper and SmartProperty.
            Start with one or bundle them and save.
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: '28px', border: '1px solid #E2E8F0', marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Free — always</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: DARK }}>$0<span style={{ fontSize: 14, fontWeight: 500, color: '#94A3B8' }}>/forever</span></div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>No credit card. No time limit.</div>
            </div>
            <Link href="/auth/signup" style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 13, fontWeight: 700, color: DARK, textDecoration: 'none' }}>
              Get started free
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {FREE_FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: DARK, alignItems: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="6.5" stroke={T} strokeWidth="1.2"/>
                  <path d="M4.5 7l2 2 3-3" stroke={T} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Subscriber plans — from $150/year · all tools unlocked
          </div>
          <SmartSuitePricing
            currentApp="smartetf"
            primaryColor={DARK}
            accentColor={T}
            bgColor={GY}
          />
        </div>
      </div>

      <footer style={{ background: DARK, padding: '32px', marginTop: 40 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: '#fff', textDecoration: 'none' }}>
            Smart<span style={{ color: T }}>ETF</span>
          </Link>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'right', lineHeight: 1.7 }}>
            General information only — not financial advice.
          </div>
        </div>
      </footer>
    </div>
  )
}
