"use client";

import { useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { PARALLAX_SPEEDS } from "@/constant/UI_LAYOUT";
import type { Studio } from "@/types/typefaces";
import StudiosDesktop from "./desktop";
import StudiosMobileTablet from "./mobile-tablet";

export default function Studios({
  studios,
}: {
  studios: Studio[];
}) {
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-8 lg:px-24"
    >
      <header className="relative mb-12 flex w-full flex-col items-start justify-between lg:flex-row lg:items-center">
        <h2 className="section-title text-left">
          The Studios
        </h2>
        <div className="font-whisper text-black text-sm">
          Total of {studios.length} studios
        </div>
      </header>

      <div className="hidden lg:block">
        <StudiosDesktop
          studios={studios}
          columnY={columnY}
        />
      </div>
      <div className="-mx-8 block w-screen overflow-hidden lg:hidden">
        <StudiosMobileTablet studios={studios} />
      </div>
    </section>
  );
}
