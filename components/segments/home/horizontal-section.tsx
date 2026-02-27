"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { TypefaceCard } from "@/components/molecules/cards";
import CategoryFilter from "@/components/segments/home/all-fonts/category-filter";
import type { HorizontalSectionProps } from "@/types/horizontal-section";
import type { Studio, Typeface } from "@/types/typefaces";
import { cn } from "@/utils/class-names";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalSection({
  studios: initialStudios,
}: HorizontalSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerTrackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [studios, setStudios] = useState<Studio[]>(
    initialStudios ?? []
  );
  const [isLoading, setIsLoading] = useState(
    !initialStudios?.length
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);
  const [isSectionAtTop, setIsSectionAtTop] =
    useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const fetchStudios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/studios/display");
      if (!res.ok)
        throw new Error("Failed to fetch studios");
      const data: Studio[] = await res.json();
      setStudios(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load typefaces"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialStudios?.length) {
      setStudios(initialStudios);
      setIsLoading(false);
    } else {
      fetchStudios();
    }
  }, [initialStudios, fetchStudios]);

  useEffect(() => {
    const updateViewport = () =>
      setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () =>
      window.removeEventListener("resize", updateViewport);
  }, []);

  const allTypefaces: Typeface[] = useMemo(() => {
    if (!studios?.length) return [];
    return studios.flatMap((studio) =>
      (studio.typefaces ?? []).map((typeface, index) => {
        const hash = studio.id
          .split("")
          .reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
          );
        const studioGradient = Array.isArray(
          studio.gradient
        )
          ? studio.gradient[0]
          : "#FFF8E8";
        return {
          ...typeface,
          id: hash + index,
          category: typeface.category || [],
          hangeulName: typeface.hangeulName || "오흐탕크",
          gradient:
            "gradient" in typeface &&
            typeof typeface.gradient === "string"
              ? typeface.gradient
              : studioGradient,
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
  }, [studios]);

  useEffect(() => {
    console.log(
      "All typefaces from Firebase:",
      allTypefaces
    );
  }, [allTypefaces]);

  const filteredTypefaces = useMemo(() => {
    if (selectedCategories.length === 0)
      return allTypefaces;
    return allTypefaces.filter((typeface) =>
      typeface.category.some((cat) =>
        selectedCategories.includes(cat)
      )
    );
  }, [allTypefaces, selectedCategories]);

  const columns = useMemo(() => {
    const cols: Typeface[][] = [];
    const maxCardsPerColumn = 2;
    for (
      let i = 0;
      i < filteredTypefaces.length;
      i += maxCardsPerColumn
    ) {
      const columnCards = filteredTypefaces.slice(
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
  }, [filteredTypefaces]);

  const isMobile = viewportWidth < 768;

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
          onEnter: () => setIsSectionAtTop(true),
          onLeaveBack: () => setIsSectionAtTop(false),
          onLeave: () => setIsSectionAtTop(false),
          onEnterBack: () => setIsSectionAtTop(true),
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

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-light-gray">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-light-gray">
        <p className="text-neutral-600">{error}</p>
        <button
          type="button"
          onClick={fetchStudios}
          className="rounded bg-black px-4 py-2 text-white hover:bg-neutral-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-x-hidden"
    >
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 right-4 z-50 rounded bg-black/80 px-2 py-1 text-white text-xs">
          {allTypefaces.length} typefaces from{" "}
          {studios.length} studios
        </div>
      )}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {isSectionAtTop &&
          typeof document !== "undefined" &&
          createPortal(
            <div className="fixed top-[140px] left-4 z-50 bg-light-gray">
              <CategoryFilter
                selectedCategories={selectedCategories}
                setSelectedCategories={
                  setSelectedCategories
                }
                studios={studios}
              />
            </div>,
            document.body
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
