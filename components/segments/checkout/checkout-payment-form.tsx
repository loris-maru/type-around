"use client";

import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  RiBankCardLine,
  RiLoader4Line,
  RiPaypalFill,
} from "react-icons/ri";
import {
  createPendingOrder,
  type PaymentMethod,
} from "@/actions/checkout";
import {
  capturePayPalOrderByPaypalId,
  createPayPalOrder,
} from "@/actions/paypal";
import { PAYPAL_CLIENT_ID } from "@/lib/paypal/client-config";
import {
  TOSS_CLIENT_KEY,
  getTossFailUrl,
  getTossSuccessUrl,
} from "@/lib/toss/client-config";
import { useCartStore } from "@/stores/cart";

type CheckoutPaymentFormProps = {
  onError: (msg: string) => void;
};

export default function CheckoutPaymentForm({
  onError,
}: CheckoutPaymentFormProps) {
  const cart = useCartStore((s) => s.cart);
  const clearCart = useCartStore((s) => s.clearCart);
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const orderName =
    cart.length === 1
      ? `${cart[0]?.typefaceName ?? ""} – ${cart[0]?.fullName ?? cart[0]?.name}`
      : `${cart[0]?.typefaceName ?? "Fonts"} and ${cart.length - 1} more`;

  const handleLocalPayment = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    onError("");

    try {
      const result = await createPendingOrder(
        cart,
        "local"
      );
      if (
        !result.success ||
        !result.orderId ||
        !result.downloadToken
      ) {
        onError(result.error ?? "Failed to create order");
        setIsProcessing(false);
        return;
      }

      const tossPayments =
        await loadTossPayments(TOSS_CLIENT_KEY);

      const successUrl = getTossSuccessUrl(
        result.orderId,
        result.downloadToken
      );
      const failUrl = getTossFailUrl();

      await tossPayments.requestPayment("CARD", {
        amount: result.totalAmount ?? total,
        orderId: result.orderId,
        orderName: result.orderName ?? orderName,
        successUrl,
        failUrl,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Payment failed";
      if (!msg.includes("PAY_PROCESS_CANCELED")) {
        onError(msg);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [cart, total, orderName, isProcessing, onError]);

  const handleGlobalPayment = useCallback(() => {
    setSelectedMethod("global");
  }, []);

  const handlePayPalCreateOrder = useCallback(async () => {
    const result = await createPendingOrder(cart, "global");
    if (!result.success || !result.orderId) {
      throw new Error(
        result.error ?? "Failed to create order"
      );
    }

    const paypalResult = await createPayPalOrder(
      result.orderId,
      cart,
      result.totalAmount ?? total
    );
    if (
      !paypalResult.success ||
      !paypalResult.paypalOrderId
    ) {
      throw new Error(
        paypalResult.error ??
          "Failed to create PayPal order"
      );
    }

    return paypalResult.paypalOrderId;
  }, [cart, total]);

  const handlePayPalApprove = useCallback(
    async (data: { orderID: string }) => {
      const captureResult =
        await capturePayPalOrderByPaypalId(data.orderID);
      if (
        captureResult.success &&
        captureResult.orderId &&
        captureResult.downloadToken
      ) {
        clearCart();
        window.location.href = `/order/${captureResult.orderId}?token=${captureResult.downloadToken}`;
      } else {
        onError(
          captureResult.error ?? "Payment capture failed"
        );
      }
    },
    [clearCart, onError]
  );

  const handlePayPalError = useCallback(
    (err: Record<string, unknown>) => {
      onError(
        (err as { message?: string })?.message ??
          "PayPal error"
      );
    },
    [onError]
  );

  return (
    <div className="flex flex-col gap-6">
      {!selectedMethod ? (
        <>
          <h2 className="font-bold font-ortank text-lg">
            Choose payment method
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleLocalPayment}
              disabled={isProcessing}
              className="flex flex-col items-center gap-3 rounded-xl border-2 border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0064FF]">
                <RiBankCardLine className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold font-ortank">
                  Local Payment
                </p>
                <p className="mt-1 font-whisper text-neutral-500 text-sm">
                  Toss, KakaoPay, Naver Pay, Card
                </p>
              </div>
              {isProcessing && (
                <RiLoader4Line className="h-5 w-5 animate-spin text-neutral-400" />
              )}
            </button>

            <button
              type="button"
              onClick={handleGlobalPayment}
              disabled={isProcessing}
              className="flex flex-col items-center gap-3 rounded-xl border-2 border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#003087]">
                <RiPaypalFill className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-bold font-ortank">
                  Global Payment
                </p>
                <p className="mt-1 font-whisper text-neutral-500 text-sm">
                  PayPal (International)
                </p>
              </div>
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setSelectedMethod(null)}
            className="self-start font-whisper text-neutral-500 text-sm underline hover:text-black"
          >
            ← Change payment method
          </button>

          {PAYPAL_CLIENT_ID && (
            <PayPalScriptProvider
              options={{
                clientId: PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                createOrder={handlePayPalCreateOrder}
                onApprove={({ orderID }) =>
                  handlePayPalApprove({ orderID })
                }
                onError={handlePayPalError}
                onCancel={() => setSelectedMethod(null)}
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "rect",
                  label: "paypal",
                }}
              />
            </PayPalScriptProvider>
          )}
        </div>
      )}

      <Link
        href="/studio"
        className="font-whisper text-neutral-500 text-sm underline hover:text-black"
      >
        ← Back to studio
      </Link>
    </div>
  );
}
