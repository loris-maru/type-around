"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TypefaceCard } from "@/components/molecules/cards";
import HeaderAllFonts from "@/components/segments/home/all-fonts/header";
import STUDIOS from "@/mock-data/studios";
import type { Typeface } from "@/types/typefaces";
import { cn } from "@/utils/class-names";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerTrackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const updateViewport = () =>
      setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () =>
      window.removeEventListener("resize", updateViewport);
  }, []);

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

  const isMobile = viewportWidth < 768;

  const isInView = useInView(stickyRef, {
    amount: 1,
    once: false,
  });

  useGSAP(
    () => {
      const container = containerRef.current;
      const innerTrack = innerTrackRef.current;
      if (!container || !innerTrack) return;

      const getScrollDistance = () => {
        const w = innerTrack.scrollWidth;
        const vw = window.innerWidth;
        return Math.max(w - vw, 0);
      };

      const getEndValue = () => innerTrack.scrollWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          start: "top top",
          end: () => `+=${getEndValue()}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(innerTrack, {
        x: () => -getScrollDistance(),
        ease: "none",
      });
    },
    {
      dependencies: [columns.length, viewportWidth],
      revertOnUpdate: true,
    }
  );

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-x-hidden"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {isInView && (
          <div className="fixed top-3 left-6 z-50 bg-light-gray md:left-28">
            <HeaderAllFonts />
          </div>
        )}
        <div
          ref={innerTrackRef}
          className="h-full w-max pt-10"
        >
          <div className="flex h-full flex-row items-center gap-x-6 px-6 md:gap-x-10 md:px-8">
            {columns.map((columnTypefaces, columnIndex) => {
              const isOddColumn = columnIndex % 2 === 1;

              return (
                <div
                  key={
                    columnTypefaces[0]?.id ?? columnIndex
                  }
                  className={cn(
                    "flex shrink-0 flex-col gap-y-[40px]",
                    isMobile
                      ? "w-[224px]"
                      : "w-[280px] md:w-[340px]"
                  )}
                >
                  {columnTypefaces
                    .slice(0, 2)
                    .map((typeface, cardIndex) => (
                      <div
                        key={typeface.id}
                        className={
                          isOddColumn && cardIndex === 0
                            ? "pt-[60px]"
                            : ""
                        }
                      >
                        <TypefaceCard
                          studioName={typeface.studio}
                          typeface={typeface}
                          compact={isMobile}
                        />
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
