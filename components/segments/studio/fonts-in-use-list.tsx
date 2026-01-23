"use client";

import {
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import EmblaCarousel, {
  EmblaCarouselType,
} from "embla-carousel";
import FontsInUseCard from "@/components/molecules/cards/fonts-in-use";
import { FONTS_IN_USE } from "@/mock-data/fonts-in-use";

const CARDS_PER_VIEW = 3;

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
      slidesToScroll: CARDS_PER_VIEW,
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
    FONTS_IN_USE.length / CARDS_PER_VIEW
  );

  return (
    <div className="relative w-full px-10 py-24">
      <div className="relative p-5 border border-neutral-300 rounded-2xl">
        <header className="relative mb-10">
          <h3 className="section-title">Fonts in use</h3>
        </header>
        <div
          className="relative w-full overflow-hidden"
          ref={setEmblaRef}
        >
          <div className="relative w-full flex py-2">
            {FONTS_IN_USE.map((font) => (
              <div
                key={font.id}
                className="relative flex-[0_0_33.333%] min-w-0 h-full pl-4 first:pl-0 px-2"
              >
                <FontsInUseCard
                  name={font.name}
                  typeface={font.typeface}
                  category={font.category}
                  description={font.description}
                  image={font.image}
                />
              </div>
            ))}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="relative w-full flex flex-row justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map(
              (_, index) => {
                const slideIndex = index * CARDS_PER_VIEW;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollTo(slideIndex)}
                    aria-label={`Go to page ${index + 1}`}
                    className={`w-8 h-2 rounded-lg transition-all duration-300 ${
                      selectedIndex >= slideIndex &&
                      selectedIndex <
                        slideIndex + CARDS_PER_VIEW
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
