import Link from "next/link";
import IconTriangle from "@/components/icons/icon-triangle";
import type { Typeface } from "@/types/typefaces";
import { slugify } from "@/utils/slugify";
import SingleTypefaceLetter from "./single-typeface-letter";

export default function TypefaceHeader({
  studio,
  typeface,
  hangeulName = "오흐탕크",
}: {
  studio: string;
  typeface: Typeface;
  hangeulName: string;
}) {
  return (
    <div className="relative flex h-screen w-full flex-row items-center gap-x-10 px-[14vw]">
      <aside className="relative flex w-1/3 flex-col items-center gap-2">
        <div className="relative mb-2 flex flex-row items-center gap-4 font-ortank font-semibold text-black text-sm uppercase tracking-[2px]">
          <Link href={`/studio/${slugify(studio)}`}>
            {studio}
          </Link>
          <IconTriangle className="h-2 w-2" />
          {typeface.name}
        </div>
        <h1 className="whitespace-nowrap font-black font-ortank text-7xl">
          {hangeulName}
        </h1>
      </aside>
      <div className="h-full w-2/3">
        <SingleTypefaceLetter typeface={typeface} />
      </div>
    </div>
  );
}
