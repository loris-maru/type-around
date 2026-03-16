"use client";

import { useAuth } from "@clerk/nextjs";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import CheckoutPaymentForm from "@/components/segments/checkout/checkout-payment-form";
import { useCartStore } from "@/stores/cart";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useAuth();
  const cart = useCartStore((s) => s.cart);
  const [error, setError] = useState<string | null>(null);

  const canCheckout = cart.every(
    (i) =>
      i.fontId &&
      i.typefaceSlug &&
      i.studioId &&
      i.studioSlug
  );
  const validationError = !canCheckout
    ? "Some items cannot be purchased. Please go back and re-add them from the typeface page."
    : null;

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push(
        `/sign-up?redirect_url=${encodeURIComponent("/checkout")}`
      );
      return;
    }

    if (cart.length === 0) {
      router.push("/studio");
      return;
    }
  }, [isLoaded, isSignedIn, cart, router]);

  const urlError =
    searchParams.get("error") === "toss_failed"
      ? "Payment was cancelled or failed. Please try again."
      : null;

  const displayError = validationError ?? error ?? urlError;

  if (!isLoaded || !isSignedIn || cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
        <p className="font-whisper text-neutral-600">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-8 px-6 py-12">
      <div>
        <h1 className="font-bold font-ortank text-2xl">
          Checkout
        </h1>
        <p className="mt-1 font-whisper text-neutral-500">
          Choose your payment method to complete your
          purchase.
        </p>
      </div>

      {displayError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-whisper text-red-800">
            {displayError}
          </p>
        </div>
      )}

      <CheckoutPaymentForm onError={setError} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
          <p className="font-whisper text-neutral-600">
            Loading…
          </p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
