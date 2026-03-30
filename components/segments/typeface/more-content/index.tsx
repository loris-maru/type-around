import Link from "next/link";
import { SmallTypefaceCard } from "@/components/molecules/cards";
import type { Studio } from "@/types/typefaces";
import { slugify } from "@/utils/slugify";

type RawTypeface = {
  name: string;
  slug?: string;
  category?: string[];
  fonts: { id: string; file?: string }[];
  characters?: number;
  heroLetter?: string;
  headerImage?: string;
  icon?: string;
  published?: boolean;
};

export default function MoreContent({
  studio,
  currentTypefaceSlug,
  rawTypefaces,
  titleFontUrl,
  textFontUrl,
}: {
  studio: Studio;
  currentTypefaceSlug?: string;
  rawTypefaces?: RawTypeface[];
  titleFontUrl?: string;
  textFontUrl?: string;
}) {
  const otherTypefaces = (rawTypefaces ?? [])
    .filter(
      (tf) =>
        tf.published !== false &&
        slugify(tf.name) !== currentTypefaceSlug
    )
    .slice(0, 2);

  return (
    <div className="relative my-10 flex w-full grid-cols-3 flex-col gap-2 px-5 lg:my-[20vh] lg:grid lg:gap-1 lg:px-[16vw]">
      <Link
        href={`/studio/${slugify(studio.name)}`}
        className="relative rounded-xl bg-white p-10 lg:p-5"
      >
        <div className="font-normal font-whisper text-base text-black">
          To the studio
        </div>
        <div className="font-black font-ortank text-3xl">
          {studio.name}
        </div>
      </Link>
      {otherTypefaces.map((tf) => (
        <SmallTypefaceCard
          key={tf.name}
          url={`/studio/${slugify(studio.name)}/typeface/${slugify(tf.name)}`}
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
