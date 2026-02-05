import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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

// Map database slugs to image file names
const slugToImage: Record<string, string> = {
  'sanmar-t-shirts-activewear': 't-shirts-activewear',
  'sanmar-fleece': 'fleece',
  'sanmar-polos': 'polos',
  'sanmar-headwear': 'headwear',
  'sanmar-bags': 'bags',
  'sanmar-outerwear': 'outerwear',
  'sanmar-workwear': 'workwear',
  'sanmar-woven-shirts': 'woven-shirts',
  'sanmar-accessories': 'accessories',
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

function CategoryCard({ category }: { category: Category }) {
  const imageName = slugToImage[category.slug] || category.slug.replace('sanmar-', '')
  const imagePath = `/images/blanks/categories/${imageName}.jpg`

  return (
    <Link
      href={`/blanks/catalog?category=${category.slug}`}
      className="group relative w-full h-screen overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={imagePath}
          alt={category.name}
          fill
          className="object-cover"
          unoptimized
          priority={false}
        />
        {/* Light overlay - images should be visible */}
        <div className="absolute inset-0 bg-black/20" />
        {/* Gradient overlay at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Category name with Printguys brand style */}
        <h2 className="text-7xl md:text-9xl lg:text-[12rem] font-black text-white text-center mb-6 tracking-tighter uppercase leading-none drop-shadow-2xl group-hover:scale-105 transition-transform duration-500">
          {category.name}
        </h2>

        {/* Product count */}
        <p className="text-xl md:text-2xl text-white/90 mb-14 font-black tracking-widest uppercase">
          {category._count.products} Products
        </p>

        {/* CTA */}
        <div className="flex items-center gap-4 text-white text-xl font-black tracking-wider group-hover:gap-8 transition-all duration-300">
          <span className="border-b-4 border-red-500 pb-1 uppercase">Shop Now</span>
          <ArrowRight className="w-7 h-7 text-red-500" />
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
    </Link>
  )
}

function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full flex flex-wrap items-center justify-center gap-16 text-9xl font-black text-white">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} className="opacity-20">PRINTGUYS</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center gap-2 text-red-500 px-8 py-4 mb-12 border-2 border-red-500 bg-red-500/10">
          <Shirt className="w-6 h-6" />
          <span className="text-sm font-black tracking-[0.3em] uppercase">Premium Wholesale Blanks</span>
        </div>

        <h1 className="text-8xl md:text-10xl lg:text-[14rem] font-black text-white mb-10 tracking-tighter uppercase leading-none">
          BLANKS
        </h1>

        <p className="text-2xl md:text-3xl text-white/80 mb-20 max-w-2xl mx-auto font-bold tracking-wide uppercase">
          Premium Canvas For Your Creativity
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          <Link
            href="/blanks/catalog"
            className="inline-flex items-center gap-4 bg-red-500 hover:bg-red-600 text-white px-14 py-6 text-xl font-black uppercase tracking-wider transition-all duration-300 shadow-2xl shadow-red-500/50 hover:scale-105"
          >
            Shop All
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        <p className="mt-16 text-white/60 text-base font-bold tracking-[0.2em] uppercase">
          Gildan • Bella+Canvas • Next Level • Champion
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-1">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="w-full h-screen bg-zinc-950 animate-pulse" />
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
      <section className="relative py-40 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight uppercase">
            Need Custom Printing?
          </h2>
          <p className="text-2xl text-white/70 mb-16 max-w-3xl mx-auto font-bold tracking-wide uppercase">
            DTF Transfers • Screen Printing • Embroidery • More
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-14 py-6 text-xl font-black uppercase tracking-wider transition-all duration-300 shadow-xl shadow-red-500/30 hover:scale-105"
            >
              Get A Quote
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/services/dtf"
              className="inline-flex items-center gap-3 border-2 border-white/40 hover:border-white hover:bg-white/10 text-white px-14 py-6 text-xl font-black uppercase tracking-wider transition-all duration-300"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
