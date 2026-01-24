import IconChevronLeft from "@/components/icons/icon-chevron-left";
import IconChevronRight from "@/components/icons/icon-chevron-right";
import { cn } from "@/utils/class-names";

export default function GalleryNavigator({
  scrollPrev,
  scrollNext,
  canScrollPrev,
  canScrollNext,
  selectedIndex,
  scrollSnaps,
  scrollTo,
}: {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnaps: number[];
  scrollTo: (index: number) => void;
}) {
  return (
    <div className="relative flex flex-row gap-x-4 items-center">
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous slide"
        className="flex items-center justify-center w-10 h-10"
      >
        <IconChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex flex-row gap-2 items-center">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "w-8 h-2 rounded-lg transition-all duration-300",
              selectedIndex === index
                ? "bg-black"
                : "bg-neutral-300 hover:bg-neutral-400"
            )}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next slide"
        className="flex items-center justify-center w-10 h-10"
      >
        <IconChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
