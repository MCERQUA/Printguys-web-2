import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderIds, status, trackingNumbers, notes } = body

    // Validate input
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: 'Order IDs array is required' }, { status: 400 })
    }
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // Validate trackingNumbers format if provided
    if (trackingNumbers && (typeof trackingNumbers !== 'object' || Array.isArray(trackingNumbers))) {
      return NextResponse.json({ error: 'Tracking numbers must be an object mapping order IDs to tracking numbers' }, { status: 400 })
    }

    // Get all orders with user info
    const orders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (orders.length === 0) {
      return NextResponse.json({ error: 'No orders found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = { status }

    // Set timestamps based on status
    if (status === 'SHIPPED') {
      updateData.shippedAt = new Date()
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date()
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date()
    }

    // Track orders that need email notifications
    const ordersNeedingEmail = []

    // Process each order
    for (const order of orders) {
      // Add tracking info if provided for this order
      if (trackingNumbers && trackingNumbers[order.id]) {
        updateData.trackingNumber = trackingNumbers[order.id]
        // Add carrier info if the tracking number lookup returns it
        if (typeof trackingNumbers[order.id] === 'object' && trackingNumbers[order.id].carrier) {
          updateData.shippingMethod = trackingNumbers[order.id].carrier
        }
      }

      // Add notes if provided
      if (notes) {
        const timestamp = new Date().toLocaleString()
        const noteWithTimestamp = `[${timestamp}] ${notes}`
        updateData.internalNotes = order.internalNotes
          ? `${order.internalNotes}\n\n${noteWithTimestamp}`
          : noteWithTimestamp
      }

      // Update the order
      await prisma.order.update({
        where: { id: order.id },
        data: updateData,
      })

      // Track orders that need shipping notifications
      if (status === 'SHIPPED' && trackingNumbers?.[order.id] && order.user?.email) {
        ordersNeedingEmail.push(order)
      }
    }

    // Send email notifications for shipped orders
    let emailSentCount = 0
    if (ordersNeedingEmail.length > 0) {
      try {
        for (const order of ordersNeedingEmail) {
          const trackingNumber = trackingNumbers?.[order.id] || ''
          const carrier = trackingNumbers?.[order.id]?.carrier || 'Unknown Carrier'

          const customerName = (order.user?.firstName || order.user?.lastName) || 'there'
          const emailData = emailTemplates.orderShipped(
            {
              ...order,
              customerName,
              totalAmount: order.total
            },
            trackingNumber,
            carrier
          )

          await sendEmail({
            to: order.user?.email || order.email,
            subject: emailData.subject,
            html: emailData.html,
            text: `Your order #${order.orderNumber} has been shipped. Tracking number: ${trackingNumber}. Carrier: ${carrier}`
          })
          emailSentCount++
        }
        console.log(`Sent ${emailSentCount} shipment notifications for bulk status update`)
      } catch (emailError) {
        console.error('Error sending shipment emails:', emailError)
        // Don't fail the request if emails fail
      }
    }

    // Return summary
    return NextResponse.json({
      success: true,
      updatedCount: orders.length,
      emailSentCount,
      orders: orders.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status,
        trackingNumber: trackingNumbers?.[order.id],
      })),
    })
  } catch (error) {
    console.error('Error updating bulk order status:', error)
    return NextResponse.json({ error: 'Failed to update bulk status' }, { status: 500 })
  }
}
