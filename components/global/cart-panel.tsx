"use client";

import { useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  RiCloseLine,
  RiDeleteBinLine,
  RiLoader4Line,
} from "react-icons/ri";
import { createCheckoutSession } from "@/actions/checkout";
import { useCartStore } from "@/stores/cart";
import { getCartItemKey } from "@/types/cart";

export default function CartPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const cart = useCartStore((s) => s.cart);
  const removeFromCart = useCartStore(
    (s) => s.removeFromCart
  );
  const clearCart = useCartStore((s) => s.clearCart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<
    string | null
  >(null);

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const canCheckout = cart.every(
    (i) =>
      i.fontId &&
      i.typefaceSlug &&
      i.studioId &&
      i.studioSlug
  );

  const handleCheckout = useCallback(async () => {
    if (!canCheckout) {
      setCheckoutError(
        "Some items cannot be purchased. Please remove them and re-add from the typeface page."
      );
      return;
    }
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      if (!isSignedIn) {
        router.push(
          `/sign-up?redirect_url=${encodeURIComponent("/checkout")}`
        );
        onClose();
        return;
      }
      const result = await createCheckoutSession(cart);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setCheckoutError(result.error || "Checkout failed");
      }
    } finally {
      setIsCheckingOut(false);
    }
  }, [cart, canCheckout, isSignedIn, router, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 35,
          }}
          className="fixed top-0 right-0 left-0 z-35 rounded-b-2xl border-neutral-200 border-b bg-white shadow-lg"
        >
          <div className="mx-auto w-full max-w-3xl px-8 pt-16 pb-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold font-ortank text-xl">
                Cart ({cart.length})
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-black"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Items */}
            {cart.length === 0 ? (
              <p className="py-8 text-center font-normal font-whisper text-neutral-400 text-sm">
                Your cart is empty
              </p>
            ) : (
              <>
                <div className="flex flex-col divide-y divide-neutral-100">
                  {cart.map((item) => (
                    <div
                      key={getCartItemKey(item)}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        {item.typefaceName && (
                          <span className="font-normal font-ortank text-neutral-700 text-sm">
                            {item.typefaceName}
                          </span>
                        )}
                        <span className="font-bold font-ortank text-black text-xl">
                          {item.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-whisper text-neutral-600 text-sm">
                          {item.price > 0
                            ? `${item.price}₩`
                            : "Free"}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              getCartItemKey(item)
                            )
                          }
                          aria-label={`Remove ${item.fullName} from cart`}
                          className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <RiDeleteBinLine size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 flex flex-col gap-3 border-neutral-200 border-t pt-4">
                  {checkoutError && (
                    <p className="font-whisper text-red-600 text-sm">
                      {checkoutError}
                    </p>
                  )}
                  {!canCheckout && cart.length > 0 && (
                    <p className="font-whisper text-amber-600 text-sm">
                      Some items need to be re-added from
                      the typeface page to enable checkout.
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={clearCart}
                      aria-label="Clear cart"
                      className="cursor-pointer font-whisper text-neutral-500 text-sm transition-colors hover:text-red-500"
                    >
                      Clear all
                    </button>
                    <div className="flex items-center gap-4">
                      <span className="font-bold font-whisper text-base text-black">
                        Total:{" "}
                        {total > 0 ? `${total}₩` : "Free"}
                      </span>
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={
                          isCheckingOut || !canCheckout
                        }
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-12 py-4 font-medium font-whisper text-lg text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Proceed to checkout"
                      >
                        {isCheckingOut ? (
                          <>
                            <RiLoader4Line
                              size={20}
                              className="animate-spin"
                            />
                            Redirecting…
                          </>
                        ) : (
                          "Checkout"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
