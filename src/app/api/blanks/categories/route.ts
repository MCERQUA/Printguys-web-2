import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blanks/categories - List all categories with product counts
export async function GET() {
  try {
    // Get categories with product counts
    const categories = await prisma.blankCategory.findMany({
      select: {
        id: true,
        name: true,
        nameFr: true,
        slug: true,
        description: true,
        imageUrl: true,
        position: true,
        supplier: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
              }
            }
          }
        }
      },
      orderBy: [
        { position: 'asc' },
        { name: 'asc' },
      ],
    })

    // Format response with productCount
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      nameFr: category.nameFr,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      position: category.position,
      supplier: category.supplier,
      productCount: category._count.products,
    }))

    return NextResponse.json({
      categories: formattedCategories,
      totalCount: formattedCategories.length,
    })
  } catch (error) {
    console.error('Error fetching blank categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blank categories' },
      { status: 500 }
    )
  }
}
