"use client";

import { useRef, useMemo } from "react";
import {
  useScroll,
  useTransform,
  motion,
  useInView,
} from "motion/react";
import STUDIOS from "@/mock-data/studios";
import { Typeface } from "@/types/typefaces";
import HeaderAllFonts from "@/components/segments/home/all-fonts/header";
import TypefaceCard from "@/components/molecules/cards/typefaces";

export default function HorizontalSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const allTypefaces: Typeface[] = useMemo(() => {
    return STUDIOS.flatMap((studio) =>
      studio.typefaces.map((typeface, index) => {
        const hash = studio.id
          .split("")
          .reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
          );
        return {
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
        } as Typeface;
      })
    );
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const isInView = useInView(stickyRef, {
    amount: 0.55,
    once: false,
  });

  const columns = useMemo(() => {
    const cols: Typeface[][] = [];
    const maxCardsPerColumn = 2;
    for (
      let i = 0;
      i < allTypefaces.length;
      i += maxCardsPerColumn
    ) {
      const columnCards = allTypefaces.slice(
        i,
        i + maxCardsPerColumn
      );
      const limitedCards = columnCards.slice(
        0,
        maxCardsPerColumn
      );
      if (
        limitedCards.length > 0 &&
        limitedCards.length <= maxCardsPerColumn
      ) {
        cols.push(limitedCards);
      }
    }
    return cols;
  }, [allTypefaces]);

  const numColumns = columns.length;
  const columnWidth = 300 + 60;
  const totalWidth = numColumns * columnWidth + 64;
  const viewportWidth =
    typeof window !== "undefined"
      ? window.innerWidth
      : 1920;
  const translateAmount = Math.min(
    0,
    -(totalWidth - viewportWidth)
  );
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, translateAmount]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[300vh] w-full"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {isInView && (
          <div className="fixed top-3 left-28 z-50 bg-light-gray">
            <HeaderAllFonts />
          </div>
        )}
        <motion.div
          className="h-full w-max pt-10"
          style={{ x }}
        >
          <div className="flex flex-row gap-x-[60px] px-8 h-full items-start">
            {columns.map((columnTypefaces, columnIndex) => {
              const isOddColumn = columnIndex % 2 === 1;

              return (
                <div
                  key={columnIndex}
                  className="flex flex-col gap-y-[80px]"
                >
                  {columnTypefaces
                    .slice(0, 2)
                    .map((typeface, cardIndex) => (
                      <div
                        key={typeface.id}
                        className={
                          isOddColumn && cardIndex === 0
                            ? "pt-[120px]"
                            : ""
                        }
                      >
                        <TypefaceCard
                          studioName={typeface.studio}
                          typeface={typeface}
                        />
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
