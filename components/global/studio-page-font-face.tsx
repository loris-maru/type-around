"use client";

import { useFont } from "@react-hooks-library/core";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { STUDIO_PAGE_FONT_DESCRIPTORS } from "@/constant/STUDIO_PAGE_FONT_FAMILIES";

function removeFontFamily(familyName: string) {
  for (const face of Array.from(document.fonts)) {
    if (face.family === familyName) {
      document.fonts.delete(face);
    }
  }
}

export type StudioPageFontFaceRenderState = {
  ready: boolean;
  error: boolean;
  fontFamily: string;
};

type StudioPageFontFaceProps = {
  family: string;
  url: string;
  fallbackFamily: string;
  onReadyChange?: (ready: boolean) => void;
  children?: (
    state: StudioPageFontFaceRenderState
  ) => ReactNode;
};

/**
 * Loads a studio page font via useFont from @react-hooks-library/core.
 * Renders nothing unless children is provided (e.g. for upload previews).
 */
export default function StudioPageFontFace({
  family,
  url,
  fallbackFamily,
  onReadyChange,
  children,
}: StudioPageFontFaceProps) {
  const trimmedUrl = url.trim();
  const [fallbackReady, setFallbackReady] = useState(false);
  const onReadyChangeRef = useRef(onReadyChange);

  useEffect(() => {
    onReadyChangeRef.current = onReadyChange;
  }, [onReadyChange]);

  const { loaded, error, font } = useFont(
    family,
    trimmedUrl,
    STUDIO_PAGE_FONT_DESCRIPTORS
  );

  const hookReady = Boolean(font) && loaded && !error;

  // useFont does not reset `error` when `url` changes; remount via `key` on
  // the parent handles that. This fallback covers OTF / edge cases after hook failure.
  useEffect(() => {
    if (!error || !trimmedUrl || hookReady) {
      setFallbackReady(false);
      return;
    }

    let cancelled = false;
    const face = new FontFace(
      family,
      `url(${trimmedUrl})`,
      STUDIO_PAGE_FONT_DESCRIPTORS
    );

    face
      .load()
      .then((loadedFace) => {
        if (cancelled) return;
        document.fonts.add(loadedFace);
        setFallbackReady(true);
      })
      .catch(() => {
        if (!cancelled) setFallbackReady(false);
      });

    return () => {
      cancelled = true;
      setFallbackReady(false);
    };
  }, [error, trimmedUrl, family, hookReady]);

  const ready = hookReady || fallbackReady;
  const fontFamily = ready
    ? `"${family}", ${fallbackFamily}`
    : fallbackFamily;
  const hasError = error && !fallbackReady;

  const notifyReady = useCallback((value: boolean) => {
    onReadyChangeRef.current?.(value);
  }, []);

  useEffect(() => {
    notifyReady(ready);
  }, [ready, notifyReady]);

  useEffect(() => {
    return () => {
      removeFontFamily(family);
    };
  }, [family]);

  if (!children) return null;

  return (
    <>{children({ ready, error: hasError, fontFamily })}</>
  );
}
