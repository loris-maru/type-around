import type { Font } from "@/types/typefaces";
import FontLine from "./font-line";

export default function TypefaceShop({
  fonts,
  typefaceName = "",
  typefaceSlug = "",
  studioId = "",
  studioSlug = "",
}: {
  fonts: (Font & { id?: string; salesFiles?: string[] })[];
  typefaceName?: string;
  typefaceSlug?: string;
  studioId?: string;
  studioSlug?: string;
}) {
  return (
    <div
      className="relative my-[20vh] flex w-full flex-col gap-y-1"
      id="shop"
    >
      {fonts.map((font, index: number) => (
        <div key={`${font.id || font.name}-${font.weight}`}>
          <FontLine
            font={font}
            typefaceName={typefaceName}
            typefaceSlug={typefaceSlug}
            studioId={studioId}
            studioSlug={studioSlug}
            text="모진 바람 5월 꽃봉오리"
          />
          {index !== fonts.length - 1 && (
            <div className="relative my-4 h-px w-full bg-neutral-300" />
          )}
        </div>
      ))}
    </div>
  );
}
