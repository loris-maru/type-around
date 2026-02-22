import StudioStoreBlock from "@/components/segments/studio/store-block";
import type { StoreBlockData } from "@/types/layout";

export default function GoodiesShopBlock({
  data,
}: {
  data: StoreBlockData | undefined;
}) {
  if (!data) return null;
  return <StudioStoreBlock data={data} />;
}
