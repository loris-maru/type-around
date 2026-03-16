"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { TYPEFACE_CARD_DESCRIPTION_TEXT } from "@/constant/TYPEFACE_CARD_TEXT";
import type { PublicTypefaceCardProps } from "@/types/components";
import { cn } from "@/utils/class-names";
import { slugify } from "@/utils/slugify";

const CARD_FONT_PREFIX = "typeface-card-font";

export default function TypefaceCard({
  studioName,
  typeface,
  compact = false,
}: PublicTypefaceCardProps) {
  const [isHovered, setIsHovered] =
    useState<boolean>(false);
  const [displayedText, setDisplayedText] =
    useState<string>("");
  const [fontLoaded, setFontLoaded] = useState(false);

  const cardContent =
    typeface.typefaceCardContent?.trim() ||
    TYPEFACE_CARD_DESCRIPTION_TEXT;
  const fontFamily = typeface.typefaceCardDisplayFontFile
    ? `"${CARD_FONT_PREFIX}-${typeface.id}", "Ortank", sans-serif`
    : "font-ortank";

  const loadFont = useCallback(
    (url: string, familyName: string) => {
      const existing = Array.from(document.fonts).find(
        (f) => f.family === familyName
      );
      if (existing) {
        setFontLoaded(true);
        return;
      }
      const face = new FontFace(familyName, `url(${url})`, {
        weight: "100 900",
        style: "normal",
      });
      face
        .load()
        .then((loaded) => {
          document.fonts.add(loaded);
          setFontLoaded(true);
        })
        .catch(() => setFontLoaded(true));
    },
    []
  );

  useEffect(() => {
    if (typeface.typefaceCardDisplayFontFile) {
      loadFont(
        typeface.typefaceCardDisplayFontFile,
        `${CARD_FONT_PREFIX}-${typeface.id}`
      );
    } else {
      setFontLoaded(true);
    }
  }, [
    typeface.typefaceCardDisplayFontFile,
    typeface.id,
    loadFont,
  ]);

  useEffect(() => {
    if (isHovered) {
      setDisplayedText("");
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < cardContent.length) {
          setDisplayedText(
            cardContent.slice(0, currentIndex + 1)
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
  }, [isHovered, cardContent]);

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
              {(() => {
                const iconSrc = typeface.icon?.trim();
                if (!iconSrc) {
                  return (
                    <div
                      className="flex h-[100px] w-full items-center justify-center bg-neutral-200"
                      aria-hidden
                    >
                      <span className="font-black font-ortank text-4xl text-neutral-400">
                        {typeface.name.charAt(0) || "?"}
                      </span>
                    </div>
                  );
                }
                return (
                  <Image
                    src={iconSrc}
                    alt={typeface.name}
                    width={100}
                    height={100}
                    className="h-auto w-full object-contain"
                  />
                );
              })()}
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
                  "line-clamp-6 whitespace-pre-line font-black text-black leading-[1.3]",
                  !typeface.typefaceCardDisplayFontFile &&
                    "font-ortank",
                  compact ? "text-3xl" : "text-4xl"
                )}
                style={
                  typeface.typefaceCardDisplayFontFile &&
                  fontLoaded
                    ? { fontFamily }
                    : undefined
                }
              >
                {displayedText}
                {isHovered &&
                  displayedText.length <
                    cardContent.length && (
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
