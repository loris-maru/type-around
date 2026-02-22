import StudioVideoBlock from "@/components/segments/studio/video-block";
import type { VideoBlockData } from "@/types/layout";

export default function StudioPageVideoBlock({
  data,
}: {
  data: VideoBlockData | undefined;
}) {
  if (!data) return null;
  return <StudioVideoBlock data={data} />;
}
