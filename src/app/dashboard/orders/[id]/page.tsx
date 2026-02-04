import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

const statusSteps = [
  { key: 'CONFIRMED', label: 'Order Placed', icon: Package },
  { key: 'IN_PRODUCTION', label: 'Processing', icon: Clock },
  { key: 'QUALITY_CHECK', label: 'Quality Check', icon: Package },
  { key: 'READY_TO_SHIP', label: 'Ready', icon: Package },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle },
]

const statusOrder: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  IN_PRODUCTION: 2,
  QUALITY_CHECK: 3,
  READY_TO_SHIP: 4,
  SHIPPED: 5,
  DELIVERED: 6,
  COMPLETED: 6,
  CANCELLED: -1,
  REFUNDED: -1,
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  const { id } = await params

  if (!userId) {
    return null
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      shippingAddress: true,
      billingAddress: true,
    },
  })

  if (!order || order.userId !== userId) {
    notFound()
  }

  const currentStepIndex = Math.max(0, statusOrder[order.status] || 0)

  return (
    <div>
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/orders">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-CA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Badge className="text-lg px-4 py-2">
          {order.status.toLowerCase().replace('_', ' ')}
        </Badge>
      </div>

      {/* Progress Tracker */}
      {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
        <Card className="mb-8">
          <CardContent className="py-8">
            <div className="flex justify-between overflow-x-auto">
              {statusSteps.map((step, index) => {
                const isComplete = index <= currentStepIndex
                const isCurrent = index === currentStepIndex
                const Icon = step.icon
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 min-w-[80px]">
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center mb-2 shrink-0
                      ${isComplete ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}
                      ${isCurrent ? 'ring-4 ring-emerald-200' : ''}
                    `}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs sm:text-sm text-center ${isComplete ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="h-20 w-20 bg-gray-200 rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        SKU: {item.sku} • Qty: {item.quantity}
                      </p>
                      {item.options && (
                        <p className="text-xs text-gray-400 mt-1">
                          {Object.entries(item.options as Record<string, string>).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${Number(item.totalPrice).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${Number(order.shipping).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${Number(order.tax).toFixed(2)}</span>
                </div>
                {order.discount && Number(order.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>${Number(order.total).toFixed(2)} CAD</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-gray-600">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.address1}<br />
                {order.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.province}<br />
                {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </address>
            </CardContent>
          </Card>

          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle>Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">Tracking Number</p>
                <p className="font-medium">{order.trackingNumber}</p>
                {order.trackingUrl && (
                  <Button variant="link" className="p-0 h-auto mt-2" asChild>
                    <Link href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                      Track Package
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-500">
                Questions about your order?
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <p className="text-sm text-gray-500 text-center">
                or call 647-685-6286
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
