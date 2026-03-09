import TypefaceAbout from "@/components/segments/typeface/about";
import type { AboutBlockData } from "@/types/layout-typeface";
import type { RawTypefaceForBlocks } from "@/types/typeface-page-blocks";

export default function AboutBlock({
  rawTypeface,
  data,
}: {
  rawTypeface: RawTypefaceForBlocks;
  data?: AboutBlockData;
}) {
  return (
    <TypefaceAbout
      description={rawTypeface.description || ""}
      data={data}
    />
  );
}
