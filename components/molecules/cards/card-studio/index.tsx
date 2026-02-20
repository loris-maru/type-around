"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Studio } from "@/types/typefaces";
import { cn } from "@/utils/class-names";
import { slugify } from "@/utils/slugify";

export default function StudioCard({
  studio,
}: {
  studio: Studio;
}) {
  const [isHovered, setIsHovered] =
    useState<boolean>(false);

  return (
    <Link
      href={`/studio/${studio.slug || slugify(studio.name)}`}
      className={cn(
        "relative flex w-full flex-col justify-between rounded-lg border border-neutral-300 bg-light-gray p-5 shadow-medium-gray transition-all duration-300 ease-in-out",
        "hover:-translate-x-1 hover:-translate-y-1 hover:bg-white hover:shadow-button-hover"
      )}
      prefetch={false}
      onMouseOver={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onBlur={() => setIsHovered(false)}
    >
      <header className="relative flex flex-col gap-2">
        <h3 className="font-black font-ortank text-3xl">
          {studio.name}
        </h3>
      </header>
      <div
        className="relative my-3 h-[220px] w-full overflow-hidden transition-all duration-300 ease-in-out"
        style={{ borderRadius: isHovered ? "12px" : "0px" }}
      >
        <Image
          src={
            studio.image ||
            "/placeholders/studio_image_placeholder.webp"
          }
          alt={studio.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="scale-100 object-cover transition-all duration-300 ease-in-out"
          style={{
            transform: isHovered
              ? "scale(1.2) rotate(4deg)"
              : "scale(1) rotate(0deg)",
          }}
          loading="eager"
        />
      </div>
      <div className="flex flex-row gap-4 text-sm">
        <div>{studio.typefaces.length} type families</div>
        <div>
          {studio.typefaces.reduce(
            (acc, typeface) => acc + typeface.fonts.length,
            0
          )}{" "}
          fonts
        </div>
      </div>
    </Link>
  );
}
