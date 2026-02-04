'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useQuoteStore } from '@/stores/quote-store'
import {
  X,
  FileText,
  Trash2,
  Send,
  Package,
  CheckCircle,
} from 'lucide-react'

export function QuoteDrawer() {
  const {
    items,
    isOpen,
    closeQuote,
    removeItem,
    clearQuote,
    customerInfo,
    setCustomerInfo,
    getTotalItems,
    getTotalEstimate,
  } = useQuoteStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!customerInfo.name?.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!customerInfo.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Invalid email address'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitQuote = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerInfo,
          totalItems: getTotalItems(),
          totalEstimate: getTotalEstimate(),
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          clearQuote()
          closeQuote()
          setIsSubmitted(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Failed to submit quote:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalItems = getTotalItems()
  const totalEstimate = getTotalEstimate()

  return (
    <Sheet open={isOpen} onOpenChange={closeQuote}>
      <SheetContent className="w-full sm:max-w-lg bg-zinc-900 border-zinc-800 text-white flex flex-col">
        <SheetHeader className="border-b border-zinc-800 pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            Quote Request
            {items.length > 0 && (
              <Badge className="bg-red-600 ml-2">{items.length} items</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {isSubmitted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Quote Submitted!</h3>
            <p className="text-gray-400">
              We will get back to you within 24 hours with a detailed quote.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <p className="text-gray-400">Your quote is empty</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add items to get a custom quote
                  </p>
                </div>
              ) : (
                <>
                  {/* Quote Items */}
                  {items.map((item) => {
                    const itemQuantity = Object.values(item.sizes).reduce(
                      (sum, qty) => sum + qty,
                      0
                    )
                    return (
                      <div
                        key={item.id}
                        className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 bg-zinc-700 rounded-lg overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.productName}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-zinc-500" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-white text-sm truncate">
                                  {item.productName}
                                </h4>
                                <p className="text-xs text-gray-400">{item.brand}</p>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border border-zinc-600"
                                style={{ backgroundColor: item.colorHex || '#808080' }}
                              />
                              <span className="text-sm text-gray-300">{item.colorName}</span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1">
                              {Object.entries(item.sizes).map(([size, qty]) => (
                                <Badge
                                  key={size}
                                  variant="outline"
                                  className="text-xs border-zinc-600 text-gray-300"
                                >
                                  {size}: {qty}
                                </Badge>
                              ))}
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-sm text-gray-400">
                                {itemQuantity} pieces
                              </span>
                              <span className="text-sm font-medium text-white">
                                ~${item.estimatedPrice.toFixed(2)}
                              </span>
                            </div>

                            {item.decorationMethod && (
                              <Badge className="mt-2 bg-red-600/20 text-red-400 border border-red-600/50">
                                + {item.decorationMethod}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Notes input */}
                        <Input
                          placeholder="Add notes for this item..."
                          value={item.notes || ''}
                          onChange={(e) =>
                            useQuoteStore.getState().updateQuoteItem(item.id, {
                              notes: e.target.value,
                            })
                          }
                          className="mt-3 bg-zinc-700 border-zinc-600 text-white text-sm"
                        />
                      </div>
                    )
                  })}

                  {/* Customer Info */}
                  <div className="border-t border-zinc-800 pt-4 mt-4">
                    <h4 className="font-medium text-white mb-3">Your Information</h4>
                    <div className="space-y-3">
                      <div>
                        <Input
                          placeholder="Full Name *"
                          value={customerInfo.name || ''}
                          onChange={(e) => setCustomerInfo({ name: e.target.value })}
                          className={`bg-zinc-800 border-zinc-700 text-white ${
                            errors.name ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email Address *"
                          value={customerInfo.email || ''}
                          onChange={(e) => setCustomerInfo({ email: e.target.value })}
                          className={`bg-zinc-800 border-zinc-700 text-white ${
                            errors.email ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        value={customerInfo.phone || ''}
                        onChange={(e) => setCustomerInfo({ phone: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      <Input
                        placeholder="Company Name"
                        value={customerInfo.company || ''}
                        onChange={(e) => setCustomerInfo({ company: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      <textarea
                        placeholder="Additional notes or questions..."
                        value={customerInfo.message || ''}
                        onChange={(e) => setCustomerInfo({ message: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && (
              <SheetFooter className="border-t border-zinc-800 pt-4 flex-col gap-3">
                {/* Summary */}
                <div className="w-full bg-zinc-800 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Total Items:</span>
                    <span className="text-white font-medium">{totalItems} pieces</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Total:</span>
                    <span className="text-white font-medium">
                      ~${totalEstimate.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Final pricing will be provided in your quote
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={clearQuote}
                    className="flex-1 border-zinc-700 text-gray-300 hover:bg-zinc-800"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button
                    onClick={handleSubmitQuote}
                    disabled={isSubmitting || items.length === 0}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Request Quote'}
                  </Button>
                </div>
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
