"use client";

import { FontsInUseCard } from "@/components/molecules/cards";
import { FONTS_IN_USE_PER_PAGE } from "@/constant/UI_LAYOUT";
import { FONTS_IN_USE } from "@/mock-data/fonts-in-use";
import type { FontsInUseBlockData } from "@/types/layout";
import { applyBlockBackgroundColor } from "@/utils/block-background-color";

export default function TypefaceFontsInUseBlock({
  typefaceName,
  data,
}: {
  typefaceName: string;
  data?: FontsInUseBlockData;
}) {
  const style: React.CSSProperties = {};
  applyBlockBackgroundColor(style, data?.backgroundColor);
  if (data?.fontColor) style.color = data.fontColor;

  const filtered = FONTS_IN_USE.filter(
    (f) =>
      f.typeface.toLowerCase() ===
      typefaceName.toLowerCase()
  );
  const items = filtered.length > 0 ? filtered : [];

  if (items.length === 0) return null;

  const visible = items.slice(0, FONTS_IN_USE_PER_PAGE);

  return (
    <div
      className="px-5 py-16 lg:px-10"
      style={
        Object.keys(style).length > 0 ? style : undefined
      }
    >
      <h2 className="mb-8 font-black text-2xl text-black">
        Fonts in use
      </h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {visible.map((font) => (
          <FontsInUseCard
            key={font.id}
            name={font.name}
            typeface={font.typeface}
            category={font.category}
            image={font.image}
          />
        ))}
      </div>
    </div>
  );
}
