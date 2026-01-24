import { Font } from "./typefaces";

export type Cart = {
  cart: Font[];
  addToCart: (item: Font) => void;
  removeFromCart: (item: Font) => void;
  clearCart: () => void;
};
