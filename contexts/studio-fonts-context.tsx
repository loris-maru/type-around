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

  // Consider fonts "done" only for the ones that were actually requested.
  const displayDone = !displayFontUrl || displayReady;
  const textDone = !textFontUrl || textReady;
  const fontsReady = displayDone && textDone;

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

      {/* Skeleton — shown while any requested studio font is still loading */}
      {!fontsReady && (
        <div
          className="animate-pulse space-y-6 p-8"
          aria-hidden="true"
        >
          {/* Hero area */}
          <div className="h-64 w-full rounded-2xl bg-neutral-200" />
          {/* Content rows */}
          {[100, 80, 90, 60].map((w, i) => (
            <div
              key={i}
              className="h-6 rounded-lg bg-neutral-200"
              style={{ width: `${w}%` }}
            />
          ))}
          {/* Cards row */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 rounded-xl bg-neutral-200"
              />
            ))}
          </div>
        </div>
      )}

      {/* Real content — hidden (not unmounted) while fonts load so hooks inside still run */}
      <div
        className="studio-page-fonts transition-opacity duration-300"
        style={{
          ...fontStyle,
          opacity: fontsReady ? 1 : 0,
          pointerEvents: fontsReady ? "auto" : "none",
        }}
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
