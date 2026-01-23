"use client";

import StudioCard from "@/components/molecules/cards/studios";
import STUDIOS from "@/mock-data/studios";
import { Studio, Typeface } from "@/types/typefaces";
import { useMemo } from "react";

export default function Studios() {
  const studiosWithIds: Studio[] = useMemo(() => {
    return STUDIOS.map((studio) => ({
      ...studio,
      typefaces: studio.typefaces.map((typeface, index) => {
        const hash = studio.id
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return {
          ...typeface,
          id: hash + index,
          category: typeface.category || null,
        };
      }) as Typeface[],
    }));
  }, []);

  return (
    <section className="relative w-full px-24">
      <div className="relative w-full bg-white rounded-2xl p-5">
        <header className="relative w-full flex flex-row justify-between items-center mb-12">
          <h3 className="section-title">The Studios</h3>
          <div className="font-whisper text-sm text-black">
            Total of {studiosWithIds.length} studios
          </div>
        </header>

        <div className="relative w-full grid grid-cols-3 gap-12">
          {studiosWithIds.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>
      </div>
    </section>
  );
}
