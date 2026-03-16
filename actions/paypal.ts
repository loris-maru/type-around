"use server";

import * as paypal from "@paypal/checkout-server-sdk";
import { getStudioById } from "@/lib/firebase/studios";
import {
  getOrderById,
  updateOrderStatus,
} from "@/lib/firebase/orders";
import { sendOrderConfirmationEmail } from "@/lib/postmark";
import { KRW_TO_USD_RATE } from "@/constant/KRW_TO_USD_RATE";
import { getPayPalClient } from "@/lib/paypal/config";
import type { CartItem } from "@/types/cart";

export type CreatePayPalOrderResult = {
  success: boolean;
  paypalOrderId?: string;
  error?: string;
};

export type CapturePayPalOrderResult = {
  success: boolean;
  error?: string;
};

function krwToUsd(krw: number): string {
  const usd = krw / KRW_TO_USD_RATE;
  return usd.toFixed(2);
}

export async function createPayPalOrder(
  orderId: string,
  items: CartItem[],
  totalKrw: number
): Promise<CreatePayPalOrderResult> {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }

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
    const payeeEmail =
      studio?.paypalEmail?.trim() || undefined;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderId,
          description:
            items.length === 1
              ? `${items[0]?.typefaceName ?? ""} – ${items[0]?.fullName ?? items[0]?.name}`
              : `Font purchase (${items.length} items)`,
          amount: {
            currency_code: "USD",
            value: krwToUsd(totalKrw),
          },
          ...(payeeEmail && {
            payee: {
              email_address: payeeEmail,
            },
          }),
        },
      ],
    });

    const client = getPayPalClient();
    const response = await client.execute(request);

    if (response.statusCode !== 201) {
      return {
        success: false,
        error: "Failed to create PayPal order",
      };
    }

    const paypalOrderId = (
      response.result as { id?: string }
    )?.id;
    if (!paypalOrderId) {
      return {
        success: false,
        error: "No PayPal order ID returned",
      };
    }

    return { success: true, paypalOrderId };
  } catch (err) {
    console.error("PayPal create order error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to create PayPal order",
    };
  }
}

export async function capturePayPalOrderByPaypalId(
  paypalOrderId: string
): Promise<
  CapturePayPalOrderResult & {
    orderId?: string;
    downloadToken?: string;
  }
> {
  try {
    const client = getPayPalClient();
    const getRequest = new paypal.orders.OrdersGetRequest(
      paypalOrderId
    );
    const getResponse = await client.execute(getRequest);
    if (getResponse.statusCode !== 200) {
      return {
        success: false,
        error: "Failed to fetch PayPal order",
      };
    }
    const orderData = getResponse.result as {
      purchase_units?: Array<{ reference_id?: string }>;
    };
    const orderId =
      orderData.purchase_units?.[0]?.reference_id;
    if (!orderId) {
      return {
        success: false,
        error: "Order reference not found",
      };
    }
    const result = await capturePayPalOrder(
      orderId,
      paypalOrderId
    );
    if (result.success) {
      const order = await getOrderById(orderId);
      return {
        ...result,
        orderId,
        downloadToken: order?.downloadToken,
      };
    }
    return result;
  } catch (err) {
    console.error("PayPal capture error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Payment capture failed",
    };
  }
}

export async function capturePayPalOrder(
  orderId: string,
  paypalOrderId: string
): Promise<CapturePayPalOrderResult> {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status === "paid") {
      return { success: true };
    }

    const request = new paypal.orders.OrdersCaptureRequest(
      paypalOrderId
    );
    request.requestBody({});

    const client = getPayPalClient();
    const response = await client.execute(request);

    if (response.statusCode !== 201) {
      return {
        success: false,
        error: "PayPal capture failed",
      };
    }

    const result = response.result as { status?: string };
    if (result.status !== "COMPLETED") {
      return {
        success: false,
        error: "Payment was not completed",
      };
    }

    await updateOrderStatus(orderId, "paid", {
      paymentProvider: "paypal",
      paypalOrderId,
    });

    try {
      await sendOrderConfirmationEmail(
        order.email,
        orderId,
        order.downloadToken
      );
    } catch (emailErr) {
      console.error(
        "Failed to send order confirmation:",
        emailErr
      );
    }

    return { success: true };
  } catch (err) {
    console.error("PayPal capture error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Payment capture failed",
    };
  }
}
