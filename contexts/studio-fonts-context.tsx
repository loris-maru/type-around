"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type StudioFontsContextValue = {
  displayFontFamily: string;
  textFontFamily: string;
};

const StudioFontsContext =
  createContext<StudioFontsContextValue | null>(null);

const DISPLAY_FALLBACK = "Ortank, sans-serif";
const TEXT_FALLBACK = '"Whisper", monospace';
const CUSTOM_DISPLAY_NAME = "studio-display-font";
const CUSTOM_TEXT_NAME = "studio-text-font";

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

  const loadFont = useCallback(
    (url: string, familyName: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const existing = Array.from(document.fonts).find(
          (f) => f.family === familyName
        );
        if (existing) {
          resolve(true);
          return;
        }

        const face = new FontFace(
          familyName,
          `url(${url})`,
          { weight: "100 900", style: "normal" }
        );

        face
          .load()
          .then((loaded) => {
            document.fonts.add(loaded);
            resolve(true);
          })
          .catch(() => resolve(false));
      });
    },
    []
  );

  useEffect(() => {
    if (!displayFontUrl) return;
    loadFont(displayFontUrl, CUSTOM_DISPLAY_NAME).then(
      setDisplayLoaded
    );
  }, [displayFontUrl, loadFont]);

  useEffect(() => {
    if (!textFontUrl) return;
    loadFont(textFontUrl, CUSTOM_TEXT_NAME).then(
      setTextLoaded
    );
  }, [textFontUrl, loadFont]);

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
