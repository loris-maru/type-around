import TypefaceAbout from "@/components/segments/typeface/about";
import type { RawTypefaceForBlocks } from "@/types/typeface-page-blocks";

export default function AboutBlock({
  rawTypeface,
}: {
  rawTypeface: RawTypefaceForBlocks;
}) {
  return (
    <TypefaceAbout
      description={rawTypeface.description || ""}
    />
  );
}
