import StudioStoreBlock from "@/components/segments/studio/store-block";
import type { StoreBlockData } from "@/types/layout";
import type { StoreProduct } from "@/types/studio";

export default function GoodiesShopBlock({
  data,
  products,
}: {
  data: StoreBlockData | undefined;
  products: StoreProduct[];
}) {
  if (!data) return null;
  return (
    <StudioStoreBlock
      data={data}
      products={products}
    />
  );
}
