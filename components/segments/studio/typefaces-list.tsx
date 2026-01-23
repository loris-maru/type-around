"use client";

import TypefaceLine from "../typeface/line";
import { Studio, Typeface } from "@/types/typefaces";
import { useMemo } from "react";

export default function TypefacesList({
  studio,
}: {
  studio: Studio;
}) {
  const typefacesWithIds: Typeface[] = useMemo(() => {
    return studio.typefaces.map((typeface, index) => {
      const hash = studio.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return {
        ...typeface,
        id: hash + index,
        category: typeface.category || null,
      };
    }) as Typeface[];
  }, [studio]);

  return (
    <div
      className="w-full flex flex-col py-24"
      id="families"
    >
      {typefacesWithIds.map((typeface, index) => {
        return (
          <div key={typeface.id}>
            <TypefaceLine
              studioName={studio.name}
              familyName={typeface.name}
              styles={typeface.fonts}
              fonts={typeface.fonts}
            />
            {index !== typefacesWithIds.length - 1 && (
              <div className="relative w-full h-px bg-neutral-300 my-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}
