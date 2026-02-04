'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QuoteItem {
  id: string
  productId: string
  productName: string
  styleNumber: string
  brand: string
  colorName: string
  colorHex?: string
  imageUrl?: string
  sizes: { [size: string]: number }
  estimatedPrice: number
  notes?: string
  decorationMethod?: string
  addedAt: Date
}

interface QuoteState {
  items: QuoteItem[]
  isOpen: boolean
  customerInfo: {
    name?: string
    email?: string
    phone?: string
    company?: string
    message?: string
  }
  addQuoteItem: (item: Omit<QuoteItem, 'id' | 'addedAt'>) => void
  updateQuoteItem: (id: string, updates: Partial<QuoteItem>) => void
  removeItem: (id: string) => void
  clearQuote: () => void
  toggleQuote: () => void
  openQuote: () => void
  closeQuote: () => void
  setCustomerInfo: (info: Partial<QuoteState['customerInfo']>) => void
  getTotalItems: () => number
  getTotalEstimate: () => number
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      customerInfo: {},

      addQuoteItem: (item) => {
        const id = `quote-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        set((state) => ({
          items: [
            ...state.items,
            {
              ...item,
              id,
              addedAt: new Date(),
            },
          ],
        }))
      },

      updateQuoteItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      clearQuote: () => {
        set({ items: [], customerInfo: {} })
      },

      toggleQuote: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      openQuote: () => {
        set({ isOpen: true })
      },

      closeQuote: () => {
        set({ isOpen: false })
      },

      setCustomerInfo: (info) => {
        set((state) => ({
          customerInfo: { ...state.customerInfo, ...info },
        }))
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const itemTotal = Object.values(item.sizes).reduce((sum, qty) => sum + qty, 0)
          return total + itemTotal
        }, 0)
      },

      getTotalEstimate: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.estimatedPrice, 0)
      },
    }),
    {
      name: 'printguys-quote-storage',
      partialize: (state) => ({
        items: state.items,
        customerInfo: state.customerInfo,
      }),
    }
  )
)
