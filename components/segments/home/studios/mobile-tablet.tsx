"use client";

import EmblaCarousel, {
  type EmblaCarouselType,
} from "embla-carousel";
import { motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  RiArrowDropLeftLine,
  RiArrowDropRightLine,
} from "react-icons/ri";
import { StudioCard } from "@/components/molecules/cards";
import type { Studio } from "@/types/typefaces";

const SIDE_OPACITY = 0.5;
const SIDE_SCALE = 0.75;
const TILT_SENSITIVITY = 0.15;

function getSlidePosition(
  index: number,
  selectedIndex: number,
  total: number
): "prev" | "active" | "next" | "hidden" {
  if (total <= 1) return "active";
  const diff = (index - selectedIndex + total) % total;
  if (diff === 0) return "active";
  if (diff === 1) return "next";
  if (diff === total - 1) return "prev";
  return "hidden";
}

export default function StudiosMobileTablet({
  studios,
}: {
  studios: Studio[];
}) {
  const [emblaRef, setEmblaRef] =
    useState<HTMLDivElement | null>(null);
  const emblaApiRef = useRef<EmblaCarouselType | null>(
    null
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!emblaRef || studios.length === 0) return;

    const embla = EmblaCarousel(emblaRef, {
      loop: true,
      align: "center",
      slidesToScroll: 1,
      containScroll: false,
    });

    emblaApiRef.current = embla;

    const onSelect = () =>
      setSelectedIndex(embla.selectedScrollSnap());

    onSelect();
    embla.on("select", onSelect);

    return () => {
      embla.off("select", onSelect);
      embla.destroy();
      emblaApiRef.current = null;
    };
  }, [emblaRef, studios.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOrientation = (
      e: DeviceOrientationEvent
    ) => {
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      setTilt({
        x: Math.max(
          -30,
          Math.min(30, gamma * TILT_SENSITIVITY)
        ),
        y: Math.max(
          -30,
          Math.min(30, (beta - 45) * TILT_SENSITIVITY)
        ),
      });
    };

    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        "requestPermission" in DeviceOrientationEvent
      ) {
        try {
          const permission = await (
            DeviceOrientationEvent as unknown as {
              requestPermission: () => Promise<string>;
            }
          ).requestPermission();
          if (permission === "granted") {
            window.addEventListener(
              "deviceorientation",
              handleOrientation,
              true
            );
          }
        } catch {
          // Permission denied or not supported
        }
      } else {
        window.addEventListener(
          "deviceorientation",
          handleOrientation,
          true
        );
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleOrientation,
        true
      );
    };
  }, []);

  const scrollPrev = useCallback(() => {
    emblaApiRef.current?.scrollPrev();
  }, []);

  const scrollNext = useCallback(() => {
    emblaApiRef.current?.scrollNext();
  }, []);

  const requestTiltPermission = useCallback(() => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      "requestPermission" in DeviceOrientationEvent
    ) {
      (
        DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<string>;
        }
      )
        .requestPermission()
        .then((permission) => {
          if (permission === "granted")
            setTilt({ x: 0, y: 0 });
        })
        .catch(() => {});
    }
  }, []);

  if (studios.length === 0) return null;

  return (
    <div>
      <div
        className="relative flex w-full overflow-hidden py-8 lg:hidden"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={setEmblaRef}
          className="w-full overflow-hidden"
          onTouchStart={requestTiltPermission}
          onPointerDown={requestTiltPermission}
        >
          <div className="flex gap-[2px]">
            {studios.map((studio, index) => {
              const position = getSlidePosition(
                index,
                selectedIndex,
                studios.length
              );
              const isActive = position === "active";

              return (
                <div
                  key={studio.id}
                  className="relative min-w-0 shrink-0"
                  style={{ width: "70vw" }}
                >
                  <motion.div
                    className="relative h-full w-full"
                    initial={false}
                    animate={{
                      opacity:
                        position === "hidden"
                          ? 0
                          : isActive
                            ? 1
                            : SIDE_OPACITY,
                      scale: isActive ? 1 : SIDE_SCALE,
                      rotateX: isActive ? tilt.y : 0,
                      rotateY: isActive ? tilt.x : 0,
                    }}
                    transition={{
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                      rotateX: { duration: 0.1 },
                      rotateY: { duration: 0.1 },
                    }}
                    style={{
                      transformOrigin: "center center",
                      perspective: "1000px",
                    }}
                  >
                    <StudioCard studio={studio} />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-4">
        <button
          type="button"
          onClick={scrollPrev}
          className="flex items-center justify-center p-2 transition-opacity hover:opacity-70"
          aria-label="Previous studio"
        >
          <RiArrowDropLeftLine className="h-12 w-12" />
        </button>
        <span className="font-whisper text-black text-lg">
          Studio {selectedIndex + 1} / {studios.length}
        </span>
        <button
          type="button"
          onClick={scrollNext}
          className="flex items-center justify-center p-2 transition-opacity hover:opacity-70"
          aria-label="Next studio"
        >
          <RiArrowDropRightLine className="h-12 w-12" />
        </button>
      </div>
    </div>
  );
}
