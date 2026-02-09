"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import StudioCard from "@/components/molecules/cards/studios";
import type { Studio } from "@/types/typefaces";

const PARALLAX_SPEEDS = [-70, -400, -20];

export default function StudiosGrid({
  studios,
}: {
  studios: Studio[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={sectionRef}
      className="relative flex w-full flex-row gap-12"
    >
      {[0, 1, 2].map((colIndex) => (
        <motion.div
          key={`studio-col-${colIndex}`}
          className={`flex flex-1 flex-col gap-12 ${colIndex === 1 ? "mt-[200px]" : ""}`}
          style={{ y: columnY[colIndex] }}
        >
          {studios
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
  );
}
