import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blanks/brands - List all distinct brands with product counts
export async function GET() {
  try {
    // Get all unique brands with their product counts
    // Using groupBy to get distinct brands and count
    const brandGroups = await prisma.blankProduct.groupBy({
      by: ['brand'],
      where: {
        isActive: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        brand: 'asc',
      },
    })

    // Format response
    const brands = brandGroups.map(group => ({
      name: group.brand,
      productCount: group._count.id,
    }))

    return NextResponse.json({
      brands,
      totalCount: brands.length,
    })
  } catch (error) {
    console.error('Error fetching blank brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blank brands' },
      { status: 500 }
    )
  }
}
