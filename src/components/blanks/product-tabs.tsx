'use client'

import { useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  ListChecks,
  Ruler,
  DollarSign,
  Scale,
  Shirt,
  Droplets,
  Sparkles,
} from 'lucide-react'
import type { Product } from './product-configurator'

interface ProductTabsProps {
  product: Product
}

// Parse specifications from HTML description
function parseSpecifications(description: string | null): {
  material?: string
  weight?: string
  features: string[]
  careInstructions: string[]
} {
  if (!description) return { features: [], careInstructions: [] }

  const specs: { material?: string; weight?: string; features: string[]; careInstructions: string[] } = {
    features: [],
    careInstructions: [],
  }

  // Extract weight (e.g., "5.3 oz", "10.8-oz")
  const weightMatch = description.match(/(\d+\.?\d*)\s*-?\s*(oz|gsm|g\/m2)/i)
  if (weightMatch) {
    specs.weight = `${weightMatch[1]} ${weightMatch[2]}`
  }

  // Extract material composition
  const materialPatterns = [
    /(\d+%?\s*(?:ring\s*spun\s*)?cotton)/gi,
    /(\d+\/\d+\s*(?:poly|cotton|blend))/gi,
    /(100%\s*\w+)/gi,
    /(\d+%\s*\w+,?\s*\d+%\s*\w+)/gi,
  ]

  for (const pattern of materialPatterns) {
    const match = description.match(pattern)
    if (match) {
      specs.material = match[0].trim()
      break
    }
  }

  // Extract bullet point features from HTML
  const bulletMatch = description.match(/<li>(.*?)<\/li>/gi)
  if (bulletMatch) {
    specs.features = bulletMatch
      .map((item) => item.replace(/<\/?li>/gi, '').replace(/<[^>]+>/g, '').trim())
      .filter((item) => item.length > 0)
  }

  // Extract care instructions
  const careKeywords = ['wash', 'dry', 'iron', 'bleach', 'tumble']
  specs.careInstructions = specs.features.filter((feature) =>
    careKeywords.some((keyword) => feature.toLowerCase().includes(keyword))
  )

  // Remove care instructions from features
  specs.features = specs.features.filter(
    (feature) => !specs.careInstructions.includes(feature)
  )

  return specs
}

// Size chart data based on common apparel sizing
const SIZE_CHARTS: Record<string, Record<string, { chest: string; length: string; sleeve?: string }>> = {
  unisex: {
    XS: { chest: '31-34"', length: '27"', sleeve: '31.5"' },
    S: { chest: '34-37"', length: '28"', sleeve: '32.5"' },
    M: { chest: '38-41"', length: '29"', sleeve: '33.5"' },
    L: { chest: '42-45"', length: '30"', sleeve: '34.5"' },
    XL: { chest: '46-49"', length: '31"', sleeve: '35.5"' },
    '2XL': { chest: '50-53"', length: '32"', sleeve: '36.5"' },
    '3XL': { chest: '54-57"', length: '33"', sleeve: '37.5"' },
    '4XL': { chest: '58-61"', length: '34"', sleeve: '38.5"' },
    '5XL': { chest: '62-65"', length: '35"', sleeve: '39.5"' },
  },
}

