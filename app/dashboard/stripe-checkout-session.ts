'use server'

import { auth, currentUser } from "@clerk/nextjs/server"
import { getStripeSession, stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export async function createSubscription() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    return redirect('/sign-in?redirect_url=/pricing')
  }

  let databaseUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true }
  })

  if (!databaseUser) {
    throw new Error('DatabaseUser Not Found')
  }

  const email = user?.primaryEmailAddress?.emailAddress
  
  if (!databaseUser.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: email
    })

    databaseUser = await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
      select: { stripeCustomerId: true }
    })
  }

  if (!databaseUser.stripeCustomerId) {
    throw new Error('Failed to set stripeCustomerId for the user')
  }

  const subscriptionUrl = await getStripeSession({
    customerId: databaseUser.stripeCustomerId,
    domainUrl: process.env.NODE_ENV === 'production' 
      ? (process.env.PRODUCTION_URL as string) 
      : 'http://localhost:3000',
    priceId: process.env.STRIPE_YEARLY_PRICE_ID as string
  })

  return redirect(subscriptionUrl)
}