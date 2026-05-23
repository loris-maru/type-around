"use client";

import { useFont } from "@react-hooks-library/core";
import { useEffect, useState } from "react";
import { STUDIO_PAGE_FONT_DESCRIPTORS } from "@/constant/STUDIO_PAGE_FONT_FAMILIES";
import { STUDIO_PAGE_PREVIEW_TITLE_FONT_FAMILY } from "@/constant/STUDIO_PAGE_PREVIEW_TITLE_FONT_FAMILY";
import type { StudioPageSafariHeroProps } from "@/types/components";

function removeFontFamily(familyName: string) {
  for (const face of Array.from(document.fonts)) {
    if (face.family === familyName) {
      document.fonts.delete(face);
    }
  }
}

export default function StudioPageSafariHero({
  studioHangeulName,
  headerFont,
}: StudioPageSafariHeroProps) {
  const titleFontUrl = headerFont.trim();
  const [fallbackReady, setFallbackReady] = useState(false);

  const { loaded, error, font } = useFont(
    STUDIO_PAGE_PREVIEW_TITLE_FONT_FAMILY,
    titleFontUrl,
    STUDIO_PAGE_FONT_DESCRIPTORS
  );

  const hookReady =
    titleFontUrl.length > 0 &&
    Boolean(font) &&
    loaded &&
    !error;

  useEffect(() => {
    if (!error || !titleFontUrl || hookReady) {
      setFallbackReady(false);
      return;
    }

    let cancelled = false;
    const face = new FontFace(
      STUDIO_PAGE_PREVIEW_TITLE_FONT_FAMILY,
      `url(${titleFontUrl})`,
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
  }, [error, titleFontUrl, hookReady]);

  const titleFontReady = hookReady || fallbackReady;
  const titleFontFamily =
    titleFontUrl.length > 0 && titleFontReady
      ? `"${STUDIO_PAGE_PREVIEW_TITLE_FONT_FAMILY}", sans-serif`
      : undefined;

  useEffect(() => {
    return () => {
      removeFontFamily(
        STUDIO_PAGE_PREVIEW_TITLE_FONT_FAMILY
      );
    };
  }, []);

  const titleClassName =
    "font-black text-[3.75rem] text-black leading-none lg:text-[5rem]";

  return (
    <div className="flex w-full flex-col items-center justify-center px-6 py-20 text-center">
      <p
        className={titleClassName}
        style={
          titleFontFamily
            ? { fontFamily: titleFontFamily }
            : undefined
        }
      >
        {studioHangeulName}
      </p>
      <p className="mt-2 font-medium font-whisper text-black text-xs uppercase tracking-[0.2em]">
        Studio
      </p>
    </div>
  );
}
