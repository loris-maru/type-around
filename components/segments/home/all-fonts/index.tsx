"use client";

import { motion } from "motion/react";
import HeaderAllFonts from "@/components/segments/home/all-fonts/header";
import type { Typeface } from "@/types/typefaces";
import type { AllFontsProps } from "@/types/components";
import STUDIOS from "@/mock-data/studios";
import { TypefaceCard } from "@/components/molecules/cards";

export default function AllFonts({
  opacity,
  y,
  containerRef,
}: AllFontsProps) {
  const allTypefaces = STUDIOS.flatMap((studio) =>
    studio.typefaces.map((typeface, index) => {
      const hash = studio.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return {
        typeface: {
          ...typeface,
          id: hash + index,
          category: typeface.category || [],
          hangeulName:
            "hangeulName" in typeface &&
            typeof typeface.hangeulName === "string"
              ? typeface.hangeulName
              : "오흐탕크",
          gradient:
            "gradient" in typeface &&
            typeof typeface.gradient === "string"
              ? typeface.gradient
              : Array.isArray(studio.gradient)
                ? studio.gradient[0]
                : studio.gradient,
          fonts: typeface.fonts.map((font) => ({
            ...font,
            price:
              "price" in font
                ? (font as { price: number }).price
                : 0,
            text:
              "text" in font
                ? (font as { text: string }).text
                : "",
          })),
        } as Typeface,
        studioName: studio.name,
      };
    })
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
            {allTypefaces.map(
              ({ typeface, studioName }, index: number) => {
                const columnIndex = Math.floor(index / 2);
                const isOddColumn = columnIndex % 2 === 1;

                return (
                  <div
                    key={`typeface-${index}_${typeface.slug}`}
                    className={
                      isOddColumn ? "pt-[92px]" : ""
                    }
                  >
                    <TypefaceCard
                      typeface={typeface}
                      studioName={studioName}
                    />
                  </div>
                );
              }
            )}
          </div>
        </section>
        <div className="relative w-full h-full flex flex-col items-center justify-center"></div>
      </motion.div>
    </div>
  );
}
