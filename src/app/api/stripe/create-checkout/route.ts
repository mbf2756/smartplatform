import { getStripeInstance, BUNDLES, type BundleId } from '@/lib/stripe-bundles'
import { createServerSupabaseClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { bundleId, couponCode } = await request.json()

    const bundle = BUNDLES[bundleId as BundleId]
    if (!bundle) return NextResponse.json({ error: `Unknown bundle: ${bundleId}` }, { status: 400 })

    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient(cookieStore as any)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    if (!bundle.priceId) {
      return NextResponse.json({ error: 'Stripe not configured for this bundle.' }, { status: 503 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartetf.vercel.app'
    const stripe = getStripeInstance()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: [{ price: bundle.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?upgraded=true&bundle=${bundleId}`,
      cancel_url: `${appUrl}/pricing`,
      customer_email: user.email,
      metadata: { userId: user.id, bundleId, apps: bundle.apps.join(',') },
      subscription_data: { metadata: { userId: user.id, bundleId, apps: bundle.apps.join(',') } },
      allow_promotion_codes: true,
    }

    if (couponCode) {
      const promoCodes = await stripe.promotionCodes.list({ code: couponCode, active: true, limit: 1 })
      if (promoCodes.data.length > 0) {
        sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }]
        delete sessionParams.allow_promotion_codes
      } else {
        return NextResponse.json({ error: 'Coupon not found or expired.' }, { status: 400 })
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return NextResponse.json({ url: session.url })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Stripe error: ${message}` }, { status: 500 })
  }
}
