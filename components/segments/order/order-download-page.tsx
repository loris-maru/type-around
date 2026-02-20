"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  RiDownloadLine,
  RiLoader4Line,
} from "react-icons/ri";
import { useCartStore } from "@/stores/cart";
import type { Order } from "@/types/order";
import { downloadFile } from "@/utils/download-file";

export default function OrderDownloadPage({
  order,
}: {
  order: Order;
}) {
  const clearCart = useCartStore((s) => s.clearCart);
  const [downloadingIndex, setDownloadingIndex] = useState<
    number | null
  >(null);

  const handleDownloadOrder = useCallback(async () => {
    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];
      if (item.salesFileUrls.length === 0) continue;
      setDownloadingIndex(i);
      try {
        for (const url of item.salesFileUrls) {
          const ext =
            url.split(".").pop()?.split("?")[0] || "zip";
          const filename = `${item.typefaceName}-${item.fullName}.${ext}`;
          await downloadFile(url, filename);
        }
      } finally {
        setDownloadingIndex(null);
      }
    }
    clearCart();
  }, [order.items, clearCart]);

  const isPaid = order.status === "paid";
  const totalWon = order.totalCents;

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 p-8">
      <div>
        <h1 className="font-bold font-ortank text-2xl">
          {isPaid ? "Your order" : "Processing payment"}
        </h1>
        <p className="mt-2 font-whisper text-neutral-600">
          {isPaid
            ? "Thank you for your purchase. Download your fonts below."
            : "Your payment is being confirmed. Refresh the page in a moment."}
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex justify-between font-whisper text-neutral-600 text-sm">
          <span>Order #{order.id.slice(0, 8)}</span>
          <span>
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex flex-col divide-y divide-neutral-100">
          {order.items.map((item, index) => (
            <div
              key={`${item.fontId}-${item.typefaceSlug}`}
              className="flex items-center justify-between py-4"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-normal font-ortank text-neutral-700 text-sm">
                  {item.typefaceName}
                </span>
                <span className="font-bold font-ortank text-black">
                  {item.fullName}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-whisper text-neutral-600 text-sm">
                  {item.price > 0
                    ? `${item.price}₩`
                    : "Free"}
                </span>
                {downloadingIndex === index && (
                  <RiLoader4Line
                    size={20}
                    className="animate-spin text-neutral-400"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-neutral-200 border-t pt-4 font-bold">
          <span>Total</span>
          <span>
            {totalWon > 0 ? `${totalWon}₩` : "Free"}
          </span>
        </div>

        {isPaid && (
          <button
            type="button"
            onClick={handleDownloadOrder}
            disabled={downloadingIndex !== null}
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-4 font-medium font-whisper text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
          >
            {downloadingIndex !== null ? (
              <>
                <RiLoader4Line
                  size={20}
                  className="animate-spin"
                />
                Downloading…
              </>
            ) : (
              <>
                <RiDownloadLine size={20} />
                Download order
              </>
            )}
          </button>
        )}
      </div>

      <Link
        href="/studio"
        className="font-whisper text-neutral-500 text-sm underline hover:text-black"
      >
        ← Back to studio
      </Link>
    </div>
  );
}
