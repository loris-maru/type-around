import Footer from "@/components/global/footer";
import SingleTypetester from "@/components/global/typetester/single";
import DownloadButtons from "@/components/segments/typeface/download-buttons";
import TypefaceGallery from "@/components/segments/typeface/gallery";
import TypefaceHeader from "@/components/segments/typeface/header";
import MoreContent from "@/components/segments/typeface/more-content";
import TypefaceShop from "@/components/segments/typeface/shop";
import TypefaceStatus from "@/components/segments/typeface/status";
import TypefaceUpdates from "@/components/segments/typeface/updates";
import { getStudioBySlug } from "@/lib/firebase/studios";
import type { Studio, Typeface } from "@/types/typefaces";
import type { TypetesterFont } from "@/types/typetester";
import { slugify } from "@/utils/slugify";

export const dynamic = "force-dynamic";

export default async function TypefacePage({
  params,
}: {
  params: Promise<{ name: string; typefaceName: string }>;
}) {
  const { name, typefaceName } = await params;

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

  // Find the typeface by slug
  const rawTypeface = firebaseStudio.typefaces.find(
    (tf) => slugify(tf.name) === typefaceName
  );

  if (!rawTypeface) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-bold font-ortank text-3xl">
            Typeface not found
          </h1>
          <p className="font-whisper text-neutral-500">
            The typeface you&apos;re looking for
            doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const hash = firebaseStudio.id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const typefaceIndex = firebaseStudio.typefaces.findIndex(
    (t) => slugify(t.name) === typefaceName
  );

  const hangeulName: string =
    rawTypeface.hangeulName || "오흐탕크";

  const typeface: Typeface = {
    ...rawTypeface,
    id: hash + typefaceIndex,
    hangeulName,
    icon:
      rawTypeface.heroLetter ||
      rawTypeface.headerImage ||
      "",
    gradient:
      typeof rawTypeface.gradient === "string"
        ? rawTypeface.gradient
        : firebaseStudio.gradient &&
            typeof firebaseStudio.gradient === "object" &&
            "from" in firebaseStudio.gradient
          ? firebaseStudio.gradient.from
          : "#FFF8E8",
    category: rawTypeface.category || null,
    fonts: rawTypeface.fonts.map((font) => ({
      ...font,
      price: font.printPrice || font.price || 0,
      text: font.fullName || font.styleName,
      fullName: font.fullName || font.styleName,
      name: font.name || font.styleName,
      style:
        font.style || (font.isItalic ? "italic" : "normal"),
    })),
  };

  const studioWithTypefaces: Studio = {
    id: firebaseStudio.id,
    name: firebaseStudio.name,
    description: "",
    image:
      firebaseStudio.thumbnail ||
      firebaseStudio.avatar ||
      "/placeholders/studio_image_placeholder.webp",
    website: firebaseStudio.website,
    email: firebaseStudio.contactEmail,
    imageCover: firebaseStudio.thumbnail || "",
    gradient: [
      firebaseStudio.gradient?.from || "#FFF8E8",
      firebaseStudio.gradient?.to || "#F2F2F2",
    ],
    socialMedia: firebaseStudio.socialMedia.map((sm) => ({
      name: sm.name,
      href: sm.url,
      service: sm.name.toLowerCase(),
    })),
    typefaces: firebaseStudio.typefaces.map(
      (tf, index) => ({
        ...tf,
        id: hash + index,
        fonts: tf.fonts.map((font) => ({
          ...font,
          price: font.printPrice || font.price || 0,
          text: font.fullName || font.styleName,
          fullName: font.fullName || font.styleName,
          name: font.name || font.styleName,
          style:
            font.style ||
            (font.isItalic ? "italic" : "normal"),
        })),
      })
    ),
  };

  // Gallery images from Account > typefaces > Gallery images
  const galleryImages = (
    rawTypeface.galleryImages || []
  ).map((src, i) => ({
    src,
    alt: `Gallery image ${i + 1}`,
  }));

  // Extract fonts for the SingleTypetester from this typeface only
  const typetesterFonts: TypetesterFont[] =
    rawTypeface.fonts
      .filter((f) => f.file)
      .map((f) => ({
        id: f.id,
        styleName: f.styleName,
        weight: f.weight,
        isItalic: f.isItalic,
        file: f.file,
      }));

  return (
    <div className="relative w-full">
      <TypefaceHeader
        studio={firebaseStudio.name}
        typeface={typeface}
        hangeulName={hangeulName}
      />
      <SingleTypetester fonts={typetesterFonts} />
      <TypefaceGallery images={galleryImages} />
      <DownloadButtons
        typefaceName={typeface.name}
        specimenUrl={rawTypeface.specimen || undefined}
        trialFontUrls={rawTypeface.fonts
          .filter((f) => f.file)
          .map((f) => ({
            styleName: f.styleName,
            file: f.file,
          }))}
      />
      <TypefaceStatus />
      <TypefaceUpdates />
      <TypefaceShop
        fonts={typeface.fonts}
        typefaceName={typeface.name}
        typefaceSlug={typefaceName}
        studioId={firebaseStudio.id}
        studioSlug={name}
      />
      <MoreContent studio={studioWithTypefaces} />
      <Footer />
    </div>
  );
}
