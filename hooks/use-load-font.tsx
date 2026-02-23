"use client";

import { useEffect } from "react";

/**
 * Loads a font from a URL and updates fontFamily state when ready.
 * Runs when fontUrl or fontName changes.
 */
export default function useLoadFont(
  fontUrl: string | undefined,
  fontName: string,
  setFontFamily: (fontFamily: string) => void
) {
  useEffect(() => {
    if (!fontUrl) {
      setFontFamily("");
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const fontFace = new FontFace(
          fontName,
          `url(${fontUrl})`
        );
        const loaded = await fontFace.load();
        document.fonts.add(loaded);
        if (!cancelled) setFontFamily(fontName);
      } catch {
        if (!cancelled) setFontFamily("");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [fontUrl, fontName, setFontFamily]);
}
