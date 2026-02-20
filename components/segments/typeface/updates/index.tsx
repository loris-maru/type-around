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
import { UpdateCard } from "@/components/molecules/cards";
import GalleryNavigator from "@/components/molecules/gallery/navigator";
import { TYPE_UPDATES } from "@/mock-data/type-status";

export default function TypefaceUpdates() {
  const [emblaRef, setEmblaRef] =
    useState<HTMLDivElement | null>(null);
  const emblaApiRef = useRef<EmblaCarouselType | null>(
    null
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>(
    []
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaRef) return;

    const embla = EmblaCarousel(emblaRef, {
      slidesToScroll: 1,
      align: "start",
      containScroll: "trimSnaps",
    });

    emblaApiRef.current = embla;

    const onSelect = () => {
      const currentIndex = embla.selectedScrollSnap();
      setSelectedIndex(currentIndex);
      setCanScrollPrev(embla.canScrollPrev());
      setCanScrollNext(embla.canScrollNext());
    };

    const updateScrollSnaps = () => {
      setScrollSnaps(embla.scrollSnapList());
    };

    onSelect();
    updateScrollSnaps();
    embla.on("select", onSelect);
    embla.on("reInit", updateScrollSnaps);

    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", updateScrollSnaps);
      embla.destroy();
      emblaApiRef.current = null;
    };
  }, [emblaRef]);

  const scrollPrev = useCallback(() => {
    if (emblaApiRef.current) {
      emblaApiRef.current.scrollPrev();
    }
  }, []);

  const scrollNext = useCallback(() => {
    if (emblaApiRef.current) {
      emblaApiRef.current.scrollNext();
    }
  }, []);

  const scrollTo = useCallback((index: number) => {
    if (emblaApiRef.current) {
      emblaApiRef.current.scrollTo(index);
    }
  }, []);

  return (
    <div
      className="relative my-[20vh] w-full px-10"
      id="updates"
    >
      <header className="relative mb-10 flex w-full flex-row items-center justify-between">
        <h3 className="font-black font-ortank text-2xl text-black">
          Updates
        </h3>
        <GalleryNavigator
          scrollPrev={scrollPrev}
          scrollNext={scrollNext}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
          selectedIndex={selectedIndex}
          scrollSnaps={scrollSnaps}
          scrollTo={scrollTo}
        />
      </header>
      <div
        className="relative w-full overflow-hidden"
        ref={setEmblaRef}
      >
        <div className="relative flex w-full gap-4">
          {TYPE_UPDATES.map((update) => (
            <div
              key={update.title}
              className="relative min-w-0 flex-[0_0_28.57%] pr-4 first:pl-0"
            >
              <UpdateCard
                title={update.title}
                image={update.image}
                date={update.date}
                description={update.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
