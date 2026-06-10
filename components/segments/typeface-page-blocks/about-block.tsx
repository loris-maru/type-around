import TypefaceAbout from "@/components/segments/typeface/about";
import type { AboutBlockData } from "@/types/layout-typeface";
import type { RawTypefaceForBlocks } from "@/types/typeface-page-blocks";

export default function AboutBlock({
  rawTypeface,
  data,
  titleFontUrl,
  textFontUrl,
}: {
  rawTypeface: RawTypefaceForBlocks;
  data?: AboutBlockData;
  titleFontUrl?: string;
  textFontUrl?: string;
}) {
  return (
    <TypefaceAbout
      description={rawTypeface.description || ""}
      data={data}
      titleFontUrl={titleFontUrl}
      textFontUrl={textFontUrl}
    />
  );
}
