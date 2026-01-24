"use client";

import { Typeface } from "@/types/typefaces";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils/slugify";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const DESCRIPTION_TEXT =
  "는 지오매트릭 그로테스크 계열의 서체로 기하학적 형태의 한계를 탐구한 결과물입니다.";

export default function TypefaceCard({
  studioName,
  typeface,
}: {
  studioName: string;
  typeface: Typeface;
}) {
  const [isHovered, setIsHovered] =
    useState<boolean>(false);
  const [displayedText, setDisplayedText] =
    useState<string>("");

  useEffect(() => {
    if (isHovered) {
      setDisplayedText("");
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < DESCRIPTION_TEXT.length) {
          setDisplayedText(
            DESCRIPTION_TEXT.slice(0, currentIndex + 1)
          );
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayedText("");
    }
  }, [isHovered]);

  return (
    <motion.div
      className="relative shrink-0"
      animate={{
        width: isHovered ? 700 : 300,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <Link
        href={`studio/${slugify(studioName)}/typeface/${slugify(typeface.name)}`}
        className="relative flex h-[350px] w-full flex-col items-center justify-between overflow-hidden rounded-lg border border-black bg-white p-5 shadow-button"
        prefetch={false}
        onMouseOver={() => setIsHovered(true)}
        onFocus={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onBlur={() => setIsHovered(false)}
      >
        <div className="relative flex flex-1 items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.div
                key="image"
                initial={{ x: 0, y: 0 }}
                exit={{ x: -300, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="w-[270px]"
              >
                <Image
                  src={typeface.icon}
                  alt={typeface.name}
                  width={100}
                  height={100}
                  className="h-auto w-full object-contain"
                />
              </motion.div>
            ) : (
              <motion.div
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 w-full text-left"
              >
                <p className="font-ortank text-5xl font-black leading-[1.3] text-black whitespace-pre-line">
                  {displayedText}
                  {isHovered &&
                    displayedText.length <
                      DESCRIPTION_TEXT.length && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                        }}
                        className="inline-block"
                      >
                        |
                      </motion.span>
                    )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex w-full flex-row items-baseline justify-between">
          <h3 className="font-ortank text-2xl font-black">
            {typeface.name}
          </h3>
          <div className="font-whisper text-sm text-black">
            {typeface.studio}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
