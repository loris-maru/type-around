import Footer from "@/components/global/footer";
import StudioHeader from "@/components/segments/studio/header";
import StudioPageBlocks from "@/components/segments/studio/page-blocks";
import { DEFAULT_PAGE_LAYOUT } from "@/constant/DEFAULT_PAGE_LAYOUT";
import { getStudioBySlug } from "@/lib/firebase/studios";
import type { LayoutItem } from "@/types/layout";

export const dynamic = "force-dynamic";

export default async function StudioPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const firebaseStudio = await getStudioBySlug(name);

  if (!firebaseStudio) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-bold font-ortank text-3xl">
            Studio not found
          </h1>
          <p className="font-whisper text-neutral-500">
            The studio you&apos;re looking for doesn&apos;t
            exist.
          </p>
        </div>
      </div>
    );
  }

  const gradient =
    firebaseStudio.gradient &&
    typeof firebaseStudio.gradient === "object" &&
    "from" in firebaseStudio.gradient &&
    "to" in firebaseStudio.gradient
      ? [
          firebaseStudio.gradient.from,
          firebaseStudio.gradient.to,
        ]
      : ["#FFF8E8", "#F2F2F2"];

  const storedLayout =
    firebaseStudio.pageLayout as LayoutItem[];
  const blocks = storedLayout?.length
    ? storedLayout
    : DEFAULT_PAGE_LAYOUT;

  // Build metadata for each typeface (display font file + font line text)
  const typefaceMeta = firebaseStudio.typefaces.map((t) => {
    const displayFont = t.displayFontId
      ? (t.fonts || []).find(
          (f) => f.id === t.displayFontId
        )
      : null;
    return {
      slug: t.slug,
      displayFontFile: displayFont?.file || "",
      fontLineText: t.fontLineText || "",
      specimenUrl: t.specimen || "",
    };
  });

  // Serialize the studio data for the client component
  const studioData = JSON.parse(
    JSON.stringify(firebaseStudio)
  );

  return (
    <div className="relative w-full">
      <StudioHeader gradient={gradient} />
      <StudioPageBlocks
        blocks={blocks}
        studio={studioData}
        typefaceMeta={typefaceMeta}
      />
      <Footer />
    </div>
  );
}
