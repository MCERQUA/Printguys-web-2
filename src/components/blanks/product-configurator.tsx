'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/stores/cart-store'
import {
  Star,
  ShoppingCart,
  Palette,
  Check,
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
} from 'lucide-react'

// Types for the API response
interface Variant {
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
}

interface ColorGroup {
  colorName: string
  colorNameFr: string | null
  hexCode: string | null
  pantoneCode: string | null
  imageUrl: string | null
  variants: Variant[]
}

interface Category {
  id: string
  name: string
  nameFr: string | null
  slug: string
  description: string | null
}

interface Supplier {
  id: string
  name: string
  code: string
  logoUrl: string | null
}

export interface Product {
  id: string
  sku: string
  styleNumber: string
  slug: string
  name: string
  nameFr: string | null
  description: string | null
  descriptionFr: string | null
  shortDescription: string | null
  brand: string
  brandFr: string | null
  msrp: number
  priceMin: number
  priceMax: number
  primaryImageUrl: string | null
  images: string[]
  printMethods: string[]
  isNew: boolean
  isFeatured: boolean
  tags: string[]
  availableSizes: string[]
  availableColors: string[]
  category: Category | null
  supplier: Supplier | null
  variantsByColor: ColorGroup[]
  totalVariants: number
  createdAt: string
  updatedAt: string
}

interface SizeQuantities {
  [size: string]: number
}

interface ProductConfiguratorProps {
  product: Product
}

// Pricing tier helper
function getPricingTier(
  quantity: number,
  caseQuantity: number
): { tier: string; description: string } {
  const casesOrdered = quantity / caseQuantity
  if (casesOrdered >= 10) {
    return { tier: 'price10Case', description: '10+ Cases' }
  } else if (quantity >= caseQuantity) {
    return { tier: 'priceCase', description: 'Case Qty' }
  }
  return { tier: 'price1', description: '1+ Pieces' }
}

function getVariantPrice(variant: Variant, tier: string): number {
  switch (tier) {
    case 'price10Case':
      return variant.price10Case
    case 'priceCase':
      return variant.priceCase
    default:
      return variant.price1
  }
}

