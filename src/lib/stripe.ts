import Stripe from 'stripe'

// Lazy initialization - only create Stripe instance when needed
export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover' as any,
    typescript: true,
  })
}