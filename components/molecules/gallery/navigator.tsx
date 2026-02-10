import IconChevronLeft from "@/components/icons/icon-chevron-left";
import IconChevronRight from "@/components/icons/icon-chevron-right";
import { cn } from "@/utils/class-names";
import { generateUUID } from "@/utils/generate-uuid";

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
    <div className="relative flex flex-row items-center gap-x-4">
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous slide"
        className="flex h-8 w-8 items-center justify-center"
      >
        <IconChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex flex-row items-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={generateUUID() as string}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "h-1 w-6 rounded-lg transition-all duration-300",
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
        className="flex h-8 w-8 items-center justify-center"
      >
        <IconChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
