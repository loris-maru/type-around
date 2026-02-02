import IconTriangle from "@/components/icons/icon-triangle";
import { Typeface } from "@/types/typefaces";
import SingleTypefaceLetter from "./single-typeface-letter";
import { slugify } from "@/utils/slugify";
import Link from "next/link";

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
    <div className="relative w-full h-screen flex flex-row gap-x-10 items-center px-[14vw]">
      <aside className="relative w-1/3 flex flex-col items-center gap-2">
        <div className="relative flex flex-row gap-4 items-center font-ortank text-sm text-black uppercase tracking-[2px] font-semibold mb-2">
          <Link href={`/studio/${slugify(studio)}`}>
            {studio}
          </Link>
          <IconTriangle className="w-2 h-2" />
          {typeface.name}
        </div>
        <h1 className="font-ortank text-7xl font-black whitespace-nowrap">
          {hangeulName}
        </h1>
      </aside>
      <div className="w-2/3 h-full">
        <SingleTypefaceLetter typeface={typeface} />
      </div>
    </div>
  );
}
