"use client";

import Image from "next/image";
import { useState } from "react";

export default function UpdateCard({
  title,
  image,
  date,
  description,
}: {
  title: string;
  image: string;
  date: Date;
  description: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      type="button"
      aria-label="View udpate details"
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="relative flex h-[400px] w-full flex-col"
    >
      <div className="relative mb-4 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={800}
          height={800}
          className="h-auto w-full object-cover"
        />
      </div>
      <div
        className="relative flex w-full flex-col rounded-lg border border-neutral-300 p-4 text-black transition-opacity duration-300 ease-linear"
        style={{ opacity: isHovered ? 1 : 0.3 }}
      >
        <div className="relative flex w-full flex-row items-baseline justify-between">
          <div className="mb-2 hyphens-auto font-black font-ortank text-lg leading-tight">
            {title}
          </div>
          <div className="font-normal font-whisper text-xs">
            {date.toLocaleDateString()}
          </div>
        </div>
        <div className="relative w-full hyphens-auto text-left font-normal font-whisper text-sm">
          {description}
        </div>
      </div>
    </button>
  );
}
