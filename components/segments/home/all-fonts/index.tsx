"use client";

import { MotionValue } from "motion/react";
import { motion } from "motion/react";
import HeaderAllFonts from "@/components/segments/home/all-fonts/header";
import { Typeface } from "@/types/typefaces";
import STUDIOS from "@/mock-data/studios";
import TypefaceCard from "@/components/molecules/cards/typefaces";

export type AllFontsProps = {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export default function AllFonts({ opacity, y, containerRef }: AllFontsProps) {
  const allTypefaces: Typeface[] = STUDIOS.flatMap((studio) =>
    studio.typefaces.map((typeface, index) => {
      const hash = studio.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return {
        ...typeface,
        id: hash + index,
        category: typeface.category || null,
      };
    }),
  );

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full min-h-screen z-30 bg-light-gray mt-[100vh] py-12"
    >
      <motion.div
        className="relative w-full h-full flex flex-col items-start"
        style={{ opacity, y }}
      >
        <HeaderAllFonts />
        <section className="relative w-full px-8 mt-20">
          <div className="grid grid-rows-2 grid-flow-col gap-[60px] w-max">
            {allTypefaces.map((typeface: Typeface, index: number) => {
              const columnIndex = Math.floor(index / 2);
              const isOddColumn = columnIndex % 2 === 1;

              return (
                <div
                  key={`typeface-${index}_${typeface.slug}`}
                  className={isOddColumn ? "pt-[92px]" : ""}
                >
                  <TypefaceCard typeface={typeface} />
                </div>
              );
            })}
          </div>
        </section>
        <div className="relative w-full h-full flex flex-col items-center justify-center"></div>
      </motion.div>
    </div>
  );
}
