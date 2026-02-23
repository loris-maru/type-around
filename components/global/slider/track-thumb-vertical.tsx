"use client";

import { useEffect } from "react";
import type { TrackThumbVerticalProps } from "@/types/track-thumb-vertical";

export default function TrackThumbVertical({
  min,
  max,
  value,
  label,
  trackRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleLostPointerCapture,
  fraction,
}: TrackThumbVerticalProps) {
  // Prevent page scroll when touching the slider (React's touch handlers are passive by default)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const preventScroll = (e: TouchEvent) =>
      e.preventDefault();
    el.addEventListener("touchstart", preventScroll, {
      passive: false,
    });
    el.addEventListener("touchmove", preventScroll, {
      passive: false,
    });
    return () => {
      el.removeEventListener("touchstart", preventScroll);
      el.removeEventListener("touchmove", preventScroll);
    };
  }, [trackRef]);

  return (
    <div className="relative flex w-10 items-center justify-center rounded-sm bg-black py-3">
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        tabIndex={0}
        ref={trackRef}
        className="relative h-48 w-5 cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onLostPointerCapture={handleLostPointerCapture}
      >
        {/* Track line - white at 30% opacity */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white opacity-30" />
        {/* Filled portion - white */}
        <div
          className="absolute bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white"
          style={{
            height: `${fraction * 100}%`,
          }}
        />
        {/* Thumb - white, 32×32px */}
        <div
          className="absolute left-1/2 h-8 w-8 -translate-x-1/2 translate-y-1/2 rounded-full bg-white"
          style={{
            bottom: `${fraction * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
