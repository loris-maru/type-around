import { describe, it, expect } from "vitest";
import type { Order, OrderItem } from "@/types/order";
import { OrderSchema } from "@/types/order";

describe("Order types", () => {
  const validOrderItem: OrderItem = {
    fontId: "font-1",
    typefaceName: "Ortank",
    typefaceSlug: "ortank",
    studioId: "studio-1",
    studioSlug: "sandoll",
    fontName: "Regular",
    fullName: "Ortank Regular",
    price: 50000,
    salesFileUrls: ["https://example.com/font.woff2"],
  };

  const validOrder: Order = {
    id: "order-123",
    userId: "user-1",
    email: "buyer@example.com",
    items: [validOrderItem],
    totalCents: 50000,
    status: "paid",
    downloadToken: "token-abc",
    createdAt: new Date().toISOString(),
  };

  it("validates valid order", () => {
    const result = OrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it("rejects order with invalid email", () => {
    const invalid = {
      ...validOrder,
      email: "not-an-email",
    };
    const result = OrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects order with invalid status", () => {
    const invalid = { ...validOrder, status: "invalid" };
    const result = OrderSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("accepts order with empty salesFileUrls", () => {
    const item = { ...validOrderItem, salesFileUrls: [] };
    const order = { ...validOrder, items: [item] };
    const result = OrderSchema.safeParse(order);
    expect(result.success).toBe(true);
  });
});
