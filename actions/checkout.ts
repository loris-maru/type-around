"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createOrder } from "@/lib/firebase/orders";
import { getStudioById } from "@/lib/firebase/studios";
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

    // Stripe Connect: if all items from same studio with connected Stripe, use destination charge
    const studioIds = [
      ...new Set(
        items.map((i) => i.studioId).filter(Boolean)
      ),
    ];
    const singleStudioId =
      studioIds.length === 1 ? studioIds[0] : null;
    const studio = singleStudioId
      ? await getStudioById(singleStudioId)
      : null;
    const stripeAccountId =
      studio?.stripeAccountId || undefined;

    const baseParams = {
      mode: "payment" as const,
      payment_method_types: ["card" as const],
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
    };

    const session = stripeAccountId
      ? await stripe.checkout.sessions.create({
          ...baseParams,
          payment_intent_data: {
            transfer_data: { destination: stripeAccountId },
          },
        })
      : await stripe.checkout.sessions.create(baseParams);

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
