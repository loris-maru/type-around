import Footer from "@/components/global/footer";
import FontsInUseList from "@/components/segments/studio/fonts-in-use-list";
import StudioHeader from "@/components/segments/studio/header";
import StudioProfile from "@/components/segments/studio/profile";
import TypefacesList from "@/components/segments/studio/typefaces-list";
import TypeTester from "@/components/segments/type-tester";
import STUDIOS from "@/mock-data/studios";
import type { Studio } from "@/types/typefaces";
import { slugify } from "@/utils/slugify";

export default async function StudioPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const studio = STUDIOS.find(
    (s) => slugify(s.name) === name
  );

  if (!studio) {
    return <div>Studio not found</div>;
  }

  const studioWithIds = {
    ...studio,
    typefaces: studio.typefaces.map((typeface, index) => {
      const hash = studio.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return {
        ...typeface,
        id: hash + index,
        category: typeface.category || [],
        hangeulName:
          "hangeulName" in typeface &&
          typeof typeface.hangeulName === "string"
            ? typeface.hangeulName
            : "오흐탕크",
        gradient:
          "gradient" in typeface &&
          typeof typeface.gradient === "string"
            ? typeface.gradient
            : Array.isArray(studio.gradient)
              ? studio.gradient[0]
              : studio.gradient,
        fonts: typeface.fonts.map((font) => ({
          ...font,
          price:
            "price" in font
              ? (font as { price: number }).price
              : 0,
          text:
            "text" in font
              ? (font as { text: string }).text
              : "",
        })),
      };
    }),
  } as unknown as Studio;

  return (
    <div className="relative w-full">
      <StudioHeader gradient={studio.gradient} />
      <StudioProfile />
      <TypeTester />
      <TypefacesList studio={studioWithIds} />
      <FontsInUseList />
      <Footer />
    </div>
  );
}
