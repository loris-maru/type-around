"use client";

import { useState } from "react";
import {
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiArrowDownSLine,
  RiArrowDropRightLine,
  RiFile2Fill,
  RiFontSizeAi,
} from "react-icons/ri";
import ColorPicker from "@/components/molecules/color-picker";
import type {
  TextAlign,
  TypetesterFont,
  TypetesterParametersProps,
  TypetesterParams,
  TypetesterTypeface,
} from "@/types/typetester";
import { cn } from "@/utils/class-names";

const ALIGN_OPTIONS: {
  value: TextAlign;
  icon: React.ReactNode;
}[] = [
  { value: "left", icon: <RiAlignLeft size={16} /> },
  { value: "center", icon: <RiAlignJustify size={16} /> },
  { value: "right", icon: <RiAlignRight size={16} /> },
];

/* ───────── Flat font dropdown (SingleTypetester) ───────── */
export function FontDropdown({
  fonts,
  selectedId,
  onChange,
}: {
  fonts: TypetesterFont[];
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const selected = fonts.find((f) => f.id === selectedId);
  const label = selected
    ? `${selected.styleName}${selected.isItalic ? " Italic" : ""}`
    : "Select font";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Select font"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md px-2 py-1 font-whisper text-black text-xs transition-colors hover:bg-neutral-100"
      >
        <span className="max-w-[140px] truncate">
          {label}
        </span>
        <RiArrowDownSLine
          size={14}
          className={cn(
            "shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 max-h-48 min-w-[180px] overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
          {fonts.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => {
                onChange(font.id);
                setOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left font-whisper text-xs transition-colors hover:bg-neutral-50",
                font.id === selectedId
                  ? "bg-neutral-100 font-medium text-black"
                  : "text-neutral-600"
              )}
            >
              {font.styleName}
              {font.isItalic ? " Italic" : ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────── Grouped typeface→font dropdown (GlobalTypetester) ───────── */
export function GroupedFontDropdown({
  typefaces,
  selectedId,
  onChange,
}: {
  typefaces: TypetesterTypeface[];
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [expandedTypeface, setExpandedTypeface] = useState<
    string | null
  >(null);

  // Find label for currently selected font
  const allFonts = typefaces.flatMap((tf) => tf.fonts);
  const selected = allFonts.find(
    (f) => f.id === selectedId
  );
  const selectedTypeface = typefaces.find((tf) =>
    tf.fonts.some((f) => f.id === selectedId)
  );
  const label = selected
    ? `${selectedTypeface?.name ?? ""} ${selected.styleName}${selected.isItalic ? " Italic" : ""}`
    : "Select font";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Select font"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md px-2 py-1 font-whisper text-black text-xs transition-colors hover:bg-neutral-100"
      >
        <span className="max-w-[200px] truncate">
          {label}
        </span>
        <RiArrowDownSLine
          size={14}
          className={cn(
            "shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 max-h-64 min-w-[220px] overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
          {typefaces.map((tf) => (
            <div key={tf.id}>
              <button
                type="button"
                onClick={() =>
                  setExpandedTypeface((prev) =>
                    prev === tf.id ? null : tf.id
                  )
                }
                className="flex w-full items-center justify-between px-3 py-2 font-whisper text-xs transition-colors hover:bg-neutral-50"
              >
                <span className="font-medium text-black">
                  {tf.name}
                </span>
                <RiArrowDropRightLine
                  size={18}
                  className={cn(
                    "shrink-0 text-neutral-400 transition-transform",
                    expandedTypeface === tf.id &&
                      "rotate-90"
                  )}
                />
              </button>

              {expandedTypeface === tf.id && (
                <div className="ml-2 border-neutral-100 border-l-2">
                  {tf.fonts.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => {
                        onChange(font.id);
                        setOpen(false);
                        setExpandedTypeface(null);
                      }}
                      className={cn(
                        "w-full py-1.5 pr-3 pl-4 text-left font-whisper text-xs transition-colors hover:bg-neutral-50",
                        font.id === selectedId
                          ? "bg-neutral-100 font-medium text-black"
                          : "text-neutral-500"
                      )}
                    >
                      {font.styleName}
                      {font.isItalic ? " Italic" : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────── Main parameters bar ───────── */
export default function TypetesterParameters({
  params,
  onChange,
}: TypetesterParametersProps) {
  const updateParam = <K extends keyof TypetesterParams>(
    key: K,
    value: TypetesterParams[K]
  ) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="flex w-full items-center gap-8 py-4 pr-16 pl-5">
      {/* Font Size */}
      <div className="flex flex-1 items-center gap-3">
        <label
          htmlFor="tt-font-size"
          className="shrink-0 font-whisper text-neutral-500 text-xs"
        >
          Size
        </label>
        <input
          id="tt-font-size"
          type="range"
          min={8}
          max={200}
          value={params.fontSize}
          aria-valuemin={8}
          aria-valuemax={200}
          aria-valuenow={params.fontSize}
          onChange={(e) =>
            updateParam("fontSize", Number(e.target.value))
          }
          className="h-1 w-full cursor-pointer accent-black"
        />
        <span className="w-10 shrink-0 text-right font-whisper text-black text-xs">
          {params.fontSize}
        </span>
      </div>

      {/* Line Height */}
      <div className="flex flex-1 items-center gap-3">
        <label
          htmlFor="tt-line-height"
          className="shrink-0 font-whisper text-neutral-500 text-xs"
        >
          Leading
        </label>
        <input
          id="tt-line-height"
          type="range"
          min={0.5}
          max={3}
          step={0.05}
          value={params.lineHeight}
          aria-valuemin={0.5}
          aria-valuemax={3}
          aria-valuenow={params.lineHeight}
          onChange={(e) =>
            updateParam(
              "lineHeight",
              Number(e.target.value)
            )
          }
          className="h-1 w-full cursor-pointer accent-black"
        />
        <span className="w-10 shrink-0 text-right font-whisper text-black text-xs">
          {params.lineHeight.toFixed(2)}
        </span>
      </div>

      {/* Letter Spacing */}
      <div className="flex flex-1 items-center gap-3">
        <label
          htmlFor="tt-letter-spacing"
          className="shrink-0 font-whisper text-neutral-500 text-xs"
        >
          Tracking
        </label>
        <input
          id="tt-letter-spacing"
          type="range"
          min={-10}
          max={30}
          step={0.5}
          value={params.letterSpacing}
          aria-valuemin={-10}
          aria-valuemax={30}
          aria-valuenow={params.letterSpacing}
          onChange={(e) =>
            updateParam(
              "letterSpacing",
              Number(e.target.value)
            )
          }
          className="h-1 w-full cursor-pointer accent-black"
        />
        <span className="w-10 shrink-0 text-right font-whisper text-black text-xs">
          {params.letterSpacing}
        </span>
      </div>

      {/* Text Align */}
      <div className="flex items-center gap-1">
        {ALIGN_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              updateParam("textAlign", opt.value)
            }
            aria-label={`Align text ${opt.value}`}
            aria-pressed={params.textAlign === opt.value}
            className={cn(
              "rounded-md p-2 transition-colors",
              params.textAlign === opt.value
                ? "bg-black text-white"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
            )}
          >
            {opt.icon}
          </button>
        ))}
      </div>

      {/* Background Color */}
      <div className="flex items-center gap-1.5">
        <RiFile2Fill
          size={16}
          className="shrink-0 text-neutral-400"
        />
        <ColorPicker
          id="tt-bg-color"
          value={params.backgroundColor}
          onChange={(v) =>
            updateParam("backgroundColor", v)
          }
        />
      </div>

      {/* Font Color */}
      <div className="flex items-center gap-1.5">
        <RiFontSizeAi
          size={16}
          className="shrink-0 text-neutral-400"
        />
        <ColorPicker
          id="tt-font-color"
          value={params.fontColor}
          onChange={(v) => updateParam("fontColor", v)}
        />
      </div>
    </div>
  );
}
