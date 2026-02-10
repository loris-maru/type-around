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
import Slider from "@/components/global/slider";
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

  const fc = params.fontColor;

  return (
    <div className="flex w-full items-center gap-6">
      {/* Font Size */}
      <Slider
        id="tt-font-size"
        label="Size"
        min={8}
        max={200}
        value={params.fontSize}
        onChange={(v) => updateParam("fontSize", v)}
        color={fc}
      />

      {/* Line Height */}
      <Slider
        id="tt-line-height"
        label="Leading"
        min={0.5}
        max={3}
        step={0.05}
        value={params.lineHeight}
        onChange={(v) => updateParam("lineHeight", v)}
        displayValue={params.lineHeight.toFixed(2)}
        color={fc}
      />

      {/* Letter Spacing */}
      <Slider
        id="tt-letter-spacing"
        label="Tracking"
        min={-10}
        max={30}
        step={0.5}
        value={params.letterSpacing}
        onChange={(v) => updateParam("letterSpacing", v)}
        color={fc}
      />

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
                ? "opacity-100"
                : "opacity-30 hover:opacity-70"
            )}
            style={{ color: fc }}
          >
            {opt.icon}
          </button>
        ))}
      </div>

      {/* Background Color */}
      <div className="flex items-center gap-1.5">
        <RiFile2Fill
          size={16}
          className="shrink-0 opacity-50"
          style={{ color: fc }}
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
          className="shrink-0 opacity-50"
          style={{ color: fc }}
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
