import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Update order status
    const orderId = session.metadata?.orderId
    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CONFIRMED',
        }
      })

      // Send confirmation email to customer
      const customerEmail = session.customer_email || order.email
      if (customerEmail) {
        const template = emailTemplates.orderReceived({
          orderNumber: order.orderNumber,
          totalAmount: order.total,
          customerName: order.email,
          customerEmail: customerEmail,
        } as any)
        await sendEmail({
          to: customerEmail,
          subject: template.subject,
          html: template.html,
        })
      }

      // Send notification to admin
      const adminEmail = process.env.ADMIN_EMAIL || 'nick@printguys.ca'
      const adminTemplate = emailTemplates.adminNewOrder({
        ...order,
        customerEmail: customerEmail,
      })
      await sendEmail({
        to: adminEmail,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
      })
    }
  }

  return NextResponse.json({ received: true })
}