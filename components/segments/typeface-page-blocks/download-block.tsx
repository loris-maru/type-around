import DownloadButtons from "@/components/segments/typeface/download-buttons";
import type { RawTypefaceForBlocks } from "@/types/typeface-page-blocks";
import type { DownloadBlockData } from "@/types/layout-typeface";

export default function DownloadBlock({
  rawTypeface,
  typefaceName,
  data,
}: {
  rawTypeface: RawTypefaceForBlocks;
  typefaceName: string;
  data?: DownloadBlockData;
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
      showTrialFonts={data?.showTrialFonts}
      showSpecimen={data?.showSpecimen}
      backgroundColor={data?.backgroundColor}
    />
  );
}
