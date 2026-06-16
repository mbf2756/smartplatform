import { getStripeInstance } from '@/lib/stripe-bundles'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = (await headers()).get('stripe-signature')!
  const stripe = getStripeInstance()

  let event: ReturnType<typeof stripe.webhooks.constructEvent>

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const userId   = session.metadata?.userId
    const bundleId = session.metadata?.bundleId
    const apps     = session.metadata?.apps?.split(',').filter(Boolean) ?? []
    if (userId) {
      const appCount = apps.length
      const bundle = appCount >= 3 ? 'triple' : appCount === 2 ? 'double' : 'single'
      await supabaseAdmin.from('subscriptions').update({
        stripe_customer:  session.customer,        // fixed: was stripe_customer_id
        stripe_sub_id:    session.subscription,    // fixed: was stripe_subscription_id
        plan:    bundleId ?? 'bundle',
        apps,
        bundle,
        status:  'active',
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as any
    const apps = sub.metadata?.apps?.split(',').filter(Boolean) ?? []
    const appCount = apps.length
    const bundle = appCount >= 3 ? 'triple' : appCount === 2 ? 'double' : appCount === 1 ? 'single' : 'none'
    const payload: Record<string, unknown> = {
      status: sub.status,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    }
    if (apps.length > 0) { payload.apps = apps; payload.bundle = bundle }
    await supabaseAdmin.from('subscriptions').update(payload).eq('stripe_sub_id', sub.id)  // fixed: was stripe_subscription_id
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as any
    await supabaseAdmin.from('subscriptions').update({
      plan: 'free', apps: [], bundle: 'none', status: 'cancelled',  // fixed: was 'active'
      updated_at: new Date().toISOString(),
    }).eq('stripe_sub_id', sub.id)  // fixed: was stripe_subscription_id
  }

  return NextResponse.json({ received: true })
}
