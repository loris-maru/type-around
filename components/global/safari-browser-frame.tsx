"use client";

import type { CSSProperties, ReactNode } from "react";
import { RiLockFill } from "react-icons/ri";

type SafariBrowserFrameProps = {
  children: ReactNode;
  /** Shown in the address bar */
  url?: string;
  className?: string;
  /** Page background (gradient, color, or image) for the content area */
  contentStyle?: CSSProperties;
};

export default function SafariBrowserFrame({
  children,
  url = "",
  className,
  contentStyle,
}: SafariBrowserFrameProps) {
  return (
    <div
      className={
        className ??
        "overflow-hidden rounded-xl border border-neutral-200 bg-[#e8e8e8] shadow-lg"
      }
    >
      <div className="flex items-center gap-3 border-neutral-300/80 border-b bg-[#f5f5f7] px-3 py-2.5">
        <div
          className="flex shrink-0 items-center gap-1.5"
          aria-hidden
        >
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-neutral-300/90 bg-white px-3 py-1.5 shadow-sm">
          <RiLockFill
            className="h-3 w-3 shrink-0 text-neutral-400"
            aria-hidden
          />
          <span className="truncate font-whisper text-neutral-600 text-xs">
            {url}
          </span>
        </div>
      </div>
      <div
        id="safari-browser-frame-content"
        className="safari-browser-frame-content w-full"
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );
}
