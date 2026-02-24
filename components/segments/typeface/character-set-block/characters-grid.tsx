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
    <div className="grid aspect-2/1 w-full grid-cols-6 grid-rows-3 gap-1 md:aspect-4/3 md:grid-cols-8 md:grid-rows-6 lg:aspect-square lg:grid-cols-12 lg:grid-rows-12 xl:aspect-6/7 xl:grid-cols-12 xl:grid-rows-14">
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
