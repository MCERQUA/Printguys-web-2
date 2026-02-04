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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Category name with effect */}
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-light text-white text-center mb-4 tracking-tight group-hover:tracking-wider transition-all duration-500">
          {category.name}
        </h2>

        {/* Subtle product count */}
        <p className="text-lg md:text-xl text-white/60 mb-12 font-light tracking-wide">
          {category._count.products} Products
        </p>

        {/* CTA */}
        <div className="flex items-center gap-3 text-white text-lg font-medium tracking-wide group-hover:gap-6 transition-all duration-300">
          <span className="border-b border-white/30 pb-1">Explore Collection</span>
          <ArrowRight className="w-5 h-5" />
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
          <div className="w-full h-full flex flex-wrap items-center justify-center gap-16 text-9xl font-light text-white">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} className="opacity-20">PRINTGUYS</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center gap-2 text-red-500 px-6 py-3 mb-10 border border-red-500/30">
          <Shirt className="w-5 h-5" />
          <span className="text-sm font-medium tracking-widest uppercase">Premium Wholesale Blanks</span>
        </div>

        <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-light text-white mb-8 tracking-tighter leading-none">
          BLANKS
        </h1>

        <p className="text-xl md:text-2xl text-white/50 mb-16 max-w-2xl mx-auto font-light">
          Premium canvas for your creativity
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/blanks/catalog"
            className="inline-flex items-center gap-3 bg-white hover:bg-red-500 text-black hover:text-white px-10 py-5 text-lg font-medium transition-all duration-300"
          >
            View All Items
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <p className="mt-12 text-white/30 text-sm tracking-widest uppercase">
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
      <section className="relative py-32 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            Need Custom Printing?
          </h2>
          <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto font-light">
            We offer DTF transfers, screen printing, embroidery, and more. Get a quote for your custom apparel project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-red-500 text-black hover:text-white px-10 py-5 text-lg font-medium transition-all duration-300"
            >
              Get a Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/services/dtf"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white text-white px-10 py-5 text-lg font-medium transition-all duration-300"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