// Helper function to determine if a color is light (for check icon visibility)
function isLightColor(hexCode: string | null): boolean {
  if (!hexCode) return false
  const hex = hexCode.replace('#', '')
  if (hex.length !== 6) return false
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

// Helper function to format print method names
function formatPrintMethod(method: string): string {
  const methodMap: Record<string, string> = {
    'screen-printing': 'Screen Printing',
    dtf: 'DTF Transfer',
    embroidery: 'Embroidery',
    sublimation: 'Sublimation',
    'heat-transfer': 'Heat Transfer',
    vinyl: 'Vinyl',
  }
  return methodMap[method] || method.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const router = useRouter()
  const addBlankItem = useCartStore((state) => state.addBlankItem)
  const openCart = useCartStore((state) => state.openCart)

  // Initialize size quantities
  const initialQuantities = useMemo(() => {
    const quantities: SizeQuantities = {}
    product.availableSizes.forEach((size) => {
      quantities[size] = 0
    })
    return quantities
  }, [product.availableSizes])

  // State
  const [selectedColor, setSelectedColor] = useState<ColorGroup>(
    product.variantsByColor[0]
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [sizeQuantities, setSizeQuantities] = useState<SizeQuantities>(initialQuantities)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Get images for current color selection
  const colorImages = useMemo(() => {
    const images: string[] = []
    if (selectedColor.imageUrl) {
      images.push(selectedColor.imageUrl)
    }
    // Add product primary image and other images as fallback
    if (product.primaryImageUrl && !images.includes(product.primaryImageUrl)) {
      images.push(product.primaryImageUrl)
    }
    if (product.images) {
      product.images.forEach((img) => {
        if (!images.includes(img)) {
          images.push(img)
        }
      })
    }
    return images
  }, [selectedColor, product.primaryImageUrl, product.images])

  // Calculate total quantity
  const totalQuantity = useMemo(() => {
    return Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0)
  }, [sizeQuantities])

  // Get current pricing tier
  const currentTier = useMemo(() => {
    if (selectedColor.variants.length === 0) {
      return { tier: 'price1', description: '1+ Pieces' }
    }
    const caseQuantity = selectedColor.variants[0]?.caseQuantity || 24
    return getPricingTier(totalQuantity, caseQuantity)
  }, [totalQuantity, selectedColor])

  // Calculate current unit price based on tier
  const currentUnitPrice = useMemo(() => {
    if (selectedColor.variants.length === 0) return 0
    // Get the price from first variant (they should all have same pricing)
    const variant = selectedColor.variants[0]
    return getVariantPrice(variant, currentTier.tier)
  }, [selectedColor, currentTier])

  // Calculate total price
  const totalPrice = useMemo(() => {
    return totalQuantity * currentUnitPrice
  }, [totalQuantity, currentUnitPrice])

  // Get pricing tiers for display
  const pricingTiers = useMemo(() => {
    if (selectedColor.variants.length === 0) return []
    const variant = selectedColor.variants[0]
    const caseQty = variant.caseQuantity || 24

    return [
      {
        label: '1+ Pieces',
        price: variant.price1,
        minQty: 1,
        isCurrent: currentTier.tier === 'price1',
      },
      {
        label: `Case (${caseQty}+)`,
        price: variant.priceCase,
        minQty: caseQty,
        isCurrent: currentTier.tier === 'priceCase',
      },
      {
        label: `10+ Cases (${caseQty * 10}+)`,
        price: variant.price10Case,
        minQty: caseQty * 10,
        isCurrent: currentTier.tier === 'price10Case',
      },
    ]
  }, [selectedColor, currentTier])

  // Handle color selection
  const handleColorSelect = useCallback(
    (color: ColorGroup) => {
      setSelectedColor(color)
      setSelectedImageIndex(0)
      // Reset quantities when changing color
      const resetQuantities: SizeQuantities = {}
      product.availableSizes.forEach((size) => {
        resetQuantities[size] = 0
      })
      setSizeQuantities(resetQuantities)
    },
    [product.availableSizes]
  )

  // Handle size quantity change
  const handleQuantityChange = useCallback((size: string, value: number) => {
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: Math.max(0, value),
    }))
  }, [])

  // Increment/decrement quantity
  const incrementQuantity = useCallback((size: string) => {
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: (prev[size] || 0) + 1,
    }))
  }, [])

  const decrementQuantity = useCallback((size: string) => {
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) - 1),
    }))
  }, [])

  // Check if size is available in selected color
  const isSizeAvailable = useCallback(
    (size: string): boolean => {
      return selectedColor.variants.some((v) => v.size === size && v.inStock)
    },
    [selectedColor]
  )

  // Get variant for selected size
  const getVariantForSize = useCallback(
    (size: string): Variant | undefined => {
      return selectedColor.variants.find((v) => v.size === size)
    },
    [selectedColor]
  )

  // Handle Add to Cart
  const handleAddToCart = useCallback(async () => {
    if (totalQuantity === 0) return

    setIsAddingToCart(true)

    // Filter out sizes with 0 quantity
    const sizesWithQuantity = Object.fromEntries(
      Object.entries(sizeQuantities).filter(([, qty]) => qty > 0)
    )

    // Get the first variant with quantity > 0 for the variant ID
    const firstSizeWithQty = Object.keys(sizesWithQuantity)[0]
    const variant = getVariantForSize(firstSizeWithQty)

    if (!variant) {
      setIsAddingToCart(false)
      return
    }

    addBlankItem({
      name: product.name,
      blankProductId: product.id,
      blankVariantId: variant.id,
      supplier: product.supplier?.code || 'sanmar',
      colorName: selectedColor.colorName,
      colorHex: selectedColor.hexCode || undefined,
      imageUrl: colorImages[0] || product.primaryImageUrl || undefined,
      sizes: sizesWithQuantity,
      unitPrice: currentUnitPrice,
      tierPricing: {
        tier: currentTier.description,
        pricePerUnit: currentUnitPrice,
      },
    })

    // Open cart drawer
    openCart()

    // Reset quantities after adding
    const resetQuantities: SizeQuantities = {}
    product.availableSizes.forEach((size) => {
      resetQuantities[size] = 0
    })
    setSizeQuantities(resetQuantities)

    setIsAddingToCart(false)
  }, [
    product,
    selectedColor,
    totalQuantity,
    sizeQuantities,
    getVariantForSize,
    addBlankItem,
    colorImages,
    currentUnitPrice,
    currentTier,
    openCart,
  ])

  // Handle Add Decoration (go to design studio)
  const handleAddDecoration = useCallback(() => {
    // Build query params for design studio
    const params = new URLSearchParams({
      productId: product.id,
      productName: product.name,
      color: selectedColor.colorName,
      colorHex: selectedColor.hexCode || '',
      image: colorImages[0] || product.primaryImageUrl || '',
    })

    router.push(`/design-studio?${params.toString()}`)
  }, [product, selectedColor, colorImages, router])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery - Left Column */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
          {colorImages[selectedImageIndex] ? (
            <Image
              src={colorImages[selectedImageIndex]}
              alt={`${product.name} - ${selectedColor.colorName}`}
              fill
              unoptimized
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-32 h-32 text-zinc-700" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-green-600 text-white">New</Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-red-600 text-white">Featured</Badge>
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {colorImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {colorImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index
                    ? 'border-red-500'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  unoptimized
                  className="object-contain p-1"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info - Right Column */}
      <div className="space-y-6">
        {/* Brand Badge */}
        {product.brand && (
          <Badge
            variant="outline"
            className="border-zinc-700 text-gray-300 mb-2"
          >
            {product.brand}
          </Badge>
        )}

        {/* Product Name */}
        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          {product.name}
        </h1>

        {/* Style Number */}
        <p className="text-sm text-gray-400">
          Style #{product.styleNumber} | SKU: {product.sku}
        </p>

        {/* Star Ratings Placeholder */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-5 h-5 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>
          <span className="text-gray-400 text-sm">(Customer reviews coming soon)</span>
        </div>

        {/* Price Display */}
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-3xl font-bold text-red-500">
              ${currentUnitPrice.toFixed(2)}
            </span>
            <span className="text-gray-400">per piece</span>
            {currentTier.tier !== 'price1' && (
              <Badge className="bg-green-600 text-white ml-2">
                {currentTier.description} Price
              </Badge>
            )}
          </div>

          {/* Tier Pricing Display */}
          <div className="space-y-2">
            <p className="text-sm text-gray-400 font-medium">Volume Pricing:</p>
            <div className="grid grid-cols-3 gap-2">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.label}
                  className={`p-2 rounded-lg text-center transition-colors ${
                    tier.isCurrent
                      ? 'bg-red-600/20 border border-red-500'
                      : 'bg-zinc-800 border border-zinc-700'
                  }`}
                >
                  <p className="text-xs text-gray-400">{tier.label}</p>
                  <p
                    className={`font-bold ${
                      tier.isCurrent ? 'text-red-500' : 'text-white'
                    }`}
                  >
                    ${tier.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Color Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white">
              Color:{' '}
              <span className="text-red-500">{selectedColor.colorName}</span>
            </label>
            <span className="text-sm text-gray-400">
              {product.variantsByColor.length} colors available
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.variantsByColor.map((color) => (
              <button
                key={color.colorName}
                onClick={() => handleColorSelect(color)}
                className={`group relative w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor.colorName === color.colorName
                    ? 'border-red-500 ring-2 ring-red-500/50'
                    : 'border-zinc-600 hover:border-zinc-400'
                }`}
                style={{
                  backgroundColor: color.hexCode || '#808080',
                }}
                title={color.colorName}
              >
                {selectedColor.colorName === color.colorName && (
                  <Check
                    className={`absolute inset-0 m-auto w-5 h-5 ${
                      isLightColor(color.hexCode) ? 'text-black' : 'text-white'
                    }`}
                  />
                )}

                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {color.colorName}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Quantity Grid */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">
            Select Sizes & Quantities
          </label>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="divide-y divide-zinc-800">
              {product.availableSizes.map((size) => {
                const variant = getVariantForSize(size)
                const isAvailable = isSizeAvailable(size)
                const quantity = sizeQuantities[size] || 0

                return (
                  <div
                    key={size}
                    className={`grid grid-cols-[1fr_auto] items-center px-4 py-3 ${
                      !isAvailable ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-medium ${
                          isAvailable ? 'text-white' : 'text-gray-500'
                        }`}
                      >
                        {size}
                      </span>
                      {!isAvailable && (
                        <Badge variant="outline" className="text-xs border-red-500/50 text-red-400">
                          Out of Stock
                        </Badge>
                      )}
                      {variant && isAvailable && variant.stockLevel !== null && variant.stockLevel < 50 && (
                        <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-400">
                          Low Stock
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(size)}
                        disabled={!isAvailable || quantity === 0}
                        className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <Input
                        type="number"
                        min={0}
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(size, parseInt(e.target.value) || 0)
                        }
                        disabled={!isAvailable}
                        className="w-16 text-center bg-zinc-800 border-zinc-700 text-white"
                      />

                      <button
                        onClick={() => incrementQuantity(size)}
                        disabled={!isAvailable}
                        className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Total Quantity:</span>
            <span className="text-xl font-bold text-white">
              {totalQuantity} pieces
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Estimated Total:</span>
            <span className="text-2xl font-bold text-red-500">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          {totalQuantity > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              @ ${currentUnitPrice.toFixed(2)}/piece ({currentTier.description})
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleAddToCart}
            disabled={totalQuantity === 0 || isAddingToCart}
            className="w-full h-14 text-lg font-bold bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {isAddingToCart
              ? 'Adding...'
              : totalQuantity === 0
              ? 'Select Sizes to Add'
              : `Add to Cart - $${totalPrice.toFixed(2)}`}
          </Button>

          <Button
            onClick={handleAddDecoration}
            variant="outline"
            className="w-full h-12 font-medium border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
          >
            <Palette className="w-5 h-5 mr-2" />
            Add Custom Decoration
          </Button>
        </div>

        {/* Product Features */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
          <div className="text-center">
            <Truck className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Fast Shipping</p>
          </div>
          <div className="text-center">
            <Shield className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Quality Guarantee</p>
          </div>
          <div className="text-center">
            <Package className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Bulk Discounts</p>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="pt-6 border-t border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-3">Product Description</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-line text-sm">{product.description}</p>
            </div>
          </div>
        )}

        {/* Print Methods */}
        {product.printMethods && product.printMethods.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              Compatible Decoration Methods
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.printMethods.map((method) => (
                <Badge
                  key={method}
                  variant="outline"
                  className="border-zinc-700 text-gray-300"
                >
                  {formatPrintMethod(method)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-zinc-800 text-gray-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
