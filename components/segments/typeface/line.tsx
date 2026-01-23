"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import IconDownload from "@/components/icons/icon-download";
import Link from "next/link";
import { slugify } from "@/utils/slugify";

export default function TypefaceLine({
  familyName,
  styles,
  fonts,
}: {
  familyName: string;
  styles: number;
  fonts: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isHovered) {
      controls.start({
        x: [null, -1000],
        transition: {
          duration: 5,
          ease: "linear",
          repeat: Infinity,
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

  return (
    <div className="relative w-full">
      <header className="px-10 relative flex flex-row justify-between items-center font-whisper text-sm">
        <div className="relative flex flex-row gap-x-4">
          <div>{familyName}</div>
          <div>{styles} styles</div>
          <div>{fonts} fonts</div>
        </div>
        <div className="relative flex flex-row gap-x-4">
          <button
            type="button"
            aria-label="Download trial font"
            name="download-trial-font"
            className="flex flex-row gap-x-2 font-whisper text-sm text-black font-medium"
          >
            <IconDownload className="w-3 h-3" /> Trial font
          </button>
          <button
            type="button"
            aria-label="Download specimen"
            name="download-specimen"
            className="flex flex-row gap-x-2 font-whisper text-sm text-black font-medium"
          >
            <IconDownload className="w-3 h-3" /> Specimen
          </button>
        </div>
      </header>
      <Link
        href={`/studio/${slugify(familyName)}/typeface/${slugify(familyName)}`}
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative w-full text-black text-[120px] font-ortank font-black leading-[1.3] whitespace-nowrap"
          animate={controls}
          initial={{ x: 0 }}
        >
          획의 굵기 차이가 극적으로 드러나는 이 산세리프
          서체는 날카롭고 정제된 수직 스트로크와 섬세하게
          얇아지는 연결부를 통해 강한 리듬과 긴장감을
          형성하며
        </motion.div>
      </Link>
    </div>
  );
}
