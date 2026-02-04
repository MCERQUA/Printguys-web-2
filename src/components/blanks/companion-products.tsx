'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Package, ChevronRight } from 'lucide-react'

interface CompanionProduct {
  id: string
  name: string
  slug: string
  brand: string
  priceMin: number
  primaryImageUrl: string | null
}

interface CompanionProductsProps {
  currentProductId: string
  categoryId?: string
  brand?: string
}

export function CompanionProducts({ currentProductId, categoryId, brand }: CompanionProductsProps) {
  const [products, setProducts] = useState<CompanionProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCompanions() {
      try {
        const params = new URLSearchParams()
        if (categoryId) params.append('categoryId', categoryId)
        if (brand) params.append('brand', brand)
        params.append('exclude', currentProductId)
        params.append('limit', '6')

        const response = await fetch(`/api/blanks?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products?.slice(0, 6) || [])
        }
      } catch (error) {
        console.error('Failed to fetch companion products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanions()
  }, [currentProductId, categoryId, brand])

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-lg aspect-square"></div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">You May Also Like</h2>
        <Link
          href={categoryId ? `/blanks?category=${categoryId}` : '/blanks'}
          className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/blanks/${product.slug}`}
            className="group bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
          >
            <div className="relative aspect-square bg-zinc-800">
              {product.primaryImageUrl ? (
                <Image
                  src={product.primaryImageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                  unoptimized
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-12 h-12 text-zinc-600" />
                </div>
              )}
            </div>
            <div className="p-3">
              <Badge variant="outline" className="text-xs border-zinc-700 text-gray-400 mb-2">
                {product.brand}
              </Badge>
              <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                {product.name}
              </h3>
              <p className="text-red-500 font-semibold mt-2 text-sm">
                From ${product.priceMin.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
