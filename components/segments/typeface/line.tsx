"use client";

import { motion, useAnimation } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import IconDownload from "@/components/icons/icon-download";
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
}: {
  studioName: string;
  familyName: string;
  styles: number;
  fonts: number;
  fontFileUrl?: string;
  displayText?: string;
}) {
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

  const text = displayText || DEFAULT_TEXT;

  return (
    <div className="relative w-full bg-light-gray py-6 transition-all duration-300 ease-in-out hover:bg-white">
      <header className="relative mb-3 flex flex-row items-center justify-between px-10 font-whisper text-sm">
        <div className="relative flex flex-row items-baseline gap-x-4">
          <div className="font-bold font-ortank text-xl">
            {familyName}
          </div>
          <div>{styles} styles</div>
          <div>{fonts} fonts</div>
        </div>
        <div className="relative flex flex-row gap-x-4">
          <button
            type="button"
            aria-label="Download trial font"
            name="download-trial-font"
            className="flex flex-row gap-x-2 font-medium font-whisper text-black text-sm"
          >
            <IconDownload className="h-3 w-3" /> Trial font
          </button>
          <button
            type="button"
            aria-label="Download specimen"
            name="download-specimen"
            className="flex flex-row gap-x-2 font-medium font-whisper text-black text-sm"
          >
            <IconDownload className="h-3 w-3" /> Specimen
          </button>
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
