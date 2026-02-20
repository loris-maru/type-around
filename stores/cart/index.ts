import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart, CartItem } from "@/types/cart";
import { getCartItemKey } from "@/types/cart";

export const useCartStore = create<Cart>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item: CartItem) => {
        const key = getCartItemKey(item);
        const exists = get().cart.some(
          (i) => getCartItemKey(i) === key
        );
        if (!exists) {
          set((state) => ({ cart: [...state.cart, item] }));
        }
      },
      removeFromCart: (itemKey: string) =>
        set((state) => ({
          cart: state.cart.filter(
            (i) => getCartItemKey(i) !== itemKey
          ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "type-around-cart",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
