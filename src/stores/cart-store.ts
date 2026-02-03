import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  productType: string
  service: string  // dtf, screen-printing, embroidery, etc.
  quantity: number
  sizes: { [size: string]: number }  // { S: 5, M: 10, L: 5 }
  color: string
  unitPrice: number
  totalPrice: number
  designId?: string
  designThumbnail?: string
  customizations?: {
    frontDesign?: boolean
    backDesign?: boolean
    notes?: string
  }
  // Blank product fields (for S&S/SanMar products)
  blankProductId?: string
  blankVariantId?: string
  supplier?: string  // 'ss-activewear' | 'sanmar'
  isBlankProduct?: boolean
  colorName?: string
  colorHex?: string
  imageUrl?: string
  // Tier pricing info (for blank products)
  tierPricing?: {
    tier: string  // e.g., "1-11", "12-35", etc.
    pricePerUnit: number
  }
}

// Input type for adding blank products
export interface AddBlankItemInput {
  name: string
  blankProductId: string
  blankVariantId: string
  supplier: string
  colorName: string
  colorHex?: string
  imageUrl?: string
  sizes: { [size: string]: number }
  unitPrice: number
  tierPricing?: {
    tier: string
    pricePerUnit: number
  }
}

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  addBlankItem: (item: AddBlankItemInput) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateSizes: (id: string, sizes: { [size: string]: number }) => void
  updateBlankItemSizes: (id: string, sizes: { [size: string]: number }, unitPrice: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed
  totalItems: () => number
  subtotal: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`
        set((state) => ({
          items: [...state.items, { ...item, id }]
        }))
      },

      addBlankItem: (input) => {
        const id = `cart-blank-${Date.now()}-${Math.random().toString(36).slice(2)}`
        const quantity = Object.values(input.sizes).reduce((a, b) => a + b, 0)
        const totalPrice = quantity * input.unitPrice

        const cartItem: CartItem = {
          id,
          name: input.name,
          productType: 'blank-apparel',
          service: 'blank',
          quantity,
          sizes: input.sizes,
          color: input.colorName,
          unitPrice: input.unitPrice,
          totalPrice,
          // Blank product specific fields
          blankProductId: input.blankProductId,
          blankVariantId: input.blankVariantId,
          supplier: input.supplier,
          isBlankProduct: true,
          colorName: input.colorName,
          colorHex: input.colorHex,
          imageUrl: input.imageUrl,
          tierPricing: input.tierPricing,
        }

        set((state) => ({
          items: [...state.items, cartItem]
        }))
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }))
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
              : item
          )
        }))
      },

      updateSizes: (id, sizes) => {
        const totalQty = Object.values(sizes).reduce((a, b) => a + b, 0)
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  sizes,
                  quantity: totalQty,
                  totalPrice: item.unitPrice * totalQty
                }
              : item
          )
        }))
      },

      // Update blank item sizes with recalculated tier pricing
      updateBlankItemSizes: (id, sizes, unitPrice) => {
        const totalQty = Object.values(sizes).reduce((a, b) => a + b, 0)
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  sizes,
                  quantity: totalQty,
                  unitPrice,
                  totalPrice: unitPrice * totalQty
                }
              : item
          )
        }))
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
      itemCount: () => get().items.length,
    }),
    {
      name: 'printguys-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
)

// Helper hooks
export const useCartItems = () => useCartStore((state) => state.items)
export const useCartOpen = () => useCartStore((state) => state.isOpen)
export const useCartActions = () => useCartStore((state) => ({
  addItem: state.addItem,
  addBlankItem: state.addBlankItem,
  removeItem: state.removeItem,
  updateQuantity: state.updateQuantity,
  updateSizes: state.updateSizes,
  updateBlankItemSizes: state.updateBlankItemSizes,
  clearCart: state.clearCart,
  toggleCart: state.toggleCart,
  openCart: state.openCart,
  closeCart: state.closeCart,
}))

// Helper to check if cart item is a blank product
export const isBlankCartItem = (item: CartItem): boolean => {
  return item.isBlankProduct === true || item.service === 'blank'
}

// Helper to get blank items only
export const useBlankCartItems = () => useCartStore((state) =>
  state.items.filter(item => isBlankCartItem(item))
)

// Helper to get custom/design items only
export const useCustomCartItems = () => useCartStore((state) =>
  state.items.filter(item => !isBlankCartItem(item))
)
