"use client";

import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import BlockBackgroundColorField from "@/components/molecules/block-background-color-field";
import { ButtonModalSave } from "@/components/molecules/buttons";
import ColorPicker from "@/components/molecules/color-picker";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { StoreBlockModalProps } from "@/types/components";
import type { BlockMargin } from "@/types/layout";
import { getInitialBlockBackgroundColor } from "@/utils/block-background-color";
import { handleHexChange } from "@/utils/color-utils";

const MARGIN_OPTIONS: {
  value: BlockMargin;
  label: string;
}[] = [
  { value: "none", label: "None" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];

export default function StoreBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: StoreBlockModalProps) {
  useModalOpen(isOpen);

  if (!isOpen) return null;

  return (
    <StoreBlockModalInner
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
}

function StoreBlockModalInner({
  onClose,
  onSave,
  initialData,
}: Omit<StoreBlockModalProps, "isOpen">) {
  const [backgroundColor, setBackgroundColor] = useState(
    () =>
      getInitialBlockBackgroundColor(
        initialData?.backgroundColor
      )
  );
  const [fontColor, setFontColor] = useState(
    initialData?.fontColor || "#000000"
  );
  const [marginTop, setMarginTop] = useState<BlockMargin>(
    initialData?.marginTop ?? "m"
  );
  const [marginBottom, setMarginBottom] =
    useState<BlockMargin>(initialData?.marginBottom ?? "m");

  const handleSave = () => {
    onSave({
      backgroundColor: backgroundColor || undefined,
      fontColor: fontColor || undefined,
      marginTop,
      marginBottom,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden"
      data-modal
      data-lenis-prevent
    >
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-black/50"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Store Block
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
            Products are managed in the{" "}
            <span className="font-semibold">Store</span>{" "}
            section of your account. Customize how the block
            looks here.
          </p>

          <div className="flex flex-wrap gap-6">
            <BlockBackgroundColorField
              id="store-bg-color"
              value={backgroundColor}
              onChange={setBackgroundColor}
              className="min-w-0 flex-1"
            />
            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Text color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="store-text-color"
                  value={fontColor || "#000000"}
                  onChange={setFontColor}
                />
                <input
                  type="text"
                  value={fontColor}
                  onChange={(e) =>
                    handleHexChange(
                      e.target.value,
                      setFontColor
                    )
                  }
                  maxLength={7}
                  placeholder="#000000"
                  className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-sm uppercase"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <MarginSelect
              id="store-margin-top"
              label="Top margin"
              value={marginTop}
              onChange={setMarginTop}
            />
            <MarginSelect
              id="store-margin-bottom"
              label="Bottom margin"
              value={marginBottom}
              onChange={setMarginBottom}
            />
          </div>

          <div className="pt-2">
            <ButtonModalSave
              type="button"
              onClick={handleSave}
              label="Save Store Block"
              aria-label="Save store block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MarginSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: BlockMargin;
  onChange: (value: BlockMargin) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-semibold text-black text-sm"
      >
        {label}
      </label>
      <div
        id={id}
        className="flex items-center gap-1 rounded-lg border border-neutral-300 p-1"
      >
        {MARGIN_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 cursor-pointer rounded-md px-2 py-1.5 font-whisper text-sm transition-colors ${
              value === opt.value
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
