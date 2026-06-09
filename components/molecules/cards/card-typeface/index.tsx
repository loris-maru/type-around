"use client";

import Image from "next/image";
import Link from "next/link";
import type { PublicTypefaceCardProps } from "@/types/components";
import { cn } from "@/utils/class-names";
import { slugify } from "@/utils/slugify";

export default function TypefaceCard({
  studioName,
  typeface,
  compact = false,
}: PublicTypefaceCardProps) {
  const iconSrc = typeface.icon?.trim();

  return (
    <Link
      href={`studio/${slugify(studioName)}/typeface/${slugify(typeface.name)}`}
      className={cn(
        "relative flex w-full flex-col items-center justify-between overflow-hidden rounded-lg p-4 transition-all duration-300 ease-in-out",
        compact ? "h-[272px]" : "h-[340px]",
        "bg-light-gray hover:bg-white",
        "border border-neutral-300 hover:border-black",
        "transparent hover:shadow-button-hover",
        "hover:scale-105"
      )}
      prefetch={false}
    >
      <div className="relative flex w-full flex-1 items-center justify-center">
        <div
          className={compact ? "w-[160px]" : "w-[200px]"}
        >
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt={typeface.name}
              width={100}
              height={100}
              className="h-auto w-full object-contain"
            />
          ) : (
            <div
              className="flex h-[100px] w-full items-center justify-center bg-neutral-200"
              aria-hidden
            >
              <span className="font-black font-ortank text-4xl text-neutral-400">
                {typeface.name.charAt(0) || "?"}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <h3
          className={cn(
            "font-black font-ortank",
            compact ? "text-xl" : "text-2xl"
          )}
        >
          {typeface.name}
        </h3>
        <div className="flex w-full flex-row items-baseline justify-between">
          <span className="font-whisper text-neutral-500 text-sm">
            {typeface.studio}
          </span>
          <span className="font-whisper text-neutral-500 text-sm">
            {typeface.fonts.length} font
            {typeface.fonts.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
