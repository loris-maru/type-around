"use client";

import Image from "next/image";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
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
  const { displayFontFamily, textFontFamily } =
    useStudioFonts();

  return (
    <button
      type="button"
      aria-label="Fonts in use card"
      name="fonts-in-use-card"
      className={cn(
        "relative flex h-[320px] w-full cursor-pointer flex-col justify-between overflow-hidden rounded-lg border bg-white transition-all duration-300 ease-in-out",
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

      <div className="relative flex flex-col gap-2 p-4">
        <div
          className="text-left font-black text-xl"
          style={{ fontFamily: displayFontFamily }}
        >
          {name}
        </div>

        <div className="my-1 block h-px w-full bg-neutral-200" />

        <div
          className="flex flex-row justify-between"
          style={{ fontFamily: textFontFamily }}
        >
          <div className="font-medium text-base">
            {typeface}
          </div>
          <div className="rounded-3xl border border-neutral-300 px-3 py-1 text-sm">
            {category}
          </div>
        </div>
      </div>
    </button>
  );
}
