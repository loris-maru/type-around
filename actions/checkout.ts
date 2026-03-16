"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createOrder } from "@/lib/firebase/orders";
import type { CartItem } from "@/types/cart";
import type { OrderItem } from "@/types/order";

export type PaymentMethod = "local" | "global";

export type CreatePendingOrderResult = {
  success: boolean;
  orderId?: string;
  downloadToken?: string;
  totalAmount?: number;
  orderName?: string;
  error?: string;
};

export async function createPendingOrder(
  items: CartItem[],
  paymentMethod: PaymentMethod
): Promise<CreatePendingOrderResult> {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (
      !userId ||
      !user?.emailAddresses?.[0]?.emailAddress
    ) {
      return { success: false, error: "sign_in_required" };
    }

    if (items.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    const invalidItems = items.filter(
      (i) =>
        !i.fontId ||
        !i.typefaceSlug ||
        !i.studioId ||
        !i.studioSlug
    );
    if (invalidItems.length > 0) {
      return {
        success: false,
        error:
          "Some cart items are missing required data. Please remove and re-add them from the typeface page.",
      };
    }

    const orderId = crypto.randomUUID();
    const downloadToken = crypto.randomUUID();

    const orderItems: OrderItem[] = items.map((item) => ({
      fontId: item.fontId ?? "",
      typefaceName: item.typefaceName ?? "",
      typefaceSlug: item.typefaceSlug ?? "",
      studioId: item.studioId ?? "",
      studioSlug: item.studioSlug ?? "",
      fontName: item.name,
      fullName: item.fullName || item.name,
      price: item.price,
      salesFileUrls: item.salesFileUrls || [],
    }));

    const totalWon = Math.round(
      orderItems.reduce((sum, i) => sum + i.price, 0)
    );

    const orderName =
      items.length === 1
        ? `${items[0]?.typefaceName ?? ""} – ${items[0]?.fullName ?? items[0]?.name}`
        : `${items[0]?.typefaceName ?? "Fonts"} and ${items.length - 1} more`;

    const order = {
      id: orderId,
      userId,
      email: user.emailAddresses[0].emailAddress,
      items: orderItems,
      totalCents: totalWon,
      status: "pending" as const,
      paymentProvider: (paymentMethod === "local"
        ? "toss"
        : "paypal") as "toss" | "paypal",
      downloadToken,
      createdAt: new Date().toISOString(),
    };

    await createOrder(order);

    return {
      success: true,
      orderId,
      downloadToken,
      totalAmount: totalWon,
      orderName,
    };
  } catch (err) {
    console.error("Create order error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to create order",
    };
  }
}
