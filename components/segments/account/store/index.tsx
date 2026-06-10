"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RiAddLine } from "react-icons/ri";
import { useStudio } from "@/hooks/use-studio";
import type { StoreProduct } from "@/types/studio";
import { cn } from "@/utils/class-names";

export default function AccountStore() {
  const { studio, isLoading } = useStudio();
  const params = useParams();
  const studioIdFromUrl = params?.id as string | undefined;
  const products = studio?.products ?? [];
  const newProductHref = studioIdFromUrl
    ? `/account/${studioIdFromUrl}/store/new`
    : undefined;

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col gap-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-bold font-ortank text-3xl">
            Store
          </h1>
          <p className="mt-2 font-whisper text-neutral-500 text-sm">
            Add products that customers can buy. These will
            be displayed wherever you add a Store block on
            your studio page.
          </p>
        </div>
        {newProductHref ? (
          <Link
            href={newProductHref}
            aria-label="New product"
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-black bg-transparent px-4 py-3 font-medium font-whisper text-black shadow-button transition-all duration-300 ease-in-out hover:bg-white hover:shadow-button-hover"
          >
            <RiAddLine className="h-4 w-4" />
            New product
          </Link>
        ) : (
          <button
            type="button"
            aria-label="New product"
            disabled
            className="flex shrink-0 cursor-not-allowed items-center gap-2 rounded-lg border border-neutral-300 bg-transparent px-4 py-3 font-medium font-whisper text-neutral-400 opacity-50"
          >
            <RiAddLine className="h-4 w-4" />
            New product
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-neutral-300 border-dashed bg-white/60 p-8 text-center">
          <p className="font-whisper text-neutral-500">
            No products yet. Add your first product to show
            it in your studio page store block.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product) => (
            <li key={product.key}>
              <ProductRow
                product={product}
                href={`/account/${studio?.id}/store/${product.key}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductRow({
  product,
  href,
}: {
  product: StoreProduct;
  href: string;
}) {
  const coverIndex = product.coverImageIndex ?? 0;
  const cover =
    product.images[coverIndex] ?? product.images[0];
  const variants = product.variants ?? [];

  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border border-neutral-300 bg-white p-4 transition-colors hover:border-black"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        {cover ? (
          <Image
            src={cover}
            alt={product.name || "Product"}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-whisper text-neutral-400 text-xs">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-semibold font-whisper text-black text-lg">
            {product.name || "Untitled product"}
          </h2>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1 font-medium font-whisper text-xs uppercase tracking-wide",
              product.available !== false
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600"
            )}
          >
            {product.available !== false
              ? "Available"
              : "Unavailable"}
          </span>
        </div>
        {product.category && (
          <p className="mt-0.5 font-whisper text-neutral-500 text-xs uppercase tracking-wide">
            {product.category}
          </p>
        )}
        {variants.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {variants.map((variant) => (
              <li
                key={variant.key}
                className="font-whisper text-neutral-600 text-sm"
              >
                <span className="font-medium text-black">
                  {variant.title || "Default"}
                </span>{" "}
                — {(variant.price ?? 0).toLocaleString()}₩
              </li>
            ))}
          </ul>
        ) : product.price !== undefined ? (
          <p className="mt-2 font-whisper text-neutral-600 text-sm">
            {product.price.toLocaleString()}₩
          </p>
        ) : null}
      </div>
    </Link>
  );
}
