import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface QuoteItem {
  productId: string
  productName: string
  styleNumber: string
  brand: string
  colorName: string
  colorHex?: string
  imageUrl?: string
  sizes: { [size: string]: number }
  estimatedPrice: number
  notes?: string
  decorationMethod?: string
}

interface QuoteSubmission {
  items: QuoteItem[]
  customerInfo: {
    name: string
    email: string
    phone?: string
    company?: string
    message?: string
  }
  totalItems: number
  totalEstimate: number
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteSubmission = await request.json()

    // Validate required fields
    if (!body.customerInfo?.name || !body.customerInfo?.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      )
    }

    // Format items for storage
    const formattedItems = body.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      styleNumber: item.styleNumber,
      brand: item.brand,
      colorName: item.colorName,
      colorHex: item.colorHex,
      imageUrl: item.imageUrl,
      sizes: item.sizes,
      estimatedPrice: item.estimatedPrice,
      notes: item.notes,
      decorationMethod: item.decorationMethod,
      quantity: Object.values(item.sizes).reduce((sum, qty) => sum + qty, 0),
    }))

    // Store the quote request in contact_submissions for now
    // In production, you would want a dedicated quotes table
    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.customerInfo.name,
        email: body.customerInfo.email,
        phone: body.customerInfo.phone,
        service: 'Quote Request',
        message: JSON.stringify({
          type: 'quote_request',
          items: formattedItems,
          totalItems: body.totalItems,
          totalEstimate: body.totalEstimate,
          customerMessage: body.customerInfo.message,
          company: body.customerInfo.company,
        }, null, 2),
      },
    })

    // Send email notification (if email service is configured)
    try {
      const adminEmail = process.env.ADMIN_EMAIL
      if (adminEmail && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_xxxxx') {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        // Format email content
        const itemsList = formattedItems
          .map(
            (item) =>
              `- ${item.productName} (${item.brand})\n  Color: ${item.colorName}\n  Sizes: ${Object.entries(item.sizes)
                .map(([size, qty]) => `${size}(${qty})`)
                .join(', ')}\n  Est. Price: $${item.estimatedPrice.toFixed(2)}${item.notes ? `\n  Notes: ${item.notes}` : ''}${item.decorationMethod ? `\n  Decoration: ${item.decorationMethod}` : ''}`
          )
          .join('\n\n')

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'PrintGuys <noreply@printguys.ca>',
          to: adminEmail,
          subject: `New Quote Request from ${body.customerInfo.name}`,
          text: `
New Quote Request

Customer Information:
- Name: ${body.customerInfo.name}
- Email: ${body.customerInfo.email}
- Phone: ${body.customerInfo.phone || 'Not provided'}
- Company: ${body.customerInfo.company || 'Not provided'}

Items Requested:
${itemsList}

Summary:
- Total Items: ${body.totalItems} pieces
- Estimated Total: $${body.totalEstimate.toFixed(2)}

Customer Message:
${body.customerInfo.message || 'No additional message'}

---
Submitted: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}
          `.trim(),
        })
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      quoteId: submission.id,
      message: 'Quote request submitted successfully',
    })
  } catch (error) {
    console.error('Quote submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // This could be used to fetch quote history for logged-in users
  // For now, return a not implemented response
  return NextResponse.json(
    { error: 'Not implemented' },
    { status: 501 }
  )
}
