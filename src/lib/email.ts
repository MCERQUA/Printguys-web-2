import { Resend } from 'resend'

// Lazy initialization to avoid build errors when API key is missing
function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(apiKey)
}

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailParams) {
  try {
    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Printguys <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email send exception:', error)
    return { success: false, error }
  }
}

// Email templates
export const emailTemplates = {
  contactConfirmation: (name: string) => ({
    subject: 'We received your message - Printguys',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Thanks for contacting us, ${name}!</h1>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to check out our services at <a href="https://printguys.ca">printguys.ca</a></p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 14px;">Printguys - Custom Print Solutions</p>
        <p style="color: #6b7280; font-size: 14px;">647-685-6286</p>
      </div>
    `
  }),

  contactNotification: (data: { name: string; email: string; phone?: string; message: string }) => ({
    subject: `New Contact Form: ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">New Contact Form Submission</h1>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td><td>${data.name}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
          ${data.phone ? `<tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td>${data.phone}</td></tr>` : ''}
          <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>Message:</strong></td><td>${data.message}</td></tr>
        </table>
      </div>
    `
  }),

  orderConfirmation: (orderNumber: string, items: any[], total: number) => ({
    subject: `Order Confirmed #${orderNumber} - Printguys`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Order Confirmed!</h1>
        <p>Thank you for your order. Your order number is <strong>#${orderNumber}</strong></p>
        <p>We'll send you another email when your order ships.</p>
        <h2>Order Summary</h2>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 14px;">Questions? Reply to this email or call 647-685-6286</p>
      </div>
    `
  }),

  orderReceived: (order: any) => ({
    subject: `Order Received #${order.orderNumber} - Printguys`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Order Received!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hi ${order.customerName || 'there'},</p>
          <p>We've received your order <strong>#${order.orderNumber}</strong> and it's being reviewed.</p>

          <h2 style="color: #10b981;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Order Number</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">#${order.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Total</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">$${order.totalAmount.toFixed(2)} CAD</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Status</strong></td>
              <td style="padding: 10px; border: 1px solid #e5e7eb;">Payment Received</td>
            </tr>
          </table>

          <h3>What's Next?</h3>
          <ol>
            <li>Our team will review your order and artwork</li>
            <li>We'll begin production within 24 hours</li>
            <li>You'll receive a shipping notification when your order ships</li>
          </ol>

          <p>Questions? Reply to this email or call us at <strong>647-685-6286</strong></p>
        </div>
        <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px;">
          <p>Printguys - Custom Print Solutions</p>
          <p>Greater Toronto Area, Canada</p>
        </div>
      </div>
    `
  }),

  orderShipped: (order: any, trackingNumber: string, carrier: string) => ({
    subject: `Your Order Has Shipped! #${order.orderNumber} - Printguys`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Your Order Has Shipped!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Great news! Your order <strong>#${order.orderNumber}</strong> is on its way.</p>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
            <p style="margin: 10px 0 0;"><strong>Carrier:</strong> ${carrier}</p>
          </div>

          <p>You can track your package using the tracking number above.</p>

          <p>Thank you for choosing Printguys!</p>
        </div>
      </div>
    `
  }),

  adminNewOrder: (order: any) => ({
    subject: `🛒 New Order #${order.orderNumber} - $${order.totalAmount.toFixed(2)}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h1>New Order Received!</h1>
        <p><strong>Order #:</strong> ${order.orderNumber}</p>
        <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)} CAD</p>
        <p><strong>Customer:</strong> ${order.customerEmail || 'Guest'}</p>
        <p><strong>Items:</strong> ${JSON.stringify(order.items, null, 2)}</p>
        <a href="https://printguys.ca/admin/orders/${order.id}" style="display: inline-block; background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Order</a>
      </div>
    `
  })
}
