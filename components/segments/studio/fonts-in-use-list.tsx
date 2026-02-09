"use client";

import EmblaCarousel, {
  type EmblaCarouselType,
} from "embla-carousel";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import FontsInUseCard from "@/components/molecules/cards/fonts-in-use";
import { FONTS_IN_USE_CARDS_PER_VIEW } from "@/constant/UI_LAYOUT";
import { FONTS_IN_USE } from "@/mock-data/fonts-in-use";

export default function FontsInUseList() {
  const [emblaRef, setEmblaRef] =
    useState<HTMLDivElement | null>(null);
  const emblaApiRef = useRef<EmblaCarouselType | null>(
    null
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaRef) return;

    const embla = EmblaCarousel(emblaRef, {
      slidesToScroll: FONTS_IN_USE_CARDS_PER_VIEW,
      align: "start",
      containScroll: "trimSnaps",
    });

    emblaApiRef.current = embla;

    const onSelect = () => {
      setSelectedIndex(embla.selectedScrollSnap());
    };

    onSelect();
    embla.on("select", onSelect);

    return () => {
      embla.off("select", onSelect);
      embla.destroy();
      emblaApiRef.current = null;
    };
  }, [emblaRef]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApiRef.current) {
      emblaApiRef.current.scrollTo(index);
    }
  }, []);

  const totalPages = Math.ceil(
    FONTS_IN_USE.length / FONTS_IN_USE_CARDS_PER_VIEW
  );

  return (
    <div className="relative w-full px-10 py-24">
      <div className="relative rounded-2xl">
        <header className="relative mb-2 flex flex-row items-center justify-between">
          <h3 className="section-title">Fonts in use</h3>
          <div className="font-whisper text-black text-sm">
            Total of {FONTS_IN_USE.length} fonts in use
          </div>
        </header>
        <div
          className="relative w-full overflow-hidden rounded-lg border border-neutral-300 p-4"
          ref={setEmblaRef}
        >
          <div className="relative flex w-full">
            {FONTS_IN_USE.map((font) => (
              <div
                key={font.id}
                className="relative h-full min-w-0 flex-[0_0_33.333%] px-2 pl-4 first:pl-0"
              >
                <FontsInUseCard
                  name={font.name}
                  typeface={font.typeface}
                  category={font.category}
                  image={font.image}
                />
              </div>
            ))}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="relative mt-8 flex w-full flex-row items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map(
              (_, index) => {
                const slideIndex =
                  index * FONTS_IN_USE_CARDS_PER_VIEW;
                return (
                  <button
                    key={slideIndex}
                    type="button"
                    onClick={() => scrollTo(slideIndex)}
                    aria-label={`Go to page ${index + 1}`}
                    className={`h-2 w-8 rounded-lg transition-all duration-300 ${
                      selectedIndex >= slideIndex &&
                      selectedIndex <
                        slideIndex +
                          FONTS_IN_USE_CARDS_PER_VIEW
                        ? "bg-black"
                        : "bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  />
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}
