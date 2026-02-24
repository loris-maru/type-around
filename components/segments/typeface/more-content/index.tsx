import Link from "next/link";
import { SmallTypefaceCard } from "@/components/molecules/cards";
import type { Studio } from "@/types/typefaces";
import { slugify } from "@/utils/slugify";

export default function MoreContent({
  studio,
}: {
  studio: Studio;
}) {
  return (
    <div className="relative my-10 flex w-full grid-cols-3 flex-col gap-2 px-5 lg:my-20 lg:my-[20vh] lg:grid lg:gap-1 lg:px-[16vw]">
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
      <SmallTypefaceCard
        url={`/studio/${slugify(studio.name)}/typeface/giparan`}
        name="giparan"
        icon="/mock/typefaces/icn_giparan.svg"
        category="sans-serif"
        weights={6}
        glyphs={2800}
      />
      <SmallTypefaceCard
        url={`/studio/${slugify(studio.name)}/typeface/arvana`}
        name="arvana"
        icon="/mock/typefaces/icn_arvana.svg"
        category="serif"
        weights={6}
        glyphs={1024}
      />
    </div>
  );
}
