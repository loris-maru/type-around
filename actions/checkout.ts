"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createOrder } from "@/lib/firebase/orders";
import { APP_URL, getStripe } from "@/lib/stripe/config";
import type { CartItem } from "@/types/cart";
import type { OrderItem } from "@/types/order";

export type CheckoutResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export async function createCheckoutSession(
  items: CartItem[]
): Promise<CheckoutResult> {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (
      !userId ||
      !user?.emailAddresses?.[0]?.emailAddress
    ) {
      return {
        success: false,
        error: "sign_in_required",
      };
    }

    if (items.length === 0) {
      return {
        success: false,
        error: "Cart is empty",
      };
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

    const order = {
      id: orderId,
      userId,
      email: user.emailAddresses[0].emailAddress,
      items: orderItems,
      totalCents: totalWon,
      status: "pending" as const,
      downloadToken,
      createdAt: new Date().toISOString(),
    };

    await createOrder(order);

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "krw",
          product_data: {
            name: `${item.typefaceName || ""} – ${item.fullName || item.name}`,
            description: `Font: ${item.fullName || item.name}`,
          },
          unit_amount: Math.round(item.price),
        },
        quantity: 1,
      })),
      success_url: `${APP_URL}/order/${orderId}?token=${downloadToken}`,
      cancel_url: `${APP_URL}/studio`,
      metadata: { orderId },
      customer_email: user.emailAddresses[0].emailAddress,
    });

    if (!session.url) {
      return {
        success: false,
        error: "Failed to create checkout session",
      };
    }

    return {
      success: true,
      url: session.url,
    };
  } catch (err) {
    console.error("Checkout error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Checkout failed",
    };
  }
}
