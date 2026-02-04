import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Package, Users, ArrowUp, ArrowDown } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(today.getDate() - 7)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  // Fetch all stats
  const [
    todayRevenue,
    weekRevenue,
    monthRevenue,
    lastMonthRevenue,
    todayOrders,
    weekOrders,
    monthOrders,
    newCustomersMonth,
    revenueByDay,
  ] = await Promise.all([
    // Today's revenue
    prisma.order.aggregate({
      where: { createdAt: { gte: today }, status: { not: 'CANCELLED' } },
      _sum: { total: true },
    }),
    // This week's revenue
    prisma.order.aggregate({
      where: { createdAt: { gte: thisWeekStart }, status: { not: 'CANCELLED' } },
      _sum: { total: true },
    }),
    // This month's revenue
    prisma.order.aggregate({
      where: { createdAt: { gte: thisMonthStart }, status: { not: 'CANCELLED' } },
      _sum: { total: true },
    }),
    // Last month's revenue (for comparison)
    prisma.order.aggregate({
      where: {
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        status: { not: 'CANCELLED' },
      },
      _sum: { total: true },
    }),
    // Order counts
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { createdAt: { gte: thisWeekStart } } }),
    prisma.order.count({ where: { createdAt: { gte: thisMonthStart } } }),
    // New customers this month
    prisma.user.count({ where: { createdAt: { gte: thisMonthStart } } }),
    // Revenue by day (last 7 days)
    prisma.$queryRaw<{ date: Date; revenue: bigint; orders: bigint }[]>`
      SELECT DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders
      FROM orders
      WHERE created_at >= ${thisWeekStart} AND status != 'CANCELLED'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `,
  ])

  const monthGrowth = lastMonthRevenue._sum.total
    ? ((Number(monthRevenue._sum.total || 0) - Number(lastMonthRevenue._sum.total)) /
        Number(lastMonthRevenue._sum.total)) * 100
    : 0

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(Number(todayRevenue._sum.total || 0)).toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">{todayOrders} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(Number(weekRevenue._sum.total || 0)).toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">{weekOrders} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">This Month</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(Number(monthRevenue._sum.total || 0)).toFixed(2)}
            </div>
            <div className="flex items-center text-xs">
              {monthGrowth >= 0 ? (
                <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={monthGrowth >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                {Math.abs(monthGrowth).toFixed(1)}% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">New Customers</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCustomersMonth}</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart (simplified table) */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Daily Revenue (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(revenueByDay || []).map((day: any) => (
              <div key={day.date?.toString()} className="flex items-center justify-between">
                <span>{new Date(day.date).toLocaleDateString()}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">{Number(day.orders)} orders</span>
                  <span className="font-medium w-24 text-right">
                    ${Number(day.revenue || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add status counts here */}
            <p className="text-gray-500">Status breakdown coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add service breakdown here */}
            <p className="text-gray-500">Service breakdown coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
