"use client";

import { useFont } from "@react-hooks-library/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { STUDIO_SOCIAL_PLATFORMS } from "@/constant/STUDIO_SOCIAL_PLATFORMS";
import { STUDIO_SOCIALS_BLOCK_TITLE } from "@/constant/STUDIO_SOCIALS_BLOCK_TITLE";
import { STUDIO_SOCIALS_BLOCK_TITLE_FONT_FAMILY } from "@/constant/STUDIO_SOCIALS_BLOCK_TITLE_FONT_FAMILY";
import { STUDIO_PAGE_FONT_DESCRIPTORS } from "@/constant/STUDIO_PAGE_FONT_FAMILIES";
import type { SocialsBlockData } from "@/types/layout";
import type { SocialMedia } from "@/types/studio";
import { applyBlockBackgroundColor } from "@/utils/block-background-color";
import {
  getSocialHandleLabel,
  getSocialProfileHref,
} from "@/utils/studio-social-link";

type StudioSocialsBlockProps = {
  socialMedia: SocialMedia[];
  displayFontUrl?: string;
  data?: SocialsBlockData;
};

function removeFontFamily(familyName: string) {
  for (const face of Array.from(document.fonts)) {
    if (face.family === familyName) {
      document.fonts.delete(face);
    }
  }
}

function SocialsBlockTitle({
  displayFontUrl,
  textColor,
}: {
  displayFontUrl?: string;
  textColor?: string;
}) {
  const fontUrl = displayFontUrl?.trim() ?? "";
  const [fallbackReady, setFallbackReady] = useState(false);

  const { loaded, error, font } = useFont(
    STUDIO_SOCIALS_BLOCK_TITLE_FONT_FAMILY,
    fontUrl,
    STUDIO_PAGE_FONT_DESCRIPTORS
  );

  const hookReady =
    fontUrl.length > 0 && Boolean(font) && loaded && !error;

  useEffect(() => {
    if (!error || !fontUrl || hookReady) {
      setFallbackReady(false);
      return;
    }

    let cancelled = false;
    const face = new FontFace(
      STUDIO_SOCIALS_BLOCK_TITLE_FONT_FAMILY,
      `url(${fontUrl})`,
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
  }, [error, fontUrl, hookReady]);

  const displayFontReady = hookReady || fallbackReady;
  const fontFamily =
    fontUrl.length > 0 && displayFontReady
      ? `"${STUDIO_SOCIALS_BLOCK_TITLE_FONT_FAMILY}", sans-serif`
      : undefined;

  useEffect(() => {
    return () => {
      removeFontFamily(
        STUDIO_SOCIALS_BLOCK_TITLE_FONT_FAMILY
      );
    };
  }, []);

  return (
    <h2
      className={
        fontFamily
          ? "max-w-md shrink-0 font-bold text-6xl text-black leading-none"
          : "max-w-md shrink-0 font-bold font-ortank text-6xl text-black leading-none"
      }
      style={{
        ...(fontFamily ? { fontFamily } : {}),
        ...(textColor ? { color: textColor } : {}),
      }}
    >
      {STUDIO_SOCIALS_BLOCK_TITLE}
    </h2>
  );
}

export default function StudioSocialsBlock({
  socialMedia,
  displayFontUrl,
  data,
}: StudioSocialsBlockProps) {
  const filledPlatforms = STUDIO_SOCIAL_PLATFORMS.map(
    (platform) => {
      const entry = socialMedia.find(
        (sm) => sm.name.toLowerCase() === platform.id
      );
      const handle = entry?.url?.trim() ?? "";
      if (!handle) return null;

      return {
        platform,
        handle,
        label: getSocialHandleLabel(handle),
        href: getSocialProfileHref(platform.id, handle),
      };
    }
  ).filter(
    (item): item is NonNullable<typeof item> =>
      item !== null
  );

  if (filledPlatforms.length === 0) return null;

  const sectionStyle: React.CSSProperties = {};
  applyBlockBackgroundColor(
    sectionStyle,
    data?.backgroundColor
  );
  if (data?.fontColor) {
    sectionStyle.color = data.fontColor;
  }

  return (
    <section
      className="mx-auto flex w-[60vw] max-w-full flex-col items-start justify-between gap-8 rounded-lg border border-black p-8 lg:flex-row lg:items-center"
      style={
        Object.keys(sectionStyle).length > 0
          ? sectionStyle
          : undefined
      }
    >
      <SocialsBlockTitle
        displayFontUrl={displayFontUrl}
        textColor={data?.fontColor}
      />

      <div className="flex flex-wrap justify-start gap-4 lg:justify-end">
        {filledPlatforms.map(
          ({ platform, label, href }) => {
            const { Icon } = platform;
            return (
              <Link
                key={platform.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[200px] w-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-neutral-300 bg-white p-4 text-center transition-colors hover:border-black"
                aria-label={`${platform.label}: ${label}`}
              >
                <Icon
                  className="h-10 w-10 shrink-0 text-black"
                  aria-hidden
                />
                <span className="line-clamp-2 max-w-full break-all font-medium font-whisper text-black text-sm">
                  {label}
                </span>
              </Link>
            );
          }
        )}
      </div>
    </section>
  );
}
