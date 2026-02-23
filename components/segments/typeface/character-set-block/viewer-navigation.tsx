import IconChevronLeft from "@/components/icons/icon-chevron-left";
import IconChevronRight from "@/components/icons/icon-chevron-right";
import { cn } from "@/utils/class-names";

export default function ViewerNavigation({
  goPrev,
  goNext,
  selectedIndex,
  characterSet,
  children,
}: {
  goPrev: () => void;
  goNext: () => void;
  selectedIndex: number;
  characterSet: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={goPrev}
          disabled={selectedIndex <= 0}
          aria-label="Previous character"
          className={cn(
            "absolute left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full transition-opacity",
            selectedIndex <= 0
              ? "cursor-not-allowed opacity-30"
              : "hover:bg-neutral-100"
          )}
        >
          <IconChevronLeft className="h-6 w-6" />
        </button>

        <div>{children}</div>

        <button
          type="button"
          onClick={goNext}
          disabled={
            selectedIndex >= characterSet.length - 1
          }
          aria-label="Next character"
          className={cn(
            "absolute right-0 z-10 flex h-12 w-12 items-center justify-center rounded-full transition-opacity",
            selectedIndex >= characterSet.length - 1
              ? "cursor-not-allowed opacity-30"
              : "hover:bg-neutral-100"
          )}
        >
          <IconChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
