import { Typeface } from "@/types/typefaces";
import Image from "next/image";

export default function TypefaceCard({ typeface }: { typeface: Typeface }) {
  return (
    <div className="relative w-[300px] h-[350px] flex flex-col justify-between bg-white border border-black shadow-button p-5 rounded-lg">
      <Image
        src={typeface.icon}
        alt={typeface.name}
        width={100}
        height={100}
        className="w-full h-auto object-contain"
      />
      <div className="w-full flex flex-row justify-between items-baseline">
        <h3 className="text-2xl font-black font-ortank">{typeface.name}</h3>
        <div className="font-whisper text-sm text-black">{typeface.studio}</div>
      </div>
    </div>
  );
}
