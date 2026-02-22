import DownloadButtons from "@/components/segments/typeface/download-buttons";
import type { RawTypefaceForBlocks } from "@/types/typeface-page-blocks";

export default function DownloadBlock({
  rawTypeface,
  typefaceName,
}: {
  rawTypeface: RawTypefaceForBlocks;
  typefaceName: string;
}) {
  return (
    <DownloadButtons
      typefaceName={typefaceName}
      specimenUrl={rawTypeface.specimen || undefined}
      trialFontUrls={rawTypeface.fonts
        .filter((f) => f.file)
        .map((f) => ({
          styleName: f.styleName || "",
          file: f.file || "",
        }))}
    />
  );
}
