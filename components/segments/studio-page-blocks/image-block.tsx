import StudioImageBlock from "@/components/segments/studio/image-block";
import type { ImageBlockData } from "@/types/layout";

export default function StudioPageImageBlock({
  data,
}: {
  data: ImageBlockData | undefined;
}) {
  if (!data) return null;
  return <StudioImageBlock data={data} />;
}
