import StudioStoreBlock from "@/components/segments/studio/store-block";
import type { StoreBlockData } from "@/types/layout";
import type { Studio } from "@/types/studio";

export default function StudioPageStoreBlock({
  data,
  studio,
}: {
  data: StoreBlockData | undefined;
  studio?: Studio;
}) {
  if (!data) return null;
  return (
    <StudioStoreBlock
      data={data}
      studio={studio}
    />
  );
}