export function ProductTabs({ product }: ProductTabsProps) {
  const specifications = useMemo(
    () => parseSpecifications(product.description),
    [product.description]
  )

  // Get pricing tiers from first color variant
  const pricingInfo = useMemo(() => {
    if (!product.variantsByColor?.[0]?.variants?.[0]) return null
    const variant = product.variantsByColor[0].variants[0]
    return {
      msrp: product.msrp,
      price1: variant.price1,
      priceCase: variant.priceCase,
      price10Case: variant.price10Case,
      caseQuantity: variant.caseQuantity,
    }
  }, [product])

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="flex flex-wrap gap-1">
        <TabsTrigger value="description" className="gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Description</span>
        </TabsTrigger>
        <TabsTrigger value="specifications" className="gap-2">
          <ListChecks className="w-4 h-4" />
          <span className="hidden sm:inline">Specifications</span>
        </TabsTrigger>
        <TabsTrigger value="sizing" className="gap-2">
          <Ruler className="w-4 h-4" />
          <span className="hidden sm:inline">Size Chart</span>
        </TabsTrigger>
        <TabsTrigger value="pricing" className="gap-2">
          <DollarSign className="w-4 h-4" />
          <span className="hidden sm:inline">Volume Pricing</span>
        </TabsTrigger>
      </TabsList>

      {/* Description Tab */}
      <TabsContent value="description" className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Product Description</h3>
        {product.description ? (
          <div
            className="prose prose-invert max-w-none prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-ul:list-disc prose-ul:pl-6"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : (
          <p className="text-gray-400">No description available for this product.</p>
        )}

        {/* Print Methods */}
        {product.printMethods && product.printMethods.length > 0 && (
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <h4 className="text-lg font-semibold text-white mb-3">
              Compatible Decoration Methods
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.printMethods.map((method) => (
                <Badge
                  key={method}
                  variant="outline"
                  className="border-red-500/50 text-red-400"
                >
                  {method.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      {/* Specifications Tab */}
      <TabsContent value="specifications" className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Product Specifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Stats</h4>

            <div className="space-y-3">
              {specifications.material && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                  <Shirt className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-400">Material</p>
                    <p className="text-white font-medium">{specifications.material}</p>
                  </div>
                </div>
              )}

              {specifications.weight && (
                <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                  <Scale className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-400">Weight</p>
                    <p className="text-white font-medium">{specifications.weight}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                <Droplets className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">Available Colors</p>
                  <p className="text-white font-medium">{product.availableColors?.length || 0} colors</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                <Ruler className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-400">Size Range</p>
                  <p className="text-white font-medium">
                    {product.availableSizes?.[0]} - {product.availableSizes?.[product.availableSizes.length - 1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Features</h4>
            {specifications.features.length > 0 ? (
              <ul className="space-y-2">
                {specifications.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <Sparkles className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Feature details not available.</p>
            )}
          </div>
        </div>

        {/* Brand Info */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-400">Brand</p>
              <p className="text-white font-semibold">{product.brand}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Style Number</p>
              <p className="text-white font-semibold">#{product.styleNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">SKU</p>
              <p className="text-white font-semibold">{product.sku}</p>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Size Chart Tab */}
      <TabsContent value="sizing" className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Size Chart</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="py-3 px-4 text-gray-400 font-medium">Size</th>
                <th className="py-3 px-4 text-gray-400 font-medium">Chest</th>
                <th className="py-3 px-4 text-gray-400 font-medium">Length</th>
                <th className="py-3 px-4 text-gray-400 font-medium">Sleeve</th>
                <th className="py-3 px-4 text-gray-400 font-medium">Available</th>
              </tr>
            </thead>
            <tbody>
              {product.availableSizes?.map((size) => {
                const sizeData = SIZE_CHARTS.unisex[size]
                return (
                  <tr key={size} className="border-b border-zinc-800">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white">{size}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {sizeData?.chest || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {sizeData?.length || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {sizeData?.sleeve || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-600/20 text-green-400 border border-green-600/50">
                        In Stock
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          * Measurements are approximate and may vary slightly. Please refer to brand-specific size charts for exact measurements.
        </p>
      </TabsContent>

      {/* Pricing Tab */}
      <TabsContent value="pricing" className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Volume Pricing</h3>

        {pricingInfo && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-800 rounded-lg p-4 text-center border border-zinc-700">
                <p className="text-sm text-gray-400 mb-1">1+ Pieces</p>
                <p className="text-2xl font-bold text-white">
                  ${pricingInfo.price1.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">per piece</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4 text-center border border-red-500/50 relative">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600">
                  Popular
                </Badge>
                <p className="text-sm text-gray-400 mb-1">Case Qty ({pricingInfo.caseQuantity}+)</p>
                <p className="text-2xl font-bold text-red-500">
                  ${pricingInfo.priceCase.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">per piece</p>
                <p className="text-xs text-green-400 mt-1">
                  Save {((1 - pricingInfo.priceCase / pricingInfo.price1) * 100).toFixed(0)}%
                </p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4 text-center border border-zinc-700">
                <p className="text-sm text-gray-400 mb-1">10+ Cases ({pricingInfo.caseQuantity * 10}+)</p>
                <p className="text-2xl font-bold text-white">
                  ${pricingInfo.price10Case.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">per piece</p>
                <p className="text-xs text-green-400 mt-1">
                  Save {((1 - pricingInfo.price10Case / pricingInfo.price1) * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Pricing Breakdown</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="py-2 text-left text-gray-400">Quantity</th>
                    <th className="py-2 text-right text-gray-400">Price/Unit</th>
                    <th className="py-2 text-right text-gray-400">Example Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-700/50">
                    <td className="py-2 text-gray-300">1-{pricingInfo.caseQuantity - 1} pieces</td>
                    <td className="py-2 text-right text-white">${pricingInfo.price1.toFixed(2)}</td>
                    <td className="py-2 text-right text-gray-400">
                      ${(pricingInfo.price1 * 12).toFixed(2)} (12 pcs)
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="py-2 text-gray-300">{pricingInfo.caseQuantity}-{pricingInfo.caseQuantity * 10 - 1} pieces</td>
                    <td className="py-2 text-right text-white">${pricingInfo.priceCase.toFixed(2)}</td>
                    <td className="py-2 text-right text-gray-400">
                      ${(pricingInfo.priceCase * pricingInfo.caseQuantity).toFixed(2)} ({pricingInfo.caseQuantity} pcs)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-300">{pricingInfo.caseQuantity * 10}+ pieces</td>
                    <td className="py-2 text-right text-white">${pricingInfo.price10Case.toFixed(2)}</td>
                    <td className="py-2 text-right text-gray-400">
                      ${(pricingInfo.price10Case * pricingInfo.caseQuantity * 10).toFixed(2)} ({pricingInfo.caseQuantity * 10} pcs)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-gray-400">
              * Prices shown are for blank garments only. Decoration (printing, embroidery) is priced separately.
              Contact us for custom quotes on large orders.
            </p>
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}
