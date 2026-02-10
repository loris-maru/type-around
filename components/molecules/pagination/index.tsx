import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";

export default function Pagination({
  goToPrev,
  goToNext,
  canPrev,
  canNext,
  startIndex,
  endIndex,
  totalItems,
}: {
  goToPrev: () => void;
  goToNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}) {
  return (
    <div className="flex w-full items-center justify-center gap-4">
      <button
        type="button"
        onClick={goToPrev}
        disabled={!canPrev}
        aria-label="Previous fonts in use"
        className="flex h-9 w-9 cursor-pointer items-center justify-center transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <RiArrowLeftSLine size={20} />
      </button>
      <span className="font-normal font-whisper text-neutral-600 text-sm">
        {startIndex + 1}–{endIndex} of {totalItems}
      </span>
      <button
        type="button"
        onClick={goToNext}
        disabled={!canNext}
        aria-label="Next fonts in use"
        className="flex h-9 w-9 cursor-pointer items-center justify-center transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <RiArrowRightSLine size={20} />
      </button>
    </div>
  );
}
