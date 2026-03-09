import { BLOCK_MARGIN_CLASS_MAP } from "@/constant/BLOCK_CLASS_MAPS";
import type { ShopBlockData } from "@/types/layout-typeface";
import type { Font } from "@/types/typefaces";
import { cn } from "@/utils/class-names";
import FontLine from "./font-line";

export default function TypefaceShop({
  fonts,
  typefaceName = "",
  typefaceSlug = "",
  studioId = "",
  studioSlug = "",
  data,
}: {
  fonts: (Font & { id?: string; salesFiles?: string[] })[];
  typefaceName?: string;
  typefaceSlug?: string;
  studioId?: string;
  studioSlug?: string;
  data?: ShopBlockData;
}) {
  const orderedFonts = (() => {
    if (!data?.fontOrder?.length) return fonts;
    const order = data.fontOrder;
    const byId = new Map(
      fonts.map((f) => [
        f.id ??
          `${f.weight}-${(f as { styleName?: string }).styleName ?? (f as { name?: string }).name ?? "font"}`,
        f,
      ])
    );
    const ordered: (Font & {
      id?: string;
      salesFiles?: string[];
    })[] = [];
    for (const id of order) {
      const f = byId.get(id);
      if (f) {
        ordered.push(f);
        byId.delete(id);
      }
    }
    ordered.push(...byId.values());
    return ordered;
  })();

  const marginClass =
    data?.margin && BLOCK_MARGIN_CLASS_MAP[data.margin]
      ? BLOCK_MARGIN_CLASS_MAP[data.margin]
      : "my-[20vh]";
  const sectionStyle: React.CSSProperties = {};
  if (data?.backgroundColor)
    sectionStyle.backgroundColor = data.backgroundColor;
  if (data?.textColor) sectionStyle.color = data.textColor;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-y-1",
        marginClass
      )}
      id="shop"
      style={
        Object.keys(sectionStyle).length > 0
          ? sectionStyle
          : undefined
      }
    >
      {orderedFonts.map((font, index: number) => (
        <div
          key={
            font.id ||
            `${font.weight}-${(font as { styleName?: string }).styleName ?? (font as { name?: string }).name ?? "font"}`
          }
        >
          <FontLine
            font={font}
            typefaceName={typefaceName}
            typefaceSlug={typefaceSlug}
            studioId={studioId}
            studioSlug={studioSlug}
            text="모진 바람 5월 꽃봉오리"
          />
          {index !== orderedFonts.length - 1 && (
            <div className="relative my-4 h-px w-full bg-neutral-300" />
          )}
        </div>
      ))}
    </div>
  );
}
