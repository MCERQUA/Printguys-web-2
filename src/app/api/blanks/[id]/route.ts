import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ColorGroup {
  colorName: string
  colorNameFr: string | null
  hexCode: string | null
  pantoneCode: string | null
  imageUrl: string | null
  variants: Array<{
    id: string
    sku: string
    size: string
    msrp: number
    price1: number
    priceCase: number
    price10Case: number
    caseQuantity: number
    weight: number
    inStock: boolean
    stockLevel: number | null
  }>
}

// GET /api/blanks/[id] - Get single blank product with all variants
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find product by ID or slug
    const product = await prisma.blankProduct.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameFr: true,
            slug: true,
            description: true,
          }
        },
        supplier: {
          select: {
            id: true,
            name: true,
            code: true,
            logoUrl: true,
          }
        },
        variants: {
          orderBy: [
            { colorName: 'asc' },
            { size: 'asc' },
          ],
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Group variants by color for easier frontend display
    const variantsByColor = product.variants.reduce<Record<string, ColorGroup>>((acc, variant) => {
      const colorKey = variant.colorName

      if (!acc[colorKey]) {
        acc[colorKey] = {
          colorName: variant.colorName,
          colorNameFr: variant.colorNameFr,
          hexCode: variant.hexCode,
          pantoneCode: variant.pantoneCode,
          imageUrl: variant.imageUrl,
          variants: [],
        }
      }

      acc[colorKey].variants.push({
        id: variant.id,
        sku: variant.sku,
        size: variant.size,
        msrp: Number(variant.msrp),
        price1: Number(variant.price1),
        priceCase: Number(variant.priceCase),
        price10Case: Number(variant.price10Case),
        caseQuantity: variant.caseQuantity,
        weight: Number(variant.weight),
        inStock: variant.inStock,
        stockLevel: variant.stockLevel,
      })

      return acc
    }, {})

    // Get unique sizes in order
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL']
    const uniqueSizes = [...new Set(product.variants.map(v => v.size))]
      .sort((a, b) => {
        const aIndex = sizeOrder.indexOf(a)
        const bIndex = sizeOrder.indexOf(b)
        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })

    // Format response
    const response = {
      id: product.id,
      sku: product.sku,
      styleNumber: product.styleNumber,
      slug: product.slug,
      name: product.name,
      nameFr: product.nameFr,
      description: product.description,
      descriptionFr: product.descriptionFr,
      shortDescription: product.shortDescription,
      brand: product.brand,
      brandFr: product.brandFr,
      msrp: Number(product.msrp),
      priceMin: Number(product.priceMin),
      priceMax: Number(product.priceMax),
      primaryImageUrl: product.primaryImageUrl,
      images: product.images,
      printMethods: product.printMethods,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      tags: product.tags,
      availableSizes: uniqueSizes,
      availableColors: product.availableColors,
      category: product.category,
      supplier: product.supplier,
      variantsByColor: Object.values(variantsByColor),
      totalVariants: product.variants.length,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching blank product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blank product' },
      { status: 500 }
    )
  }
}
