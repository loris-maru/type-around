import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/stores/cart";
import type { CartItem } from "@/types/cart";
import { getCartItemKey } from "@/types/cart";

const mockCartItem: CartItem = {
  fontId: "font-1",
  typefaceName: "Ortank",
  typefaceSlug: "ortank",
  studioId: "studio-1",
  studioSlug: "sandoll",
  name: "Regular",
  fullName: "Ortank Regular",
  price: 50000,
  weight: 400,
  style: "normal",
  text: "Ortank Regular",
  salesFileUrls: ["https://example.com/font.woff2"],
};

describe("Cart store", () => {
  beforeEach(() => {
    useCartStore.setState({ cart: [] });
  });

  it("adds item to cart", () => {
    const { addToCart, cart } = useCartStore.getState();
    addToCart(mockCartItem);
    expect(cart).toHaveLength(0); // getState is before the update
    expect(useCartStore.getState().cart).toHaveLength(1);
    expect(useCartStore.getState().cart[0]).toMatchObject({
      fontId: "font-1",
      typefaceName: "Ortank",
      price: 50000,
    });
  });

  it("does not add duplicate items", () => {
    const { addToCart } = useCartStore.getState();
    addToCart(mockCartItem);
    addToCart(mockCartItem);
    expect(useCartStore.getState().cart).toHaveLength(1);
  });

  it("removes item from cart by key", () => {
    const { addToCart, removeFromCart } =
      useCartStore.getState();
    addToCart(mockCartItem);
    const key = getCartItemKey(mockCartItem);
    removeFromCart(key);
    expect(useCartStore.getState().cart).toHaveLength(0);
  });

  it("clears cart", () => {
    const { addToCart, clearCart } =
      useCartStore.getState();
    addToCart(mockCartItem);
    addToCart({
      ...mockCartItem,
      fontId: "font-2",
      typefaceSlug: "ortank",
    });
    clearCart();
    expect(useCartStore.getState().cart).toHaveLength(0);
  });
});

describe("getCartItemKey", () => {
  it("uses fontId and typefaceSlug when available", () => {
    expect(getCartItemKey(mockCartItem)).toBe(
      "font-1-ortank"
    );
  });

  it("falls back to name-weight-style when fontId missing", () => {
    const item = {
      ...mockCartItem,
      fontId: undefined,
      typefaceSlug: undefined,
    };
    expect(getCartItemKey(item)).toBe("Regular-400-normal");
  });
});
