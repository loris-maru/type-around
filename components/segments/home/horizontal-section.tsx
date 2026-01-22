"use client";

import { useRef, useMemo } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import STUDIOS from "@/mock-data/studios.ts";
import { Typeface } from "@/types/typefaces";
import TypefaceCard from "@/components/molecules/cards/typeface-card";

export default function HorizontalSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all typefaces from all studios and add required fields
  const allTypefaces: Typeface[] = useMemo(() => {
    return STUDIOS.flatMap((studio) =>
      studio.typefaces.map((typeface, index) => ({
        ...typeface,
        id: studio.id * 1000 + index, // Generate unique ID based on studio ID and index
        category: typeface.category || null, // Ensure category is either string[] or null
        studio: studio.name, // Add studio name
      })),
    );
  }, []);

  // Track scroll progress through the 300vh sticky container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate number of columns (2 cards per column)
  const numColumns = Math.ceil(allTypefaces.length / 2);
  // Each column: card width (300px) + gap (60px) = 360px per column
  // Plus padding on both sides (8 * 2 = 16px total from px-8)
  const columnWidth = 300 + 60; // 360px per column
  const totalWidth = numColumns * columnWidth + 64; // Add padding (32px on each side)
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1920;
  // Calculate translation: move from 0 to -(totalWidth - viewportWidth)
  const translateAmount = Math.min(0, -(totalWidth - viewportWidth));
  const x = useTransform(scrollYProgress, [0, 1], [0, translateAmount]);

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Horizontal scrolling content */}
        <motion.div className="h-full w-max" style={{ x }}>
          <div className="grid grid-rows-2 grid-flow-col gap-[60px] h-full px-8">
            {allTypefaces.map((typeface, index) => {
              const columnIndex = Math.floor(index / 2);
              const isOddColumn = columnIndex % 2 === 1;
              const isTopCard = index % 2 === 0; // First card in each column (0, 2, 4, ...)

              return (
                <div
                  key={typeface.id}
                  className={isOddColumn && isTopCard ? "pt-[120px]" : ""}
                >
                  <TypefaceCard typeface={typeface} />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
