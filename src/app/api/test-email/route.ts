import { NextResponse } from 'next/server'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, type = 'test' } = body

    if (!to) {
      return NextResponse.json({ error: 'Email address required' }, { status: 400 })
    }

    let result

    switch (type) {
      case 'contact-confirmation':
        const template1 = emailTemplates.contactConfirmation('Test User')
        result = await sendEmail({
          to,
          subject: template1.subject,
          html: template1.html
        })
        break

      case 'contact-notification':
        const template2 = emailTemplates.contactNotification({
          name: 'Test User',
          email: to,
          phone: '647-685-6286',
          message: 'This is a test message from the contact form.'
        })
        result = await sendEmail({
          to: process.env.ADMIN_EMAIL || to,
          subject: template2.subject,
          html: template2.html
        })
        break

      case 'order-confirmation':
        const template3 = emailTemplates.orderConfirmation('TEST-001', [{ name: 'Test Product', quantity: 1 }], 99.99)
        result = await sendEmail({
          to,
          subject: template3.subject,
          html: template3.html
        })
        break

      case 'order-received':
        const template4 = emailTemplates.orderReceived({
          orderNumber: 'TEST-001',
          totalAmount: 99.99,
          customerName: 'Test Customer',
          customerEmail: to,
        })
        result = await sendEmail({
          to,
          subject: template4.subject,
          html: template4.html
        })
        break

      case 'order-shipped':
        const template5 = emailTemplates.orderShipped(
          { orderNumber: 'TEST-001' },
          '1Z999AA10123456784',
          'FedEx'
        )
        result = await sendEmail({
          to,
          subject: template5.subject,
          html: template5.html
        })
        break

      case 'admin-new-order':
        const template6 = emailTemplates.adminNewOrder({
          id: 'order_test_123',
          orderNumber: 'TEST-001',
          totalAmount: 99.99,
          customerEmail: to,
          items: [{ name: 'Test Product', quantity: 1, price: 99.99 }],
        })
        result = await sendEmail({
          to,
          subject: template6.subject,
          html: template6.html
        })
        break

      default:
        // Basic test email
        result = await sendEmail({
          to,
          subject: 'Test Email from Printguys',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #10b981;">Test Email</h1>
              <p>If you're seeing this, the email service is working correctly!</p>
              <p>From: Printguys Email Service</p>
              <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 14px;">Sent at: ${new Date().toISOString()}</p>
            </div>
          `
        })
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        data: result.data
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email'
    }, { status: 500 })
  }
}

// Also support GET for simple testing
export async function GET(request: Request) {
  return NextResponse.json({
    message: 'Email test endpoint is working. Use POST to send test emails.',
    usage: {
      endpoint: '/api/test-email',
      method: 'POST',
      body: {
        to: 'your-email@example.com',
        type: 'test | contact-confirmation | contact-notification | order-confirmation | order-received | order-shipped | admin-new-order'
      }
    }
  })
}
