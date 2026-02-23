"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TYPEFACE_CARD_DESCRIPTION_TEXT } from "@/constant/TYPEFACE_CARD_TEXT";
import type { PublicTypefaceCardProps } from "@/types/components";
import { cn } from "@/utils/class-names";
import { slugify } from "@/utils/slugify";

export default function TypefaceCard({
  studioName,
  typeface,
  compact = false,
}: PublicTypefaceCardProps) {
  const [isHovered, setIsHovered] =
    useState<boolean>(false);
  const [displayedText, setDisplayedText] =
    useState<string>("");

  useEffect(() => {
    if (isHovered) {
      setDisplayedText("");
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (
          currentIndex <
          TYPEFACE_CARD_DESCRIPTION_TEXT.length
        ) {
          setDisplayedText(
            TYPEFACE_CARD_DESCRIPTION_TEXT.slice(
              0,
              currentIndex + 1
            )
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
    <Link
      href={`studio/${slugify(studioName)}/typeface/${slugify(typeface.name)}`}
      className={cn(
        "relative flex w-full flex-col items-center justify-between overflow-hidden rounded-lg p-4 transition-all duration-300 ease-in-out",
        compact ? "h-[272px]" : "h-[340px]",
        "bg-light-gray hover:bg-white",
        "border border-neutral-300 hover:border-black",
        "transparent hover:shadow-button-hover",
        "hover:scale-105"
      )}
      prefetch={false}
      onMouseOver={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="relative flex w-full flex-1 items-center justify-center">
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
              className={
                compact ? "w-[160px]" : "w-[200px]"
              }
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
              <p
                className={cn(
                  "whitespace-pre-line font-black font-ortank text-black leading-[1.3]",
                  compact ? "text-3xl" : "text-4xl"
                )}
              >
                {displayedText}
                {isHovered &&
                  displayedText.length <
                    TYPEFACE_CARD_DESCRIPTION_TEXT.length && (
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
      <div className="flex w-full flex-col gap-1">
        <h3
          className={cn(
            "font-black font-ortank",
            compact ? "text-xl" : "text-2xl"
          )}
        >
          {typeface.name}
        </h3>
        <div className="flex w-full flex-row items-baseline justify-between">
          <span className="font-whisper text-neutral-500 text-sm">
            {typeface.studio}
          </span>
          <span className="font-whisper text-neutral-500 text-sm">
            {typeface.fonts.length} font
            {typeface.fonts.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
