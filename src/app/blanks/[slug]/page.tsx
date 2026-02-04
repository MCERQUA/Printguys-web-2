import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductConfigurator, ProductTabs, QuoteDrawer, CompanionProducts, type Product } from '@/components/blanks'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Fetch product data
async function getProduct(slug: string): Promise<Product | null> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/blanks/${slug}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch product')
    }

    return response.json()
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
