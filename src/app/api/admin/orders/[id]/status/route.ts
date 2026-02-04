import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'

export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status, trackingNumber, carrier, notes } = await request.json()

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const { id } = await params

    // Get current order with user info for notifications
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Build update data with timestamp tracking
    const updateData: any = { status }

    // Set timestamps based on status
    if (status === 'SHIPPED') {
      updateData.shippedAt = new Date()
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date()
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date()
    }

    // Add tracking info if provided
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber
    }
    if (carrier) {
      updateData.shippingMethod = carrier
    }
    if (notes) {
      const timestamp = new Date().toLocaleString()
      const noteWithTimestamp = `[${timestamp}] ${notes}`
      updateData.internalNotes = order.internalNotes
        ? `${order.internalNotes}\n\n${noteWithTimestamp}`
        : noteWithTimestamp
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    // Send notifications based on status change
    const customerEmail = order.user?.email || order.email

    if (customerEmail) {
      if (status === 'SHIPPED' && trackingNumber) {
        const template = emailTemplates.orderShipped(order, trackingNumber, carrier || 'Canada Post')
        await sendEmail({
          to: customerEmail,
          subject: template.subject,
          html: template.html,
        })
      } else if (status === 'DELIVERED') {
        // Could send delivery confirmation email
      } else if (status === 'CANCELLED') {
        // Send cancellation email
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
