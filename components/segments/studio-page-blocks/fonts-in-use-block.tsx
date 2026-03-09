import FontsInUseList from "@/components/segments/studio/fonts-in-use-list";
import type { FontsInUseBlockData } from "@/types/layout";

export default function StudioFontsInUseBlock({
  data,
}: {
  data?: FontsInUseBlockData;
}) {
  const style: React.CSSProperties = {};
  if (data?.backgroundColor)
    style.backgroundColor = data.backgroundColor;
  if (data?.fontColor) style.color = data.fontColor;

  return (
    <div
      style={
        Object.keys(style).length > 0 ? style : undefined
      }
    >
      <FontsInUseList />
    </div>
  );
}
