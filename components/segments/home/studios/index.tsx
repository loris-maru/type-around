"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useMemo, useRef } from "react";
import StudioCard from "@/components/molecules/cards/studios";
import STUDIOS from "@/mock-data/studios";
import type { Studio, Typeface } from "@/types/typefaces";

const PARALLAX_SPEEDS = [-70, -400, -20];

export default function Studios() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y0 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PARALLAX_SPEEDS[0]]
  );
  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PARALLAX_SPEEDS[1]]
  );
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PARALLAX_SPEEDS[2]]
  );

  const columnY = [y0, y1, y2];

  const studiosWithIds: Studio[] = useMemo(() => {
    return STUDIOS.map((studio) => ({
      ...studio,
      typefaces: studio.typefaces.map((typeface, index) => {
        const hash = studio.id
          .split("")
          .reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
          );
        return {
          ...typeface,
          id: hash + index,
          category: typeface.category || null,
        };
      }) as Typeface[],
    }));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-24"
    >
      <header className="relative mb-12 flex w-full flex-row items-center justify-between">
        <h3 className="section-title">The Studios</h3>
        <div className="font-whisper text-black text-sm">
          Total of {studiosWithIds.length} studios
        </div>
      </header>

      <div className="relative flex w-full flex-row gap-12">
        {[0, 1, 2].map((colIndex) => (
          <motion.div
            key={`studio-col-${colIndex}`}
            className={`flex flex-1 flex-col gap-12 ${colIndex === 1 ? "mt-[200px]" : ""}`}
            style={{ y: columnY[colIndex] }}
          >
            {studiosWithIds
              .filter((_, i) => i % 3 === colIndex)
              .map((studio) => (
                <StudioCard
                  key={studio.id}
                  studio={studio}
                />
              ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
