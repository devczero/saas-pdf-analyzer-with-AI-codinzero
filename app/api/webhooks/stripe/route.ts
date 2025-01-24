import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (err) {
    const error = err as Error
    console.error(`Stripe webhook error: ${error.message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.subscription || !session.customer) return

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  )

  await prisma.user.update({
    where: { stripeCustomerId: session.customer as string },
    data: {
      subscription: {
        upsert: {
          create: mapSubscriptionData(subscription),
          update: mapSubscriptionData(subscription),
        },
      },
    },
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      interval: subscription.items.data[0].plan.interval,
      planId: subscription.items.data[0].plan.id,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.delete({
    where: { stripeSubscriptionId: subscription.id },
  })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  )

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}

function mapSubscriptionData(subscription: Stripe.Subscription) {
  return {
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    interval: subscription.items.data[0].plan.interval,
    planId: subscription.items.data[0].plan.id,
  }
}