import { Cart } from "@/types/cart";
import { Font } from "@/types/typefaces";
import { create } from "zustand";

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
