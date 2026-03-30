"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { StudioFontsContextValue } from "@/types/contexts";

const StudioFontsContext =
  createContext<StudioFontsContextValue | null>(null);

const DISPLAY_FALLBACK = "Ortank, sans-serif";
const TEXT_FALLBACK = '"Whisper", monospace';
const CUSTOM_DISPLAY_NAME = "studio-display-font";
const CUSTOM_TEXT_NAME = "studio-text-font";

function removeFontFamily(familyName: string) {
  for (const face of Array.from(document.fonts)) {
    if (face.family === familyName) {
      document.fonts.delete(face);
    }
  }
}

export function StudioFontsProvider({
  displayFontUrl,
  textFontUrl,
  children,
}: {
  displayFontUrl?: string;
  textFontUrl?: string;
  children: React.ReactNode;
}) {
  const [displayLoaded, setDisplayLoaded] = useState(false);
  const [textLoaded, setTextLoaded] = useState(false);
  const prevDisplayUrl = useRef<string | undefined>(
    undefined
  );
  const prevTextUrl = useRef<string | undefined>(undefined);

  // Clean up fonts from document.fonts on unmount
  useEffect(() => {
    return () => {
      removeFontFamily(CUSTOM_DISPLAY_NAME);
      removeFontFamily(CUSTOM_TEXT_NAME);
    };
  }, []);

  useEffect(() => {
    if (!displayFontUrl) return;
    if (displayFontUrl === prevDisplayUrl.current) return;
    prevDisplayUrl.current = displayFontUrl;

    removeFontFamily(CUSTOM_DISPLAY_NAME);

    let cancelled = false;
    const face = new FontFace(
      CUSTOM_DISPLAY_NAME,
      `url(${displayFontUrl})`,
      { weight: "100 900", style: "normal" }
    );
    face
      .load()
      .then((loaded) => {
        if (cancelled) return;
        document.fonts.add(loaded);
        setDisplayLoaded(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [displayFontUrl]);

  useEffect(() => {
    if (!textFontUrl) return;
    if (textFontUrl === prevTextUrl.current) return;
    prevTextUrl.current = textFontUrl;

    removeFontFamily(CUSTOM_TEXT_NAME);

    let cancelled = false;
    const face = new FontFace(
      CUSTOM_TEXT_NAME,
      `url(${textFontUrl})`,
      { weight: "100 900", style: "normal" }
    );
    face
      .load()
      .then((loaded) => {
        if (cancelled) return;
        document.fonts.add(loaded);
        setTextLoaded(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [textFontUrl]);

  const value = useMemo<StudioFontsContextValue>(() => {
    const useCustomDisplay =
      displayFontUrl && displayLoaded;
    const useCustomText = textFontUrl && textLoaded;
    return {
      displayFontFamily: useCustomDisplay
        ? `"${CUSTOM_DISPLAY_NAME}", ${DISPLAY_FALLBACK}`
        : DISPLAY_FALLBACK,
      textFontFamily: useCustomText
        ? `"${CUSTOM_TEXT_NAME}", ${TEXT_FALLBACK}`
        : TEXT_FALLBACK,
    };
  }, [
    displayFontUrl,
    textFontUrl,
    displayLoaded,
    textLoaded,
  ]);

  return (
    <StudioFontsContext.Provider value={value}>
      {children}
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
