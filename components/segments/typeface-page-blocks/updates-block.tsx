import TypefaceUpdates from "@/components/segments/typeface/updates";
import type { UpdatesBlockData } from "@/types/layout-typeface";

export default function UpdatesBlock({
  data,
}: {
  data?: UpdatesBlockData;
}) {
  return <TypefaceUpdates data={data} />;
}
