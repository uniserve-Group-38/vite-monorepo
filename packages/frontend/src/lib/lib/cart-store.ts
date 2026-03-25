import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  serviceId: string
  serviceTitle: string
  servicePrice: string
  providerId: string
  providerName: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (serviceId: string) => void
  updateQuantity: (serviceId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(i => i.serviceId === item.serviceId)
        
        if (existingItem) {
          // Increase quantity if already in cart
          set({
            items: items.map(i =>
              i.serviceId === item.serviceId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          })
        } else {
          // Add new item
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },
      
      removeItem: (serviceId) => {
        set({ items: get().items.filter(i => i.serviceId !== serviceId) })
      },
      
      updateQuantity: (serviceId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(serviceId)
        } else {
          set({
            items: get().items.map(i =>
              i.serviceId === serviceId ? { ...i, quantity } : i
            )
          })
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      }
    }),
    {
      name: 'uniserve-cart-storage',
    }
  )
)
