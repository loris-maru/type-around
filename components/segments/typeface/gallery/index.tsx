"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { cn } from "@/utils/class-names";

type TypefaceGalleryImage = {
  src: string;
  alt?: string;
};

type TypefaceGalleryProps = {
  images: TypefaceGalleryImage[];
};

type TransitionPhase =
  | "idle"
  | "cover-up"
  | "hold"
  | "uncover-up";

export default function TypefaceGallery({
  images,
}: TypefaceGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] =
    useState<TransitionPhase>("idle");
  const pendingIndex = useRef<number | null>(null);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < images.length - 1;

  const goTo = useCallback(
    (nextIndex: number) => {
      if (phase !== "idle") return;
      if (nextIndex < 0 || nextIndex >= images.length)
        return;

      pendingIndex.current = nextIndex;
      setPhase("cover-up");
    },
    [phase, images.length]
  );

  const handleTransitionEnd = useCallback(() => {
    if (phase === "cover-up") {
      // Overlay fully covers the image — swap the slide and hold
      if (pendingIndex.current !== null) {
        setCurrentIndex(pendingIndex.current);
        pendingIndex.current = null;
      }
      setPhase("hold");
      setTimeout(() => {
        setPhase("uncover-up");
      }, 100);
    } else if (phase === "uncover-up") {
      setPhase("idle");
    }
  }, [phase]);

  const scrollPrev = useCallback(
    () => goTo(currentIndex - 1),
    [goTo, currentIndex]
  );
  const scrollNext = useCallback(
    () => goTo(currentIndex + 1),
    [goTo, currentIndex]
  );

  if (!images.length) return null;

  return (
    <section className="relative w-full px-24">
      {/* Counter */}
      <div className="mb-4">
        <span className="font-whisper text-neutral-500 text-sm">
          <span className="text-black">
            {currentIndex + 1}
          </span>
          {" / "}
          {images.length}
        </span>
      </div>

      {/* Image + side arrows */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canPrev || phase !== "idle"}
          aria-label="Previous image"
          className={cn(
            "absolute top-1/2 -left-[60px] z-10 flex -translate-y-1/2 items-center justify-center rounded-full transition-opacity",
            canPrev && phase === "idle"
              ? "cursor-pointer opacity-100 hover:opacity-60"
              : "cursor-default opacity-20"
          )}
        >
          <RiArrowLeftSLine size={32} />
        </button>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={images[currentIndex].src}
            alt={
              images[currentIndex].alt ||
              `Gallery image ${currentIndex + 1}`
            }
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority={currentIndex === 0}
          />

          {/* Transition overlay */}
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 z-20 bg-black",
              phase === "cover-up" &&
                "bottom-0 animate-[coverUp_400ms_ease-in-out_forwards]",
              phase === "hold" && "inset-y-0",
              phase === "uncover-up" &&
                "top-0 animate-[uncoverUp_400ms_ease-in-out_forwards]",
              phase === "idle" && "hidden"
            )}
            onAnimationEnd={handleTransitionEnd}
          />
        </div>

        <button
          type="button"
          onClick={scrollNext}
          disabled={!canNext || phase !== "idle"}
          aria-label="Next image"
          className={cn(
            "absolute top-1/2 -right-[60px] z-10 flex -translate-y-1/2 items-center justify-center rounded-full transition-opacity",
            canNext && phase === "idle"
              ? "cursor-pointer opacity-100 hover:opacity-60"
              : "cursor-default opacity-20"
          )}
        >
          <RiArrowRightSLine size={32} />
        </button>
      </div>
    </section>
  );
}
