import { create } from "zustand";
import type { Cart, CartItem } from "@/types/cart";

export const useCartStore = create<Cart>((set, get) => ({
  cart: [],
  addToCart: (item: CartItem) => {
    const exists = get().cart.some(
      (i) =>
        i.name === item.name &&
        i.weight === item.weight &&
        i.style === item.style
    );
    if (!exists) {
      set((state) => ({ cart: [...state.cart, item] }));
    }
  },
  removeFromCart: (fontName: string) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.name !== fontName),
    })),
  clearCart: () => set({ cart: [] }),
}));
