import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductConfigurator, ProductTabs, QuoteDrawer, CompanionProducts, type Product } from '@/components/blanks'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ slug: string }>
}

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

// Fetch product data directly from Prisma (server component best practice)
async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await prisma.blankProduct.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug }
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
      return null
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
    return {
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
      availableColors: (product.availableColors as string[]) || [],
      category: product.category,
      supplier: product.supplier,
      variantsByColor: Object.values(variantsByColor),
      totalVariants: product.variants.length,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Product Not Found | PrintGuys',
      description: 'The product you are looking for could not be found.',
    }
  }

  const title = `${product.name} | ${product.brand} | PrintGuys`
  const description = product.shortDescription || product.description
    ? `${product.shortDescription || product.description?.slice(0, 150)}... Starting at $${product.priceMin.toFixed(2)}. Shop blank apparel at PrintGuys.`
    : `Shop ${product.name} by ${product.brand}. Starting at $${product.priceMin.toFixed(2)} per piece with volume discounts. Quality blank apparel from PrintGuys.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.primaryImageUrl
        ? [
            {
              url: product.primaryImageUrl,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.primaryImageUrl ? [product.primaryImageUrl] : undefined,
    },
  }
}

export default async function BlankProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  // Show 404 if product not found
  if (!product) {
    notFound()
  }

  // Check if product has variants
  if (!product.variantsByColor || product.variantsByColor.length === 0) {
    return (
      <main className="min-h-screen bg-black">
        {/* Breadcrumb */}
        <nav className="border-b border-zinc-800 bg-zinc-900/50">
          <div className="container mx-auto px-4 py-3">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <li>
                <Link
                  href="/blanks"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shop Blanks
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <li className="text-white font-medium">{product.name}</li>
            </ol>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Product Currently Unavailable
            </h1>
            <p className="text-gray-400 mb-6">
              This product is currently out of stock in all colors and sizes.
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/blanks">Browse Other Products</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <li>
              <Link
                href="/blanks"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Shop Blanks
              </Link>
            </li>
            {product.category && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <li>
                  <Link
                    href={`/blanks?category=${product.category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <li className="text-white font-medium truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Product Section */}
      <section className="container mx-auto px-4 py-8">
        <ProductConfigurator product={product} />
      </section>

      {/* Product Details Tabs */}
      <section className="container mx-auto px-4 py-8 border-t border-zinc-800">
        <ProductTabs product={product} />
      </section>

      {/* Companion Products */}
      <section className="container mx-auto px-4 py-8 border-t border-zinc-800">
        <CompanionProducts
          currentProductId={product.id}
          categoryId={product.category?.id}
          brand={product.brand}
        />
      </section>

      {/* Quote Drawer */}
      <QuoteDrawer />

      {/* JSON-LD Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description || product.shortDescription,
            image: product.primaryImageUrl,
            sku: product.sku,
            brand: {
              '@type': 'Brand',
              name: product.brand,
            },
            offers: {
              '@type': 'AggregateOffer',
              lowPrice: product.priceMin,
              highPrice: product.priceMax,
              priceCurrency: 'CAD',
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: 'PrintGuys',
              },
            },
            category: product.category?.name,
          }),
        }}
      />
    </main>
  )
}
