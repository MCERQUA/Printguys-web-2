import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blanks - List blank products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '24', 10)

    // Ensure reasonable limits
    const take = Math.min(Math.max(limit, 1), 100)
    const skip = (Math.max(page, 1) - 1) * take

    // Build where clause
    const where: {
      isActive: boolean
      categoryId?: string
      brand?: { contains: string; mode: 'insensitive' }
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' }
        description?: { contains: string; mode: 'insensitive' }
        brand?: { contains: string; mode: 'insensitive' }
        styleNumber?: { contains: string; mode: 'insensitive' }
      }>
      priceMin?: { gte?: number; lte?: number }
      priceMax?: { gte?: number; lte?: number }
    } = {
      isActive: true,
    }

    // Filter by category (using category slug or ID)
    if (category) {
      // Check if it's a slug or ID
      const categoryRecord = await prisma.blankCategory.findFirst({
        where: {
          OR: [
            { id: category },
            { slug: category }
          ]
        }
      })
      if (categoryRecord) {
        where.categoryId = categoryRecord.id
      }
    }

    // Filter by brand (case-insensitive contains)
    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' }
    }

    // Search across multiple fields
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { styleNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Price range filters
    if (minPrice) {
      const min = parseFloat(minPrice)
      if (!isNaN(min)) {
        where.priceMin = { ...where.priceMin, gte: min }
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice)
      if (!isNaN(max)) {
        where.priceMax = { ...where.priceMax, lte: max }
      }
    }

    // Execute query with count
    const [products, totalCount] = await Promise.all([
      prisma.blankProduct.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          brand: true,
          primaryImageUrl: true,
          priceMin: true,
          priceMax: true,
          isNew: true,
          isFeatured: true,
          styleNumber: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { isNew: 'desc' },
          { name: 'asc' },
        ],
        skip,
        take,
      }),
      prisma.blankProduct.count({ where }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / take)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit: take,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching blank products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blank products' },
      { status: 500 }
    )
  }
}
