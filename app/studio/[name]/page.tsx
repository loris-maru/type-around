import type { Metadata } from "next";
import Footer from "@/components/global/footer";
import StudioHeader from "@/components/segments/studio/header";
import StudioPageBlocks from "@/components/segments/studio-page-blocks";
import { DEFAULT_PAGE_LAYOUT } from "@/constant/DEFAULT_PAGE_LAYOUT";
import {
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TWITTER,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
} from "@/constant/SEO_METADATA";
import { StudioFontsProvider } from "@/contexts/studio-fonts-context";
import { getStudioBySlug } from "@/lib/firebase/studios";
import type { LayoutItem } from "@/types/layout";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const studio = await getStudioBySlug(name);

  if (!studio) {
    return { title: "스튜디오를 찾을 수 없습니다" };
  }

  const studioName = studio.hangeulName || studio.name;
  const description =
    studio.description ||
    `${studioName} – 독립적인 한국 타입 팩토리. 글꼴을 발견하고 독립 디자이너를 지원하세요.`;

  const canonical = `${SITE_URL}/studio/${name}`;

  return {
    title: studioName,
    description,
    alternates: { canonical },
    openGraph: {
      ...DEFAULT_OPEN_GRAPH,
      title: `${studioName} | ${SITE_NAME}`,
      description,
      images: [
        {
          url:
            studio.thumbnail ||
            studio.avatar ||
            OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: studioName,
        },
      ],
    },
    twitter: {
      ...DEFAULT_TWITTER,
      title: `${studioName} | ${SITE_NAME}`,
      description,
    },
  };
}

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
    const hasTrialFonts = (t.fonts || []).some(
      (f) => f.trialFiles && f.trialFiles.length > 0
    );
    const firstTrialFile = hasTrialFonts
      ? (t.fonts || [])
          .flatMap((f) => f.trialFiles || [])
          .find((url) => url) || ""
      : "";
    return {
      slug: t.slug,
      displayFontFile: displayFont?.file || "",
      fontLineText: t.fontLineText || "",
      specimenUrl: t.specimen || "",
      trialFontUrl: firstTrialFile,
    };
  });

  // Serialize the studio data for the client component
  const studioData = JSON.parse(
    JSON.stringify(firebaseStudio)
  );

  const displayFontUrl =
    (firebaseStudio.headerFont as string) || "";
  const textFontUrl =
    (firebaseStudio.textFont as string) || "";

  return (
    <StudioFontsProvider
      key={name}
      displayFontUrl={displayFontUrl || undefined}
      textFontUrl={textFontUrl || undefined}
    >
      <div className="relative w-full">
        <StudioHeader
          gradient={gradient}
          studioName={
            firebaseStudio.hangeulName ||
            firebaseStudio.name
          }
        />
        <StudioPageBlocks
          blocks={blocks}
          studio={studioData}
          typefaceMeta={typefaceMeta}
        />
        <Footer />
      </div>
    </StudioFontsProvider>
  );
}
