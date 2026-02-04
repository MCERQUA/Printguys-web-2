import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, emailTemplates } from '@/lib/email'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Save to database (optional - for tracking)
    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          phone: phone || null,
          service: service || null,
          message,
        }
      })
    } catch (dbError) {
      console.error('Failed to save contact to DB:', dbError)
      // Continue even if DB save fails
    }

    // Send confirmation email to customer
    const confirmTemplate = emailTemplates.contactConfirmation(name)
    await sendEmail({
      to: email,
      subject: confirmTemplate.subject,
      html: confirmTemplate.html,
      replyTo: process.env.ADMIN_EMAIL,
    })

    // Send notification email to admin
    const notifyTemplate = emailTemplates.contactNotification({ name, email, phone, message })
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'nick@printguys.ca',
      subject: notifyTemplate.subject,
      html: notifyTemplate.html,
      replyTo: email,
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or call us at 647-685-6286.' },
      { status: 500 }
    )
  }
}
