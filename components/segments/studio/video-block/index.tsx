"use client";

import { useRef, useState } from "react";
import {
  RiVolumeDownFill,
  RiVolumeMuteLine,
} from "react-icons/ri";
import {
  ALIGNMENT_CLASS_MAP,
  MARGIN_CLASS_MAP,
  SIZE_CLASS_MAP,
} from "@/constant/BLOCK_CLASS_MAPS";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import type { StudioVideoBlockProps } from "@/types/components";
import { applyBlockBackgroundColor } from "@/utils/block-background-color";
import { cn } from "@/utils/class-names";

export default function StudioVideoBlock({
  data,
}: StudioVideoBlockProps) {
  const { displayFontFamily, textFontFamily } =
    useStudioFonts();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  if (!data.url) return null;

  const sectionStyle: React.CSSProperties = {};
  applyBlockBackgroundColor(
    sectionStyle,
    data.backgroundColor
  );
  if (data.fontColor) sectionStyle.color = data.fontColor;

  const isNoMargin = (data.margin || "m") === "none";

  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  };

  return (
    <section
      className={cn(
        "relative flex w-full flex-col",
        isNoMargin ? "px-0" : "px-10",
        MARGIN_CLASS_MAP[data.margin || "m"],
        ALIGNMENT_CLASS_MAP[data.alignment || "center"]
      )}
      style={sectionStyle}
    >
      <div
        className={cn(SIZE_CLASS_MAP[data.size || "full"])}
      >
        <div
          className={cn(
            "relative aspect-video w-full overflow-hidden bg-neutral-100",
            !isNoMargin && "rounded-lg"
          )}
        >
          <video
            ref={videoRef}
            src={data.url}
            playsInline
            muted
            loop
            autoPlay
            className="h-full w-full object-cover"
          />

          {/* Mute / Unmute button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={
              muted ? "Unmute video" : "Mute video"
            }
            className={cn(
              "absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              muted
                ? "bg-black text-white"
                : "bg-white text-black"
            )}
          >
            {muted ? (
              <RiVolumeMuteLine size={16} />
            ) : (
              <RiVolumeDownFill size={16} />
            )}
          </button>
        </div>
        {data.title && (
          <h4
            className="mt-3 font-semibold text-sm"
            style={{ fontFamily: displayFontFamily }}
          >
            {data.title}
          </h4>
        )}
        {data.description && (
          <p
            className="mt-1 text-sm opacity-70"
            style={{ fontFamily: textFontFamily }}
          >
            {data.description}
          </p>
        )}
      </div>
    </section>
  );
}
