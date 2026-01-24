import TypefaceHeader from "@/components/segments/typeface/header";
import { slugify } from "@/utils/slugify";
import STUDIOS from "@/mock-data/studios";
import { Typeface, Studio } from "@/types/typefaces";
import TypeTester from "@/components/segments/type-tester";
import Footer from "@/components/global/footer";
import DownloadButtons from "@/components/segments/typeface/download-buttons";
import TypefaceStatus from "@/components/segments/typeface/status";
import TypefaceUpdates from "@/components/segments/typeface/updates";
import TypefaceShop from "@/components/segments/typeface/shop";
import MoreContent from "@/components/segments/typeface/more-content";

export default async function TypefacePage({
  params,
}: {
  params: Promise<{ name: string; typefaceName: string }>;
}) {
  const { name, typefaceName } = await params;
  const studio = STUDIOS.find(
    (s) => slugify(s.name) === name
  );
  const rawTypeface = studio?.typefaces.find(
    (t) => slugify(t.name) === typefaceName
  );

  if (!studio || !rawTypeface) {
    return <div>Studio or typeface not found</div>;
  }

  const hash = studio.id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const typefaceIndex = studio.typefaces.findIndex(
    (t) => slugify(t.name) === typefaceName
  );

  const hangeulName: string =
    "hangeulName" in rawTypeface &&
    typeof rawTypeface.hangeulName === "string"
      ? rawTypeface.hangeulName
      : "오흐탕크";

  const typeface: Typeface = {
    ...rawTypeface,
    id: hash + typefaceIndex,
    hangeulName,
    gradient:
      "gradient" in rawTypeface &&
      typeof rawTypeface.gradient === "string"
        ? rawTypeface.gradient
        : Array.isArray(studio.gradient)
          ? studio.gradient[0]
          : studio.gradient,
    category: rawTypeface.category || null,
    fonts: rawTypeface.fonts.map((font) => ({
      ...font,
      price: 0,
      text: font.fullName,
    })),
  };

  const studioWithTypefaces: Studio = {
    ...studio,
    typefaces: studio.typefaces.map((tf, index) => ({
      ...tf,
      id: hash + index,
      fonts: tf.fonts.map((font) => ({
        ...font,
        price: 0,
        text: font.fullName,
      })),
    })),
  };

  return (
    <div className="relative w-full">
      <TypefaceHeader
        studio={studio.name}
        typeface={typeface}
        hangeulName={hangeulName}
      />
      <TypeTester />
      <DownloadButtons />
      <TypefaceStatus />
      <TypefaceUpdates />
      <TypefaceShop fonts={typeface.fonts} />
      <MoreContent studio={studioWithTypefaces} />
      <Footer />
    </div>
  );
}
