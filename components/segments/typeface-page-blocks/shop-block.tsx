import TypefaceShop from "@/components/segments/typeface/shop";
import type { Font } from "@/types/typefaces";

export default function ShopBlock({
  typefaceFonts,
  typefaceName,
  typefaceSlug,
  studioId,
  studioSlug,
}: {
  typefaceFonts: (Font & {
    id?: string;
    salesFiles?: string[];
  })[];
  typefaceName: string;
  typefaceSlug: string;
  studioId: string;
  studioSlug: string;
}) {
  return (
    <TypefaceShop
      fonts={typefaceFonts}
      typefaceName={typefaceName}
      typefaceSlug={typefaceSlug}
      studioId={studioId}
      studioSlug={studioSlug}
    />
  );
}
