"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  RiCloseLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { useCartStore } from "@/stores/cart";

export default function CartPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const cart = useCartStore((s) => s.cart);
  const removeFromCart = useCartStore(
    (s) => s.removeFromCart
  );
  const clearCart = useCartStore((s) => s.clearCart);

  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

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
                      key={`${item.name}-${item.weight}-${item.style}`}
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
                            removeFromCart(item.name)
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
                <div className="mt-6 flex items-center justify-between border-neutral-200 border-t pt-4">
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
                      className="cursor-pointer rounded-lg bg-black px-12 py-4 font-medium font-whisper text-lg text-white transition-colors hover:bg-neutral-800"
                      aria-label="Proceed to checkout"
                    >
                      Checkout
                    </button>
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
