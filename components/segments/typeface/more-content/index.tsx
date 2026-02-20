import { SmallTypefaceCard } from "@/components/molecules/cards";
import { Studio } from "@/types/typefaces";
import { slugify } from "@/utils/slugify";
import Link from "next/link";

export default function MoreContent({
  studio,
}: {
  studio: Studio;
}) {
  return (
    <div className="relative w-full grid grid-cols-3 gap-x-1 px-[16vw] my-[20vh]">
      <Link
        href={`/studio/${slugify(studio.name)}`}
        className="relative bg-white rounded-xl p-5"
      >
        <div className="font-whisper text-base font-normal text-black">
          To the studio
        </div>
        <div className="font-black text-3xl font-ortank">
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
