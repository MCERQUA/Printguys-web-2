'use client'

import { useCartStore, CartItem as CartItemType } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore()

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      {item.designThumbnail && (
        <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
          <img
            src={item.designThumbnail}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{item.name}</h4>
        <p className="text-sm text-gray-500 capitalize">
          {item.service.replace('-', ' ')} • {item.color}
        </p>

        {Object.keys(item.sizes).length > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Sizes: {Object.entries(item.sizes)
              .filter(([_, qty]) => qty > 0)
              .map(([size, qty]) => `${size}(${qty})`)
              .join(', ')}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
