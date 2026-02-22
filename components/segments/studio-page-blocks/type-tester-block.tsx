import GlobalTypetester from "@/components/global/typetester/global";
import type { TypetesterTypeface } from "@/types/typetester";

export default function StudioTypeTesterBlock({
  typefaces,
}: {
  typefaces: TypetesterTypeface[];
}) {
  return <GlobalTypetester typefaces={typefaces} />;
}
