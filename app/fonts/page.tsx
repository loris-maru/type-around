import type { Metadata } from "next";
import Footer from "@/components/global/footer";
import { TypefaceCard } from "@/components/molecules/cards";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  SITE_NAME,
} from "@/constant/SEO_METADATA";
import { getAllPublishedTypefaces } from "@/lib/firebase/studios";
import type { Typeface } from "@/types/typefaces";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "전체 글꼴",
  description: `독립적인 팩토리의 한국 글꼴을 발견하세요. ${SITE_NAME}에서 독특한 한글 폰트를 둘러보고 구매하세요.`,
  openGraph: {
    ...DEFAULT_OPEN_GRAPH,
    title: `전체 글꼴 | ${SITE_NAME}`,
    description:
      "독립적인 팩토리의 한국 글꼴을 발견하세요.",
  },
  twitter: {
    ...DEFAULT_TWITTER,
    title: `전체 글꼴 | ${SITE_NAME}`,
  },
};

export default async function FontsPage() {
  const typefaces = await getAllPublishedTypefaces();

  // Map studio typefaces to the Typeface format expected by TypefaceCard
  const mappedTypefaces: Array<{
    studioName: string;
    typeface: Typeface;
  }> = typefaces.map((t) => ({
    studioName: t.studioName,
    typeface: {
      id: Number(t.id) || 0,
      category: t.category,
      name: t.name,
      hangeulName: t.hangeulName,
      slug: t.slug,
      description: t.description,
      icon:
        t.heroLetter ||
        t.headerImage ||
        "/mock/typefaces/icn_ortank.svg",
      fonts: t.fonts.map((f) => ({
        price: f.printPrice || f.price || 0,
        text: f.text || "",
        fullName: f.fullName || f.styleName,
        name: f.name || f.styleName,
        weight: f.weight,
        style:
          f.style || (f.isItalic ? "italic" : "normal"),
      })),
      characters: t.characters,
      releaseDate: t.releaseDate,
      studio: t.studioName,
    },
  }));

  if (mappedTypefaces.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center px-10 py-32">
        <div className="text-center">
          <h1 className="mb-4 font-bold font-ortank text-3xl">
            Fonts
          </h1>
          <p className="font-whisper text-neutral-500">
            No published typefaces yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-10 py-32">
      <div className="mb-12">
        <h1 className="mb-4 font-bold font-ortank text-4xl">
          All Fonts
        </h1>
        <p className="font-whisper text-neutral-500">
          Discover {mappedTypefaces.length} typeface
          {mappedTypefaces.length !== 1 ? "s" : ""} from our
          community of designers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mappedTypefaces.map(({ studioName, typeface }) => (
          <TypefaceCard
            key={`${studioName}-${typeface.slug}`}
            studioName={studioName}
            typeface={typeface}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}
