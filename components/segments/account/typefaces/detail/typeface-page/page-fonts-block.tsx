"use client";

import FileDropZone from "@/components/global/file-drop-zone";
import type { PageFontsBlockProps } from "@/types/components";
import { cn } from "@/utils/class-names";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2"
      aria-pressed={checked}
    >
      <span className="font-whisper text-neutral-500 text-xs">
        {label}
      </span>
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center cursor-pointer rounded-full transition-colors",
          checked ? "bg-black" : "bg-neutral-300"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked
              ? "translate-x-[18px]"
              : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}

export default function PageFontsBlock({
  titleFont,
  textFont,
  titleFontSameAsText,
  textFontSameAsTitle,
  onTitleFontChange,
  onTextFontChange,
  onTitleFontSameAsTextChange,
  onTextFontSameAsTitleChange,
  studioId,
}: PageFontsBlockProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-3 font-bold font-ortank text-base">
        Page fonts
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Title font */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold font-whisper text-black text-sm">
              Title font
            </span>
            <Toggle
              checked={titleFontSameAsText}
              onChange={(v) => {
                onTitleFontSameAsTextChange(v);
                if (v) onTextFontSameAsTitleChange(false);
              }}
              label="Same as text"
            />
          </div>
          {!titleFontSameAsText && (
            <FileDropZone
              label=""
              accept=".woff2"
              value={titleFont}
              onChange={onTitleFontChange}
              description=".woff2"
              studioId={studioId}
              folder="fonts"
            />
          )}
        </div>

        {/* Text font */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold font-whisper text-black text-sm">
              Text font
            </span>
            <Toggle
              checked={textFontSameAsTitle}
              onChange={(v) => {
                onTextFontSameAsTitleChange(v);
                if (v) onTitleFontSameAsTextChange(false);
              }}
              label="Same as title"
            />
          </div>
          {!textFontSameAsTitle && (
            <FileDropZone
              label=""
              accept=".woff2"
              value={textFont}
              onChange={onTextFontChange}
              description=".woff2"
              studioId={studioId}
              folder="fonts"
            />
          )}
        </div>
      </div>
    </div>
  );
}
