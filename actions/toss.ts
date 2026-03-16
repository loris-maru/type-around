"use server";

import {
  getOrderById,
  updateOrderStatus,
} from "@/lib/firebase/orders";
import { sendOrderConfirmationEmail } from "@/lib/postmark";
import { getTossAuthHeader } from "@/lib/toss/config";

export type ConfirmTossPaymentResult = {
  success: boolean;
  error?: string;
};

export async function confirmTossPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<ConfirmTossPaymentResult> {
  try {
    const order = await getOrderById(orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status === "paid") {
      return { success: true };
    }

    if (order.totalCents !== amount) {
      return {
        success: false,
        error: "Amount mismatch – possible tampering",
      };
    }

    const authHeader = getTossAuthHeader();
    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    if (!response.ok) {
      const errData = await response
        .json()
        .catch(() => ({}));
      const errMsg =
        (errData as { message?: string })?.message ??
        response.statusText;
      return {
        success: false,
        error: errMsg || "Toss payment confirmation failed",
      };
    }

    const data = (await response.json()) as {
      status?: string;
    };
    if (data.status !== "DONE") {
      return {
        success: false,
        error: "Payment was not completed",
      };
    }

    await updateOrderStatus(orderId, "paid", {
      paymentProvider: "toss",
      tossPaymentKey: paymentKey,
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
    console.error("Toss confirm error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Payment confirmation failed",
    };
  }
}
