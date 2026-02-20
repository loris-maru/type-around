import { z } from "zod";

export const OrderItemSchema = z.object({
  fontId: z.string(),
  typefaceName: z.string(),
  typefaceSlug: z.string(),
  studioId: z.string(),
  studioSlug: z.string(),
  fontName: z.string(),
  fullName: z.string(),
  price: z.number(),
  salesFileUrls: z.array(z.string()).default([]),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  email: z.string().email(),
  items: z.array(OrderItemSchema),
  totalCents: z.number(),
  status: z
    .enum(["pending", "paid", "failed"])
    .default("pending"),
  stripePaymentIntentId: z.string().optional(),
  stripeSessionId: z.string().optional(),
  downloadToken: z.string(),
  createdAt: z.string(), // ISO
});

export type Order = z.infer<typeof OrderSchema>;
