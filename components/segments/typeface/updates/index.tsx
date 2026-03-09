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
import { BLOCK_MARGIN_CLASS_MAP } from "@/constant/BLOCK_CLASS_MAPS";
import { TYPE_UPDATES } from "@/mock-data/type-status";
import type { UpdatesBlockData } from "@/types/layout-typeface";
import { cn } from "@/utils/class-names";

export default function TypefaceUpdates({
  data,
}: {
  data?: UpdatesBlockData;
}) {
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

  const marginClass =
    data?.margin && BLOCK_MARGIN_CLASS_MAP[data.margin]
      ? BLOCK_MARGIN_CLASS_MAP[data.margin]
      : "my-12 lg:my-[20vh]";
  const sectionStyle: React.CSSProperties = {};
  if (data?.backgroundColor)
    sectionStyle.backgroundColor = data.backgroundColor;
  if (data?.textColor) sectionStyle.color = data.textColor;

  return (
    <div
      className={cn(
        "relative w-full px-4 lg:px-10",
        marginClass
      )}
      id="updates"
      style={
        Object.keys(sectionStyle).length > 0
          ? sectionStyle
          : undefined
      }
    >
      <header className="relative mb-10 flex w-full flex-row items-center justify-between">
        <h2 className="font-black font-ortank text-2xl text-black">
          Updates
        </h2>
        <div className="hidden lg:flex">
          <GalleryNavigator
            scrollPrev={scrollPrev}
            scrollNext={scrollNext}
            canScrollPrev={canScrollPrev}
            canScrollNext={canScrollNext}
            selectedIndex={selectedIndex}
            scrollSnaps={scrollSnaps}
            scrollTo={scrollTo}
          />
        </div>
      </header>
      <div
        className="relative -mx-2 w-[calc(100%+1rem)] overflow-hidden px-2 pb-4 lg:mx-0 lg:w-full"
        ref={setEmblaRef}
      >
        <div className="relative flex w-full gap-4">
          {TYPE_UPDATES.map((update) => (
            <div
              key={update.title}
              className="relative min-w-[90vw] flex-[0_0_90vw] shrink-0 pr-4 first:pl-0 lg:min-w-0 lg:flex-[0_0_28.57%]"
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
      <div className="mt-4 flex justify-center px-4 lg:hidden">
        <GalleryNavigator
          scrollPrev={scrollPrev}
          scrollNext={scrollNext}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
          selectedIndex={selectedIndex}
          scrollSnaps={scrollSnaps}
          scrollTo={scrollTo}
        />
      </div>
    </div>
  );
}
