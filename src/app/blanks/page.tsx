import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Shirt, Package } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Shop Blank Apparel | Printguys - Premium Quality Blanks',
  description: 'Browse our catalog of premium blank apparel by category. T-Shirts, Hoodies, Polos, Headwear, and more from top suppliers.',
  keywords: [
    'blank apparel',
    'wholesale clothing',
    'blank t-shirts',
    'wholesale hoodies',
    'custom printing blanks',
    'Gildan',
    'Bella Canvas',
    'Next Level',
  ],
  openGraph: {
    title: 'Shop Blank Apparel | Printguys',
    description: 'Browse our catalog of premium blank apparel by category.',
    type: 'website',
    url: 'https://printguys.ca/blanks',
  },
}

// Category type
interface Category {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

// Fetch categories server-side
async function getCategories() {
  const categories = await prisma.blankCategory.findMany({
    where: {
      supplier: { code: 'SANMAR' },
      products: { some: { isActive: true } }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: {
            where: { isActive: true }
          }
        }
      }
    },
    orderBy: { position: 'asc' }
  })

  return categories
}

// Category image colors (brand-based gradients)
const categoryGradients: Record<string, string> = {
  'sanmar-t-shirts-activewear': 'from-red-900 via-black to-zinc-950',
  'sanmar-fleece': 'from-zinc-900 via-red-950 to-black',
  'sanmar-polos': 'from-black via-red-900 to-zinc-950',
  'sanmar-headwear': 'from-red-950 via-zinc-900 to-black',
  'sanmar-bags': 'from-zinc-950 via-black to-red-900',
  'sanmar-outerwear': 'from-black via-zinc-900 to-red-950',
  'sanmar-workwear': 'from-red-900 via-zinc-950 to-black',
  'sanmar-woven-shirts': 'from-zinc-900 via-black to-red-900',
  'sanmar-accessories': 'from-red-950 via-black to-zinc-950',
}

// Background pattern for each category
const categoryPatterns: Record<string, string> = {
  'sanmar-t-shirts-activewear': 'T-SHIRTS & ACTIVEWEAR',
  'sanmar-fleece': 'FLEECE',
  'sanmar-polos': 'POLOS',
  'sanmar-headwear': 'HEADWEAR',
  'sanmar-bags': 'BAGS',
  'sanmar-outerwear': 'OUTERWEAR',
  'sanmar-workwear': 'WORKWEAR',
  'sanmar-woven-shirts': 'WOVEN SHIRTS',
  'sanmar-accessories': 'ACCESSORIES',
}

function CategoryCard({ category }: { category: Category }) {
  const gradient = categoryGradients[category.slug] || 'from-black via-zinc-900 to-black'
  const pattern = categoryPatterns[category.slug] || category.name.toUpperCase()

  return (
    <Link
      href={`/blanks/catalog?category=${category.slug}`}
      className="group relative w-full h-screen overflow-hidden"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full flex flex-wrap items-center justify-center gap-8 text-9xl font-bold text-white">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i}>{pattern}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Category name */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center mb-4 group-hover:text-red-500 transition-colors duration-300">
          {category.name}
        </h2>

        {/* Product count */}
        <p className="text-xl md:text-2xl text-gray-400 mb-8">
          {category._count.products} Products
        </p>

        {/* CTA */}
        <div className="flex items-center gap-3 text-red-500 text-lg font-semibold group-hover:gap-5 transition-all duration-300">
          Shop Now
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
    </Link>
  )
}

function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-zinc-950">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full flex flex-wrap items-center justify-center gap-12 text-8xl font-bold text-red-600">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i}>PRINTGUYS</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-6 py-3 rounded-full mb-8">
          <Shirt className="w-6 h-6" />
          <span className="text-lg font-semibold">Premium Wholesale Blanks</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6">
          SHOP BLANKS
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Quality apparel from top suppliers. Choose your category below.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blanks/catalog"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            <Package className="w-5 h-5" />
            View All Items
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <p className="mt-8 text-gray-500 text-sm">
          Gildan • Bella+Canvas • Next Level • Champion
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
        <span className="text-sm">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-red-600 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-1">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="w-full h-screen bg-zinc-900 animate-pulse" />
      ))}
    </div>
  )
}

export default async function BlanksLandingPage() {
  const categories = await getCategories()

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Category Sections */}
      <Suspense fallback={<CategoriesSkeleton />}>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </Suspense>

      {/* Bottom CTA */}
      <section className="relative py-24 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Need Custom Printing?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            We offer DTF transfers, screen printing, embroidery, and more. Get a quote for your custom apparel project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Get a Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/services/dtf"
              className="inline-flex items-center gap-2 border border-gray-600 hover:bg-zinc-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
