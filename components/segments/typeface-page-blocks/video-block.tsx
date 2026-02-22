import StudioVideoBlock from "@/components/segments/studio/video-block";
import type { VideoBlockData } from "@/types/layout";

export default function TypefacePageVideoBlock({
  data,
}: {
  data: VideoBlockData | undefined;
}) {
  if (!data?.url) return null;
  return <StudioVideoBlock data={data} />;
}
