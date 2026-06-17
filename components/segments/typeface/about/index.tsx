"use client";

import { useFont } from "@react-hooks-library/core";
import { RiDownloadLine } from "react-icons/ri";
import RichTextContent from "@/components/global/rich-text/rich-text-content";
import { ABOUT_BLOCK_MARGIN_PRESET_MAP } from "@/constant/ABOUT_BLOCK_MARGIN_PRESETS";
import type { AboutBlockData } from "@/types/layout-typeface";
import { applyBlockBackgroundColor } from "@/utils/block-background-color";
import { formatCharacters } from "@/utils/character-count";
import { cn } from "@/utils/class-names";

const TEXT_SIZE_CLASSES: Record<
  NonNullable<AboutBlockData["textSize"]>,
  string
> = {
  s: "text-[16px]",
  m: "text-[24px]",
  l: "text-[40px]",
  xl: "text-[64px]",
  "2xl": "text-[80px]",
};

const TEXT_ALIGN_CLASSES: Record<
  NonNullable<AboutBlockData["textAlign"]>,
  string
> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const TITLE_FONT_FAMILY = "page-title-font";
const TEXT_FONT_FAMILY = "page-text-font";

export default function TypefaceAbout({
  description,
  typefaceName,
  fontCount,
  characters,
  specimenUrl,
  trialFiles,
  data,
  titleFontUrl,
  textFontUrl,
}: {
  description: string;
  typefaceName?: string;
  fontCount?: number;
  characters?: string | number;
  specimenUrl?: string;
  trialFiles?: string[];
  data?: AboutBlockData;
  titleFontUrl?: string;
  textFontUrl?: string;
}) {
  // useFont must be called unconditionally (before any early returns).
  // When the URL is empty the hook will fail silently — that's intentional.
  const { loaded: titleLoaded } = useFont(
    TITLE_FONT_FAMILY,
    titleFontUrl ?? ""
  );
  const { loaded: textLoaded } = useFont(
    TEXT_FONT_FAMILY,
    textFontUrl ?? ""
  );

  if (!description?.trim()) return null;

  const textAlign = data?.textAlign || "left";
  const textSize = data?.textSize || "m";
  const textColor = data?.textColor;
  const backgroundColor = data?.backgroundColor;
  const marginPreset = data?.margin;
  const marginValue =
    marginPreset &&
    ABOUT_BLOCK_MARGIN_PRESET_MAP[marginPreset];

  const sectionStyle: React.CSSProperties = {};
  applyBlockBackgroundColor(sectionStyle, backgroundColor);
  if (marginValue) {
    sectionStyle.marginTop = marginValue;
    sectionStyle.marginRight = marginValue;
    sectionStyle.marginBottom = marginValue;
    sectionStyle.marginLeft = marginValue;
  }

  const hasMarginOverride = !!marginValue;

  // Block rendering until every requested custom font has finished loading,
  // so neither the large title nor the body text ever jump-swaps mid-paint.
  const isTitleLoading = !!titleFontUrl && !titleLoaded;
  const isTextLoading = !!textFontUrl && !textLoaded;
  const isLoading = isTitleLoading || isTextLoading;

  // Only use the custom font family once the font has finished loading.
  const titleFontFamilyStyle =
    titleFontUrl && titleLoaded
      ? `"${TITLE_FONT_FAMILY}", sans-serif`
      : undefined;
  const textFontFamilyStyle =
    textFontUrl && textLoaded
      ? `"${TEXT_FONT_FAMILY}", sans-serif`
      : undefined;

  const formattedChars = formatCharacters(characters);
  const uniqueTrialFiles = [
    ...new Set((trialFiles ?? []).filter(Boolean)),
  ];
  const hasTrials = uniqueTrialFiles.length > 0;
  const hasSpecimen = !!specimenUrl?.trim();

  // ── Skeleton ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section
        className={cn(
          "relative w-full p-10",
          !hasMarginOverride && "my-20"
        )}
        id="about"
        aria-hidden="true"
      >
        <div className="grid animate-pulse grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left skeleton */}
          <div className="flex flex-col gap-4">
            <div className="h-[12vw] w-4/5 rounded-xl bg-neutral-200" />
            <div className="h-4 w-20 rounded bg-neutral-200" />
            <div className="h-4 w-28 rounded bg-neutral-200" />
          </div>
          {/* Right skeleton — mimic a paragraph of text */}
          <div className="flex flex-col gap-3 pt-1">
            {[100, 90, 95, 80, 100, 70, 85].map((w, i) => (
              <div
                key={i}
                className="h-4 rounded bg-neutral-200"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative w-full py-24 px-12",
        !hasMarginOverride && "my-20"
      )}
      id="about"
      style={
        Object.keys(sectionStyle).length > 0
          ? sectionStyle
          : undefined
      }
    >
      {/* Two-column grid */}
      <div className="relative w-full flex flex-row flex-nowrap gap-10">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-4 items-center justify-center w-1/2">
          <h2
            className={cn(
              "font-black text-black uppercase tracking-wider text-center",
              !titleFontFamilyStyle && "font-ortank"
            )}
            style={{
              fontSize: "76px",
              lineHeight: "0.9",
              ...(titleFontFamilyStyle
                ? { fontFamily: titleFontFamilyStyle }
                : {}),
            }}
          >
            About
            {typefaceName && (
              <>
                <br />
                {typefaceName}
              </>
            )}
          </h2>

          {/* Stats + downloads — one row */}
          <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2">
            {(fontCount ?? 0) > 0 && (
              <span className="font-whisper text-black text-sm">
                {fontCount}{" "}
                {fontCount === 1 ? "font" : "fonts"}
              </span>
            )}

            {formattedChars && (
              <span className="font-whisper text-black text-sm">
                {formattedChars} characters
              </span>
            )}

            {hasTrials && uniqueTrialFiles.length === 1 && (
              <a
                href={uniqueTrialFiles[0]}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-black bg-transparent px-4 py-2 font-whisper text-sm text-black transition-colors hover:bg-black hover:text-white"
              >
                <RiDownloadLine className="h-3.5 w-3.5" />
                Download trial
              </a>
            )}

            {hasTrials &&
              uniqueTrialFiles.length > 1 &&
              uniqueTrialFiles.map((url, i) => (
                <a
                  key={url}
                  href={url}
                  download
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 font-whisper text-neutral-700 text-sm transition-colors hover:border-black hover:text-black"
                >
                  <RiDownloadLine className="h-3.5 w-3.5" />
                  Trial {i + 1}
                </a>
              ))}

            {hasSpecimen && (
              <a
                href={specimenUrl}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-black bg-transparent px-4 py-2 font-whisper text-sm text-black transition-colors hover:bg-black hover:text-white"
              >
                <RiDownloadLine className="h-3.5 w-3.5" />
                Download specimen
              </a>
            )}
          </div>
        </div>

        {/* ── Right column: description ── */}
        <div className="relative w-1/2">
          <RichTextContent
            content={description}
            className={cn(
              "hyphens-auto leading-relaxed",
              !textFontFamilyStyle && "font-whisper",
              TEXT_SIZE_CLASSES[textSize],
              TEXT_ALIGN_CLASSES[textAlign],
              !textColor && "text-neutral-700"
            )}
            style={{
              ...(textFontFamilyStyle
                ? { fontFamily: textFontFamilyStyle }
                : {}),
              ...(textColor ? { color: textColor } : {}),
            }}
          />
        </div>
      </div>
    </section>
  );
}
