# SmartPlatform — SmartETF + SmartSuper AU

Single Next.js 15 monorepo. Two domains. One backend.

## Architecture (Option C)
- smartetf.com.au  → same Vercel project → same Supabase
- smartsuper.com.au → same Vercel project → same Supabase

Domain routing: vercel.json rewrites + middleware x-site header injection.

## Setup
1. Create Supabase project, run supabase-schema.sql
2. cp .env.example .env.local and fill in values
3. npm install && npm run dev
4. npx vercel --prod, add both domains in Vercel dashboard

## Key files
- src/data/etfDatabase.ts     — 20 ETFs + overlap matrix
- src/data/superFunds.ts      — 9 super fund records
- src/lib/analysis.ts         — pure portfolio scoring engine
- src/lib/supabase.ts         — shared Supabase client
- src/hooks/usePortfolio.ts   — central state + Supabase sync
- src/components/ui/index.tsx — shared UI primitives
- src/app/page.tsx            — SmartETF homepage
- src/app/(smartsuper)/page.tsx — SmartSuper homepage
- src/app/dashboard/page.tsx  — full analysis dashboard
- src/app/auth/login/page.tsx — shared auth (same account both sites)
- middleware.ts                — domain detection + auth guard
- vercel.json                  — domain routing rewrites

## Tiers
Free $0 | Pro $19/mo | Premium $35/mo | Bundle $49/mo
