import TypefaceAbout from "@/components/segments/typeface/about";
import type { AboutBlockData } from "@/types/layout-typeface";
import type { RawTypefaceForBlocks } from "@/types/typeface-page-blocks";

export default function AboutBlock({
  rawTypeface,
  typefaceName,
  data,
  titleFontUrl,
  textFontUrl,
}: {
  rawTypeface: RawTypefaceForBlocks;
  typefaceName?: string;
  data?: AboutBlockData;
  titleFontUrl?: string;
  textFontUrl?: string;
}) {
  return (
    <TypefaceAbout
      description={rawTypeface.description || ""}
      typefaceName={typefaceName || rawTypeface.name || ""}
      fontCount={rawTypeface.fonts?.length ?? 0}
      characters={rawTypeface.characters}
      specimenUrl={rawTypeface.specimen}
      trialFiles={rawTypeface.fonts?.flatMap(
        (f) => f.trialFiles ?? []
      )}
      data={data}
      titleFontUrl={titleFontUrl}
      textFontUrl={textFontUrl}
    />
  );
}
