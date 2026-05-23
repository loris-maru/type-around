import TypefacesList from "@/components/segments/studio/typefaces-list";
import type { TypefaceListBlockData } from "@/types/layout";
import type {
  Studio as DisplayStudio,
  TypefaceMeta,
} from "@/types/typefaces";
import { applyBlockBackgroundColor } from "@/utils/block-background-color";

export default function StudioTypefaceListBlock({
  displayStudio,
  typefaceMeta,
  data,
}: {
  displayStudio: DisplayStudio;
  typefaceMeta: TypefaceMeta[];
  data: TypefaceListBlockData | undefined;
}) {
  const style: React.CSSProperties = {};
  applyBlockBackgroundColor(style, data?.backgroundColor);
  if (data?.fontColor) style.color = data.fontColor;

  return (
    <div style={style}>
      <TypefacesList
        studio={displayStudio}
        typefaceMeta={typefaceMeta}
      />
    </div>
  );
}
