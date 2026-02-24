"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import useLoadFont from "@/hooks/use-load-font";
import type { CharacterSetBlockData } from "@/types/layout-typeface";
import {
  extractCharacterSetFromFont,
  getDefaultCharacterSet,
  getParseableFontUrl,
} from "@/utils/font-character-set";
import CharactersGrid from "./characters-grid";
import FontSelector from "./font-selector";
import CharacterSetBlockNavigation from "./navigation";
import ViewerNavigation from "./viewer-navigation";

// mobile: 6×3, tablet: 8×6, desktop: 12×12, super-desktop: 14×12
const CHARS_BY_BREAKPOINT = {
  mobile: 6 * 3,
  tablet: 8 * 6,
  desktop: 12 * 12,
  superDesktop: 14 * 12,
} as const;

function useCharsPerPage() {
  const width = useSyncExternalStore(
    useCallback((cb: () => void) => {
      window.addEventListener("resize", cb);
      return () => window.removeEventListener("resize", cb);
    }, []),
    useCallback(
      () =>
        typeof window !== "undefined"
          ? window.innerWidth
          : 1024,
      []
    ),
    useCallback(() => 1024, [])
  );
  if (width < 768) return CHARS_BY_BREAKPOINT.mobile;
  if (width < 1024) return CHARS_BY_BREAKPOINT.tablet;
  if (width < 1280) return CHARS_BY_BREAKPOINT.desktop;
  return CHARS_BY_BREAKPOINT.superDesktop;
}

export type CharacterSetFont = {
  id?: string;
  styleName?: string;
  file?: string;
  salesFiles?: string[];
};

export type CharacterSetBlockProps = {
  data?: CharacterSetBlockData;
  fonts: CharacterSetFont[];
};

export default function TypefaceCharacterSetBlock({
  data,
  fonts,
}: CharacterSetBlockProps) {
  const [characterSet, setCharacterSet] = useState<
    string[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFontId, setSelectedFontId] = useState<
    string | null
  >(null);
  const [fontFamily, setFontFamily] = useState<string>("");

  const charsPerPage = useCharsPerPage();

  const isLoading =
    fonts.length > 0 && characterSet.length === 0;
  const effectiveFontId =
    selectedFontId ??
    fonts[0]?.id ??
    fonts[0]?.styleName ??
    "";
  const selectedFont =
    fonts.find(
      (f) => (f.id ?? f.styleName ?? "") === effectiveFontId
    ) ?? fonts[0];
  const effectiveFontFamily = selectedFont?.file
    ? fontFamily
    : "";
  const currentChar = characterSet[selectedIndex] ?? "";
  const totalPages =
    Math.ceil(characterSet.length / charsPerPage) || 1;
  const currentPage =
    Math.floor(selectedIndex / charsPerPage) + 1;

  // Parse font to extract character set
  useEffect(() => {
    if (fonts.length === 0) return;

    let cancelled = false;

    const loadChars = async () => {
      let chars: string[] = [];
      for (const font of fonts) {
        const url = getParseableFontUrl(
          font.file,
          font.salesFiles
        );
        if (url) {
          chars = await extractCharacterSetFromFont(url);
          if (chars.length > 0) break;
        }
      }
      if (chars.length === 0) {
        chars = getDefaultCharacterSet();
        console.log(
          "[CharacterSetBlock] no parseable font, using default glyph set:",
          chars.length,
          "chars",
          chars
        );
      } else {
        console.log(
          "[CharacterSetBlock] glyph set from parsed font:",
          chars.length,
          "chars",
          chars
        );
      }
      if (!cancelled) setCharacterSet(chars);
    };

    loadChars();
    return () => {
      cancelled = true;
    };
  }, [fonts]);

  // Load selected font for display (use file/woff2 for web rendering)
  useLoadFont(
    selectedFont?.file,
    `CharacterSetFont-${selectedFont?.id ?? selectedFont?.styleName}`,
    setFontFamily
  );

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((i) =>
      Math.min(characterSet.length - 1, i + 1)
    );
  }, [characterSet.length]);

  const goToPage = useCallback(
    (page: number) => {
      const p = Math.max(1, Math.min(totalPages, page));
      setSelectedIndex((p - 1) * charsPerPage);
    },
    [totalPages, charsPerPage]
  );

  const sectionStyle: React.CSSProperties = {};
  if (data?.backgroundColor)
    sectionStyle.backgroundColor = data.backgroundColor;
  if (data?.fontColor) sectionStyle.color = data.fontColor;

  if (fonts.length === 0) return null;

  const fontOptions = fonts.map((font) => ({
    value: font.id ?? font.styleName ?? "",
    label: font.styleName ?? "Unknown",
  }));

  return (
    <section
      className="relative flex w-full flex-col px-5 py-12 lg:px-24 lg:py-32"
      id="character-set"
      style={sectionStyle}
    >
      <h2 className="mb-8 font-black font-ortank text-2xl text-black">
        Character set
      </h2>

      <div className="flex h-auto w-full grid-cols-2 flex-col gap-4 lg:grid lg:h-screen lg:gap-12">
        {/* Left column: single character viewer + chevrons + font dropdown */}
        <div className="flex flex-col gap-6">
          <ViewerNavigation
            goPrev={goPrev}
            goNext={goNext}
            selectedIndex={selectedIndex}
            characterSet={characterSet}
          >
            <div
              className="flex min-h-[200px] w-full items-center justify-center overflow-hidden"
              style={{
                fontFamily:
                  effectiveFontFamily || "inherit",
              }}
            >
              {isLoading ? (
                <span className="font-whisper text-2xl text-neutral-400">
                  Loading…
                </span>
              ) : (
                <span className="text-[50vw] leading-none lg:text-[32vw]">
                  {currentChar || " "}
                </span>
              )}
            </div>
          </ViewerNavigation>

          <FontSelector
            effectiveFontId={effectiveFontId}
            fontOptions={fontOptions}
            setSelectedFontId={setSelectedFontId}
          />
        </div>

        {/* Right column: 12x12 grid pagination (only non-empty chars) */}
        <div className="flex flex-col gap-4">
          <CharactersGrid
            characterSet={characterSet}
            currentPage={currentPage}
            effectiveFontFamily={effectiveFontFamily}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            CHARS_PER_PAGE={charsPerPage}
          />

          <CharacterSetBlockNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        </div>
      </div>
    </section>
  );
}
