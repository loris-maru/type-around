import Image from "next/image";
import Link from "next/link";

export default function SmallTypefaceCard({
  url,
  name,
  icon,
  category,
  weights,
  glyphs,
}: {
  url: string;
  name: string;
  icon: string;
  category: string;
  weights: number;
  glyphs: number;
}) {
  return (
    <Link
      href={url}
      className="relative flex flex-col justify-between p-5 rounded-xl border border-neutral-300"
    >
      <div className="font-whisper text-base font-normal text-black mb-8">
        Discover more
      </div>

      <div className="relative w-full flex flex-row flex-nowrap">
        <div className="w-[40%] overflow-hidden">
          <Image
            src={icon}
            alt={name}
            width={100}
            height={100}
            className="w-full h-auto object-cover"
          />
        </div>
        <aside className="w-[60%] text-black  pl-5">
          <div className="font-ortank text-xl font-black text-black capitalize mb-3">
            {name}
          </div>
          <div className="flex flex-col gap-y-1 font-whisper text-sm font-normal text-black">
            <div>{category}</div>
            <div className="block w-full h-px bg-neutral-300 my-0.5" />
            <div>{weights} weights</div>
            <div className="block w-full h-px bg-neutral-300 my-0.5" />
            <div>{glyphs} glyphs</div>
          </div>
        </aside>
      </div>
    </Link>
  );
}
