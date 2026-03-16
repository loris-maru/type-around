"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { RiLoader4Line } from "react-icons/ri";
import { confirmTossPayment } from "@/actions/toss";
import { useCartStore } from "@/stores/cart";

function SuccessContent() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState<
    "confirming" | "success" | "error"
  >("confirming");
  const [error, setError] = useState<string | null>(null);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amountStr = searchParams.get("amount");
  const token = searchParams.get("token");
  const provider = searchParams.get("provider");

  const validationError = (() => {
    if (
      provider !== "toss" ||
      !paymentKey ||
      !orderId ||
      !amountStr
    ) {
      return "Invalid success URL – missing payment data.";
    }
    const amount = parseInt(amountStr, 10);
    if (Number.isNaN(amount)) return "Invalid amount.";
    return null;
  })();

  const canConfirm =
    !validationError && paymentKey && orderId && amountStr;

  useEffect(() => {
    if (!canConfirm) return;

    const amount = parseInt(amountStr, 10);
    confirmTossPayment(paymentKey, orderId, amount).then(
      (result) => {
        if (result.success) {
          clearCart();
          setStatus("success");
          if (token) {
            window.location.href = `/order/${orderId}?token=${token}`;
          }
        } else {
          setStatus("error");
          setError(
            result.error ?? "Payment confirmation failed."
          );
        }
      }
    );
  }, [
    canConfirm,
    paymentKey,
    orderId,
    amountStr,
    token,
    clearCart,
  ]);

  if (validationError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-bold font-ortank text-xl">
          Payment confirmation failed
        </h1>
        <p className="text-center font-whisper text-neutral-600">
          {validationError}
        </p>
        <Link
          href="/studio"
          className="rounded-lg bg-black px-6 py-3 font-whisper text-white"
        >
          Back to studio
        </Link>
      </div>
    );
  }

  if (status === "confirming") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <RiLoader4Line className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="font-whisper text-neutral-600">
          Confirming your payment…
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-bold font-ortank text-xl">
          Payment confirmation failed
        </h1>
        <p className="text-center font-whisper text-neutral-600">
          {error}
        </p>
        <Link
          href="/studio"
          className="rounded-lg bg-black px-6 py-3 font-whisper text-white"
        >
          Back to studio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      <p className="font-whisper text-neutral-600">
        Redirecting to your download…
      </p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
          <RiLoader4Line className="h-8 w-8 animate-spin text-neutral-400" />
          <p className="font-whisper text-neutral-600">
            Loading…
          </p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
