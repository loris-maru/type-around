import StudioImageBlock from "@/components/segments/studio/image-block";
import type { ImageBlockData } from "@/types/layout";

export default function TypefacePageImageBlock({
  data,
}: {
  data: ImageBlockData | undefined;
}) {
  if (!data?.url) return null;
  return <StudioImageBlock data={data} />;
}
