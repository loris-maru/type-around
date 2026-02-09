import { create } from "zustand";
import type { Cart } from "@/types/cart";
import type { Font } from "@/types/typefaces";

export const useCartStore = create<Cart>((set) => ({
  cart: [],
  addToCart: (item: Font) =>
    set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (item: Font) =>
    set((state) => ({
      cart: state.cart.filter((i) => i !== item),
    })),
  clearCart: () => set({ cart: [] }),
}));
