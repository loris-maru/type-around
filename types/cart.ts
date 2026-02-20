import type { Font } from "./typefaces";

export type CartItem = Font & {
  typefaceName?: string;
  /** Required for checkout: font id from studio typeface */
  fontId?: string;
  /** Required for checkout: typeface slug for lookup */
  typefaceSlug?: string;
  /** Required for checkout: studio id */
  studioId?: string;
  /** Required for checkout: studio slug for lookup */
  studioSlug?: string;
  /** Sales file URLs for download (from studio font) */
  salesFileUrls?: string[];
};

export type Cart = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemKey: string) => void;
  clearCart: () => void;
};

/** Unique key for cart item (for remove/dedup) */
export function getCartItemKey(item: CartItem): string {
  if (item.fontId && item.typefaceSlug) {
    return `${item.fontId}-${item.typefaceSlug}`;
  }
  return `${item.name}-${item.weight}-${item.style}`;
}
