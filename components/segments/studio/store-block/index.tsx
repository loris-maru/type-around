"use client";

import CardProduct from "@/components/molecules/cards/card-product";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import type { StudioStoreBlockProps } from "@/types/components";
import type { BlockMargin } from "@/types/layout";
import type { Studio } from "@/types/studio";
import { slugify } from "@/utils/slugify";

const MARGIN_TOP_CLASS: Record<BlockMargin, string> = {
  none: "pt-0",
  s: "pt-4 lg:pt-8",
  m: "pt-8 lg:pt-16",
  l: "pt-12 lg:pt-24",
  xl: "pt-16 lg:pt-32",
};

const MARGIN_BOTTOM_CLASS: Record<BlockMargin, string> = {
  none: "pb-0",
  s: "pb-4 lg:pb-8",
  m: "pb-8 lg:pb-16",
  l: "pb-12 lg:pb-24",
  xl: "pb-16 lg:pb-32",
};

export default function StudioStoreBlock({
  data,
  products,
  studio,
}: StudioStoreBlockProps & { studio?: Studio }) {
  const { displayFontFamily } = useStudioFonts();

  if (!products || products.length === 0) return null;

  const marginTop = data.marginTop ?? "m";
  const marginBottom = data.marginBottom ?? "m";

  return (
    <section
      className={`relative w-full px-10 ${MARGIN_TOP_CLASS[marginTop]} ${MARGIN_BOTTOM_CLASS[marginBottom]}`}
      style={{
        backgroundColor: data.backgroundColor,
        color: data.fontColor,
      }}
    >
      <h3
        className="mb-8 font-bold text-2xl"
        style={{ fontFamily: displayFontFamily }}
      >
        Store
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <CardProduct
            key={product.key}
            product={product}
            studioId={studio?.id}
            studioSlug={
              studio ? slugify(studio.name) : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
