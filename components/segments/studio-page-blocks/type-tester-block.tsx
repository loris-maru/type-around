import GlobalTypetester from "@/components/global/typetester/global";
import type { TypeTesterBlockData } from "@/types/layout";
import type { TypetesterTypeface } from "@/types/typetester";

export default function StudioTypeTesterBlock({
  typefaces,
  data,
}: {
  typefaces: TypetesterTypeface[];
  data?: TypeTesterBlockData;
}) {
  return (
    <GlobalTypetester
      typefaces={typefaces}
      backgroundColor={data?.backgroundColor}
      fontColor={data?.foregroundColor}
    />
  );
}
