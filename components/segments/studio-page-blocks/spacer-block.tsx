import StudioSpacerBlock from "@/components/segments/studio/spacer-block";
import type { SpacerBlockData } from "@/types/layout";

export default function StudioPageSpacerBlock({
  data,
}: {
  data: SpacerBlockData | undefined;
}) {
  if (!data) return null;
  return <StudioSpacerBlock data={data} />;
}
