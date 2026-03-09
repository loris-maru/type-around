import SingleTypetester from "@/components/global/typetester/single";
import type { TypetesterFont } from "@/types/typetester";
import type { TypeTesterBlockData } from "@/types/layout-typeface";

export default function TypeTesterBlock({
  typetesterFonts,
  data,
}: {
  typetesterFonts: TypetesterFont[];
  data?: TypeTesterBlockData;
}) {
  return (
    <SingleTypetester
      fonts={typetesterFonts}
      initialBackgroundColor={data?.backgroundColor}
      initialForegroundColor={data?.foregroundColor}
    />
  );
}
