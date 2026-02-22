import SingleTypetester from "@/components/global/typetester/single";
import type { TypetesterFont } from "@/types/typetester";

export default function TypeTesterBlock({
  typetesterFonts,
}: {
  typetesterFonts: TypetesterFont[];
}) {
  return <SingleTypetester fonts={typetesterFonts} />;
}
