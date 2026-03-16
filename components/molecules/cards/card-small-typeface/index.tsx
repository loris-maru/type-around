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
      className="relative flex flex-col justify-between rounded-xl border border-neutral-300 p-5"
    >
      <div className="mb-8 font-normal font-whisper text-base text-black">
        Discover more
      </div>

      <div className="relative flex w-full flex-row flex-nowrap">
        <div className="w-[40%] overflow-hidden">
          {icon?.trim() ? (
            <Image
              src={icon.trim()}
              alt={name}
              width={100}
              height={100}
              className="h-auto w-full object-cover"
            />
          ) : (
            <div className="flex h-[100px] w-full items-center justify-center bg-neutral-200">
              <span className="font-black font-ortank text-2xl text-neutral-400">
                {name.charAt(0) || "?"}
              </span>
            </div>
          )}
        </div>
        <aside className="w-[60%] pl-5 text-black">
          <div className="mb-3 font-black font-ortank text-black text-xl capitalize">
            {name}
          </div>
          <div className="flex flex-col gap-y-1 font-normal font-whisper text-black text-sm">
            <div>{category}</div>
            <div className="my-0.5 block h-px w-full bg-neutral-300" />
            <div>{weights} weights</div>
            <div className="my-0.5 block h-px w-full bg-neutral-300" />
            <div>{glyphs} glyphs</div>
          </div>
        </aside>
      </div>
    </Link>
  );
}
