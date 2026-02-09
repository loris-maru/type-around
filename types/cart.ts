import type { Font } from "./typefaces";

export type CartItem = Font & {
  typefaceName?: string;
};

export type Cart = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (fontName: string) => void;
  clearCart: () => void;
};
