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
        "relative flex h-[450px] w-full flex-col items-center justify-between overflow-hidden rounded-lg p-5 transition-all duration-300 ease-in-out",
        "bg-light-gray hover:bg-white ",
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
              <p className="font-ortank text-4xl font-black leading-[1.3] text-black whitespace-pre-line">
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
      <div className="flex w-full flex-row items-baseline justify-between">
        <h3 className="font-ortank text-2xl font-black">
          {typeface.name}
        </h3>
        <div className="font-whisper text-sm text-black">
          {typeface.studio}
        </div>
      </div>
    </Link>
  );
}
