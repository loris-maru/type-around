"use client";

import { Typeface } from "@/types/typefaces";
import Image from "next/image";
import Link from "next/link";

export default function TypefaceCard({ typeface }: { typeface: Typeface }) {
  return (
    <Link
      href={`/typeface/${typeface.id}`}
      className="relative w-[300px] h-[350px] flex flex-col items-center justify-between bg-white border border-black shadow-button p-5 rounded-lg"
      prefetch={false}
    >
      <Image
        src={typeface.icon}
        alt={typeface.name}
        width={100}
        height={100}
        className="w-[90%] h-auto object-contain"
      />
      <div className="w-full flex flex-row justify-between items-baseline">
        <h3 className="text-2xl font-black font-ortank">{typeface.name}</h3>
        <div className="font-whisper text-sm text-black">{typeface.studio}</div>
      </div>
    </Link>
  );
}
