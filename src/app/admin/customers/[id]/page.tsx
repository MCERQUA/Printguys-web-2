import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Package, Palette } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      designs: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: { orders: true, designs: true },
      },
    },
  })

  if (!customer) {
    notFound()
  }

  const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)

  const formatAddress = (address: any) => {
    if (!address) return 'No address on file'
    const parts = [address.line1, address.line2, address.city, address.state, address.postalCode]
    return parts.filter(Boolean).join(', ')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Link>
        </Button>
      </div>

      {/* Customer Info */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={customer.avatar || ''} />
              <AvatarFallback className="text-2xl">
                {(customer.firstName || "") + " " + (customer.lastName || "")?.charAt(0) || customer.email?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{(customer.firstName || "") + " " + (customer.lastName || "") || 'No name provided'}</h1>
              <p className="text-gray-500">{customer.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Customer</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Joined
              </p>
              <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Total Orders
              </p>
              <p className="font-medium">{customer._count.orders}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Total Designs
              </p>
              <p className="font-medium">{customer._count.designs}</p>
            </div>
          </div>
          {customer.phone && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </p>
              <p className="font-medium">{customer.phone}</p>
            </div>
          )}
          <div className="mt-4">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </p>
            <p className="font-medium">No address on file</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Orders</span>
              <Badge variant="secondary">{customer._count.orders} total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customer.orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {customer.orders.map((order: any) => (
                  <div key={order.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : order.status === 'pending'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Designs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Designs</span>
              <Badge variant="secondary">{customer._count.designs} total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customer.designs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No designs saved</p>
            ) : (
              <div className="space-y-4">
                {customer.designs.map((design: any) => (
                  <div key={design.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{design.name || 'Untitled Design'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(design.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">{design.productType}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href={`mailto:${customer.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
