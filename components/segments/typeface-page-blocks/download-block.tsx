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
      trialFontUrls={rawTypeface.fonts.flatMap((font) => {
        const styleName = font.styleName || "";
        const trialFiles =
          font.trialFiles?.filter((url) => url?.trim()) ??
          [];
        return trialFiles.map((file) => ({
          styleName,
          file,
        }));
      })}
      showTrialFonts={data?.showTrialFonts}
      showSpecimen={data?.showSpecimen}
      backgroundColor={data?.backgroundColor}
      textColor={data?.textColor}
    />
  );
}
