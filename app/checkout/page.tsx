"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createCheckoutSession } from "@/actions/checkout";
import { useCartStore } from "@/stores/cart";

function CheckoutContent() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const cart = useCartStore((s) => s.cart);
  const [asyncError, setAsyncError] = useState<
    string | null
  >(null);

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
  const error = validationError ?? asyncError;

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

    if (!canCheckout) return;

    createCheckoutSession(cart).then((result) => {
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setAsyncError(result.error ?? "Checkout failed");
      }
    });
  }, [isLoaded, isSignedIn, cart, canCheckout, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-bold font-ortank text-xl">
          Checkout failed
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
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
        <p className="font-whisper text-neutral-600">
          Redirecting to payment…
        </p>
      </div>
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
