import { cn } from "@/utils/class-names";

export default function CharactersGrid({
  characterSet,
  currentPage,
  effectiveFontFamily,
  selectedIndex,
  setSelectedIndex,
  CHARS_PER_PAGE,
}: {
  characterSet: string[];
  currentPage: number;
  effectiveFontFamily: string;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  CHARS_PER_PAGE: number;
}) {
  return (
    <div className="grid aspect-square w-full grid-cols-12 grid-rows-12 gap-1">
      {characterSet
        .slice(
          (currentPage - 1) * CHARS_PER_PAGE,
          currentPage * CHARS_PER_PAGE
        )
        .map((char, i) => {
          const idx =
            (currentPage - 1) * CHARS_PER_PAGE + i;
          return (
            <button
              key={`char-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "flex aspect-square items-center justify-center rounded border font-whisper text-lg transition-colors",
                idx === selectedIndex
                  ? "border-black bg-black text-white"
                  : "border-neutral-200 hover:border-neutral-400"
              )}
              style={{
                fontFamily:
                  effectiveFontFamily || "inherit",
              }}
            >
              {char}
            </button>
          );
        })}
    </div>
  );
}
