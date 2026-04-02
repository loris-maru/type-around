import Link from "next/link";
import { SmallTypefaceCard } from "@/components/molecules/cards";
import type { MoreContentBlockData } from "@/types/layout-typeface";
import type { MoreContentRawTypeface } from "@/types/typeface-page-blocks";
import type { Studio } from "@/types/typefaces";
import { slugify } from "@/utils/slugify";

export default function MoreContentBlock({
  data,
  studio,
  rawTypefaces,
  currentTypefaceSlug,
  titleFontUrl,
  textFontUrl,
}: {
  data?: MoreContentBlockData;
  studio: Studio;
  rawTypefaces: MoreContentRawTypeface[];
  currentTypefaceSlug: string;
  titleFontUrl?: string;
  textFontUrl?: string;
}) {
  const rec1 = data?.recommendedTypeface1;
  const rec2 = data?.recommendedTypeface2;
  const recommendedSlugs = [rec1, rec2].filter(
    Boolean
  ) as string[];

  const selectedTypefaces =
    recommendedSlugs.length > 0
      ? recommendedSlugs
          .map((slug) =>
            rawTypefaces.find(
              (tf) =>
                slugify(tf.name) === slug ||
                tf.slug === slug
            )
          )
          .filter(
            (tf): tf is MoreContentRawTypeface =>
              !!tf && tf.published !== false
          )
      : rawTypefaces
          .filter(
            (tf) =>
              tf.published !== false &&
              slugify(tf.name) !== currentTypefaceSlug
          )
          .slice(0, 2);

  const studioSlug = slugify(studio.name);

  return (
    <div className="relative my-10 flex w-full grid-cols-3 flex-col gap-2 px-5 lg:my-[20vh] lg:grid lg:gap-1 lg:px-[16vw]">
      <Link
        href={`/studio/${studioSlug}`}
        className="relative rounded-xl bg-white p-10 lg:p-5"
      >
        <div className="font-normal font-whisper text-base text-black">
          To the studio
        </div>
        <div className="font-black font-ortank text-3xl">
          {studio.name}
        </div>
      </Link>
      {selectedTypefaces.map((tf) => (
        <SmallTypefaceCard
          key={tf.name}
          url={`/studio/${studioSlug}/typeface/${slugify(tf.name)}`}
          name={tf.name}
          icon={
            tf.heroLetter || tf.headerImage || tf.icon || ""
          }
          category={tf.category?.[0] ?? ""}
          weights={tf.fonts.length}
          glyphs={tf.characters ?? 0}
          titleFontUrl={titleFontUrl}
          textFontUrl={textFontUrl}
        />
      ))}
    </div>
  );
}
