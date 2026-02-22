import StudioStoreBlock from "@/components/segments/studio/store-block";
import type { StoreBlockData } from "@/types/layout";

export default function StudioPageStoreBlock({
  data,
}: {
  data: StoreBlockData | undefined;
}) {
  if (!data) return null;
  return <StudioStoreBlock data={data} />;
}
