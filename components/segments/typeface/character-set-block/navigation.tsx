import {
  RiArrowDropLeftLine,
  RiArrowDropRightLine,
} from "react-icons/ri";

export default function CharacterSetBlockNavigation({
  currentPage,
  totalPages,
  goToPage,
}: {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-12">
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="rounded p-1 disabled:opacity-30"
      >
        <RiArrowDropLeftLine className="h-8 w-8" />
      </button>
      <span className="font-whisper text-sm">
        {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="rounded p-1 disabled:opacity-30"
      >
        <RiArrowDropRightLine className="h-8 w-8" />
      </button>
    </div>
  );
}
