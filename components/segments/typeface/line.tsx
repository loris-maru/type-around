"use client";

import { motion, useAnimation } from "motion/react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";
import IconDownload from "@/components/icons/icon-download";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import { downloadFile } from "@/utils/download-file";
import { slugify } from "@/utils/slugify";

const DEFAULT_TEXT =
  "획의 굵기 차이가 극적으로 드러나는 이 산세리프 서체는 날카롭고 정제된 수직 스트로크와 섬세하게 얇아지는 연결부를 통해 강한 리듬과 긴장감을 형성하며";

export default function TypefaceLine({
  studioName,
  familyName,
  styles,
  fonts,
  fontFileUrl,
  displayText,
  specimenUrl,
  trialFontUrl,
}: {
  studioName: string;
  familyName: string;
  styles: number;
  fonts: number;
  fontFileUrl?: string;
  displayText?: string;
  specimenUrl?: string;
  trialFontUrl?: string;
}) {
  const { displayFontFamily, textFontFamily } =
    useStudioFonts();
  const [isHovered, setIsHovered] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const controls = useAnimation();
  const uniqueId = useId();
  const fontFamily = `TypefaceLine-${uniqueId.replace(/:/g, "")}`;

  // Load the woff2 font dynamically
  useEffect(() => {
    if (!fontFileUrl) return;

    let cancelled = false;
    const face = new FontFace(
      fontFamily,
      `url(${fontFileUrl})`,
      {
        weight: "400 900",
      }
    );

    face
      .load()
      .then((loadedFace) => {
        if (cancelled) return;
        document.fonts.add(loadedFace);
        setFontLoaded(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(
          `Failed to load font for ${familyName}:`,
          err
        );
      });

    return () => {
      cancelled = true;
      setFontLoaded(false);
    };
  }, [fontFileUrl, fontFamily, familyName]);

  useEffect(() => {
    if (isHovered) {
      controls.start({
        x: [null, -1000],
        transition: {
          duration: 5,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        },
      });
    } else {
      controls.start({
        x: 0,
        transition: {
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        },
      });
    }
  }, [isHovered, controls]);

  const handleDownloadTrial = useCallback(async () => {
    if (!trialFontUrl) return;
    await downloadFile(
      trialFontUrl,
      `${slugify(familyName)}-trial.woff2`
    );
  }, [trialFontUrl, familyName]);

  const handleDownloadSpecimen = useCallback(async () => {
    if (!specimenUrl) return;
    await downloadFile(
      specimenUrl,
      `${slugify(familyName)}-specimen.pdf`
    );
  }, [specimenUrl, familyName]);

  const text = displayText || DEFAULT_TEXT;

  return (
    <div className="relative w-full bg-light-gray py-6 transition-all duration-300 ease-in-out hover:bg-white">
      <header
        className="relative mb-3 flex flex-row items-center justify-between px-10 text-sm"
        style={{ fontFamily: textFontFamily }}
      >
        <div className="relative flex flex-row items-baseline gap-x-4">
          <div
            className="text-xl font-bold"
            style={{ fontFamily: displayFontFamily }}
          >
            {familyName}
          </div>
          <div>{styles} styles</div>
          <div>{fonts} fonts</div>
        </div>
        <div className="relative flex flex-row gap-x-4">
          {trialFontUrl && (
            <button
              type="button"
              aria-label={`Download trial font for ${familyName}`}
              onClick={handleDownloadTrial}
              className="flex cursor-pointer flex-row gap-x-2 text-sm font-medium text-black transition-opacity hover:opacity-60"
            >
              <IconDownload className="h-3 w-3" /> Trial
              font
            </button>
          )}
          {specimenUrl && (
            <button
              type="button"
              aria-label={`Download specimen for ${familyName}`}
              onClick={handleDownloadSpecimen}
              className="flex cursor-pointer flex-row gap-x-2 text-sm font-medium text-black transition-opacity hover:opacity-60"
            >
              <IconDownload className="h-3 w-3" /> Specimen
            </button>
          )}
        </div>
      </header>
      <Link
        href={`/studio/${slugify(studioName)}/typeface/${slugify(familyName)}`}
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative w-full whitespace-nowrap pl-10 font-black text-[120px] text-black leading-[1.3]"
          style={{
            fontFamily:
              fontLoaded && fontFileUrl
                ? `"${fontFamily}", var(--font-ortank)`
                : "var(--font-ortank)",
          }}
          animate={controls}
          initial={{ x: 0 }}
        >
          {text}
        </motion.div>
      </Link>
    </div>
  );
}
