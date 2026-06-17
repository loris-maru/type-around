"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import StudioPageFontFace from "@/components/global/studio-page-font-face";
import {
  STUDIO_DISPLAY_FONT_FAMILY,
  STUDIO_TEXT_FONT_FAMILY,
} from "@/constant/STUDIO_PAGE_FONT_FAMILIES";
import type { StudioFontsContextValue } from "@/types/contexts";

const StudioFontsContext =
  createContext<StudioFontsContextValue | null>(null);

const DISPLAY_FALLBACK = "Ortank, sans-serif";
const TEXT_FALLBACK = '"Whisper", monospace';

export function StudioFontsProvider({
  displayFontUrl,
  textFontUrl,
  children,
}: {
  displayFontUrl?: string;
  textFontUrl?: string;
  children: React.ReactNode;
}) {
  const [displayReady, setDisplayReady] = useState(false);
  const [textReady, setTextReady] = useState(false);

  const value = useMemo<StudioFontsContextValue>(() => {
    const useCustomDisplay = displayFontUrl && displayReady;
    const useCustomText = textFontUrl && textReady;
    return {
      displayFontFamily: useCustomDisplay
        ? `"${STUDIO_DISPLAY_FONT_FAMILY}", ${DISPLAY_FALLBACK}`
        : DISPLAY_FALLBACK,
      textFontFamily: useCustomText
        ? `"${STUDIO_TEXT_FONT_FAMILY}", ${TEXT_FALLBACK}`
        : TEXT_FALLBACK,
    };
  }, [
    displayFontUrl,
    textFontUrl,
    displayReady,
    textReady,
  ]);

  const fontStyle = {
    ["--studio-display-font-family" as string]:
      value.displayFontFamily,
    ["--studio-text-font-family" as string]:
      value.textFontFamily,
  } as React.CSSProperties;

  return (
    <StudioFontsContext.Provider value={value}>
      {displayFontUrl ? (
        <StudioPageFontFace
          key={displayFontUrl}
          family={STUDIO_DISPLAY_FONT_FAMILY}
          url={displayFontUrl}
          fallbackFamily={DISPLAY_FALLBACK}
          onReadyChange={setDisplayReady}
        />
      ) : null}
      {textFontUrl ? (
        <StudioPageFontFace
          key={textFontUrl}
          family={STUDIO_TEXT_FONT_FAMILY}
          url={textFontUrl}
          fallbackFamily={TEXT_FALLBACK}
          onReadyChange={setTextReady}
        />
      ) : null}
      {/* Always render children — CSS variables start at fallback fonts and
          update to custom fonts once StudioPageFontFace resolves.
          Keeping the tree stable avoids SSR/client hydration mismatches. */}
      <div
        className="studio-page-fonts"
        style={fontStyle}
      >
        {children}
      </div>
    </StudioFontsContext.Provider>
  );
}

export function useStudioFonts(): StudioFontsContextValue {
  const ctx = useContext(StudioFontsContext);
  if (!ctx) {
    return {
      displayFontFamily: DISPLAY_FALLBACK,
      textFontFamily: TEXT_FALLBACK,
    };
  }
  return ctx;
}
