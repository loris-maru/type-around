"use client";

import CardProduct from "@/components/molecules/cards/card-product";
import type { StudioStoreBlockProps } from "@/types/components";
import type { Studio } from "@/types/studio";
import { slugify } from "@/utils/slugify";

export default function StudioStoreBlock({
  data,
  studio,
}: StudioStoreBlockProps & { studio?: Studio }) {
  const { products } = data;

  if (!products || products.length === 0) return null;

  return (
    <section className="relative w-full px-10 py-12">
      <h3 className="mb-8 font-bold font-ortank text-2xl">
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
