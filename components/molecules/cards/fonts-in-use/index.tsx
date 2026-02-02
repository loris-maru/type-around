import { cn } from "@/utils/class-names";
import Image from "next/image";

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
        "relative w-full h-[480px] flex flex-col justify-between bg-white border p-5 rounded-lg transition-all duration-300 ease-in-out",
        "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover",
        "shadow-transparent hover:shadow-button",
        "border-neutral-300 hover:border-black"
      )}
    >
      <div className="relative w-full h-[300px] overflow-hidden mb-2 rounded-md">
        <Image
          src={image}
          alt={name}
          width={100}
          height={100}
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="relative flex flex-col gap-2">
        <div className="font-black text-2xl font-ortank text-left">
          {name}
        </div>

        <div className="block w-full h-px bg-neutral-300 my-1" />

        <div className="flex flex-row justify-between">
          <div className="font-whisper text-base font-bold">
            {typeface}
          </div>
          <div className="px-3 py-1 border border-neutral-300 rounded-3xl font-whisper text-sm">
            {category}
          </div>
        </div>
      </div>
    </button>
  );
}
