import TypefaceShop from "@/components/segments/typeface/shop";
import type { ShopBlockData } from "@/types/layout-typeface";
import type { Font } from "@/types/typefaces";

export default function ShopBlock({
  typefaceFonts,
  typefaceName,
  typefaceSlug,
  studioId,
  studioSlug,
  data,
}: {
  typefaceFonts: (Font & {
    id?: string;
    salesFiles?: string[];
  })[];
  typefaceName: string;
  typefaceSlug: string;
  studioId: string;
  studioSlug: string;
  data?: ShopBlockData;
}) {
  return (
    <TypefaceShop
      fonts={typefaceFonts}
      typefaceName={typefaceName}
      typefaceSlug={typefaceSlug}
      studioId={studioId}
      studioSlug={studioSlug}
      data={data}
    />
  );
}
