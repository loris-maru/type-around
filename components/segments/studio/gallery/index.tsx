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
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import { GalleryCard } from "@/components/molecules/cards";
import GalleryNavigator from "@/components/molecules/gallery/navigator";
import type { StudioGalleryProps } from "@/types/components";

export default function StudioGallery({
  data,
}: StudioGalleryProps) {
  const { displayFontFamily } = useStudioFonts();
  const { images, title } = data;
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
    emblaApiRef.current?.scrollPrev();
  }, []);

  const scrollNext = useCallback(() => {
    emblaApiRef.current?.scrollNext();
  }, []);

  const scrollTo = useCallback((index: number) => {
    emblaApiRef.current?.scrollTo(index);
  }, []);

  if (!images || images.length === 0) return null;

  const sectionStyle: React.CSSProperties = {};
  if (data.backgroundColor)
    sectionStyle.backgroundColor = data.backgroundColor;
  if (data.fontColor) sectionStyle.color = data.fontColor;

  return (
    <div
      className="relative my-[20vh] w-full px-10"
      style={sectionStyle}
    >
      <header className="relative mb-10 flex w-full flex-row items-center justify-between">
        <h3
          className="text-2xl font-black text-black"
          style={{ fontFamily: displayFontFamily }}
        >
          {title || "Gallery"}
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
        className="relative -mx-2 w-[calc(100%+1rem)] overflow-hidden px-2 pb-4"
        ref={setEmblaRef}
      >
        <div className="relative flex w-full gap-4">
          {images.map((img) => (
            <div
              key={img.key}
              className="relative min-w-0 flex-[0_0_28.57%] pr-4 first:pl-0"
            >
              <GalleryCard image={img} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
