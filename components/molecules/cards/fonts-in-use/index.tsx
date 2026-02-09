import Image from "next/image";
import { cn } from "@/utils/class-names";

export default function FontsInUseCard({
  name,
  typeface,
  category,
  image,
}: {
  name: string;
  typeface: string;
  category: string;
  image: string;
}) {
  return (
    <button
      type="button"
      aria-label="Fonts in use card"
      name="fonts-in-use-card"
      className={cn(
        "relative flex h-[420px] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-lg border bg-white transition-all duration-300 ease-in-out",
        "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover",
        "shadow-medium-gray hover:shadow-button-hover",
        "border-neutral-300"
      )}
    >
      <div className="relative mb-2 h-[300px] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={900}
          height={900}
          className="h-auto w-full object-cover"
        />
      </div>

      <div className="relative flex flex-col gap-2 p-8">
        <div className="text-left font-black font-ortank text-2xl">
          {name}
        </div>

        <div className="my-1 block h-px w-full bg-neutral-200" />

        <div className="flex flex-row justify-between">
          <div className="font-medium font-whisper text-base">
            {typeface}
          </div>
          <div className="rounded-3xl border border-neutral-300 px-3 py-1 font-whisper text-sm">
            {category}
          </div>
        </div>
      </div>
    </button>
  );
}
