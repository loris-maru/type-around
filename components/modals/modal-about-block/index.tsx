"use client";

import { useState } from "react";
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiCloseLine,
} from "react-icons/ri";
import { ButtonModalSave } from "@/components/molecules/buttons";
import ColorPicker from "@/components/molecules/color-picker";
import { ABOUT_BLOCK_MARGIN_PRESETS } from "@/constant/ABOUT_BLOCK_MARGIN_PRESETS";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { AboutBlockModalProps } from "@/types/components";
import type {
  AboutBlockTextAlign,
  AboutBlockTextSize,
  BlockMarginSize,
} from "@/types/layout-typeface";
import { cn } from "@/utils/class-names";
import { handleHexChange } from "@/utils/color-utils";

const TEXT_ALIGN_OPTIONS: {
  value: AboutBlockTextAlign;
  Icon: typeof RiAlignLeft;
}[] = [
  { value: "left", Icon: RiAlignLeft },
  { value: "center", Icon: RiAlignCenter },
  { value: "right", Icon: RiAlignRight },
];

const TEXT_SIZE_OPTIONS: {
  value: AboutBlockTextSize;
  label: string;
}[] = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
];

export default function AboutBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AboutBlockModalProps) {
  useModalOpen(isOpen);

  const [textAlign, setTextAlign] =
    useState<AboutBlockTextAlign>(
      initialData?.textAlign || "left"
    );
  const [textSize, setTextSize] =
    useState<AboutBlockTextSize>(
      initialData?.textSize || "m"
    );
  const [textColor, setTextColor] = useState(
    initialData?.textColor || "#000000"
  );
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || "#ffffff"
  );
  const [margin, setMargin] = useState<
    BlockMarginSize | ""
  >(initialData?.margin || "");

  const handleSave = () => {
    onSave({
      textAlign,
      textSize,
      textColor,
      backgroundColor,
      margin: margin || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden"
      data-modal
      data-lenis-prevent
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            About Block
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-6">
          <p className="font-whisper text-neutral-600 text-sm">
            Customize the appearance of the about section.
          </p>

          <div className="flex flex-wrap items-end gap-6">
            <div>
              <span className="mb-2 block font-semibold text-black text-sm">
                Text align
              </span>
              <div className="flex gap-2">
                {TEXT_ALIGN_OPTIONS.map(
                  ({ value, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTextAlign(value)}
                      aria-label={`Align ${value}`}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        textAlign === value
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Text size
              </span>
              <div className="flex gap-2">
                {TEXT_SIZE_OPTIONS.map(
                  ({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTextSize(value)}
                      className={`flex min-w-0 flex-1 items-center justify-center rounded-lg border px-2 py-2 font-medium font-whisper text-sm transition-colors ${
                        textSize === value
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Text color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="about-text-color"
                  value={textColor || "#000000"}
                  onChange={setTextColor}
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) =>
                    handleHexChange(
                      e.target.value,
                      setTextColor
                    )
                  }
                  maxLength={7}
                  placeholder="#000000"
                  className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Background color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="about-bg-color"
                  value={backgroundColor || "#ffffff"}
                  onChange={setBackgroundColor}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) =>
                    handleHexChange(
                      e.target.value,
                      setBackgroundColor
                    )
                  }
                  maxLength={7}
                  placeholder="#ffffff"
                  className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
                />
              </div>
            </div>
          </div>

          <div>
            <span className="mb-2 block font-semibold text-black text-sm">
              Margin
            </span>
            <div className="grid grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setMargin("")}
                className={cn(
                  "flex min-w-0 items-center justify-center rounded-lg border px-2 py-2 font-medium font-whisper text-sm transition-colors",
                  !margin
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                )}
              >
                Default
              </button>
              {ABOUT_BLOCK_MARGIN_PRESETS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMargin(opt.value)}
                  className={cn(
                    "flex min-w-0 items-center justify-center rounded-lg border px-2 py-2 font-medium font-whisper text-sm transition-colors",
                    margin === opt.value
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <ButtonModalSave
              type="button"
              onClick={handleSave}
              label="Save About Block"
              aria-label="Save about block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
