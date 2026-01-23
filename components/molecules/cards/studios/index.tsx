"use client";

import { Studio } from "@/types/typefaces";
import { slugify } from "@/utils/slugify";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function StudioCard({
  studio,
}: {
  studio: Studio;
}) {
  const [isHovered, setIsHovered] =
    useState<boolean>(false);

  return (
    <Link
      href={`/studio/${slugify(studio.name)}`}
      className="relative w-full flex flex-col justify-between bg-white border border-black shadow-button p-5 rounded-lg transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover"
      prefetch={false}
      onMouseOver={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onBlur={() => setIsHovered(false)}
    >
      <header className="relative flex flex-col gap-2">
        <div className="font-black text-2xl font-ortank">
          {studio.name}
        </div>
        <div className="block w-full h-px bg-neutral-300" />
        <div className="flex flex-row gap-4 text-sm">
          <div>{studio.typefaces.length} type families</div>
          <div>
            {studio.typefaces.reduce(
              (acc, typeface) => acc + typeface.fonts,
              0
            )}{" "}
            fonts
          </div>
        </div>
      </header>
      <div
        className="relative w-full h-[220px] my-3 overflow-hidden transition-all duration-300 ease-in-out"
        style={{ borderRadius: isHovered ? "24px" : "0px" }}
      >
        <Image
          src={studio.image}
          alt={studio.name}
          width={100}
          height={100}
          className="w-full h-auto object-cover scale-100 hover:scale-125 transition-all duration-300 ease-in-out"
          style={{
            transform: isHovered
              ? "scale(1.2)"
              : "scale(1)",
          }}
        />
      </div>
      <p className="text-base font-normal leading-normal">
        {studio.description}
      </p>
    </Link>
  );
}
