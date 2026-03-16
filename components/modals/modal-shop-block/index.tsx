"use client";

import { Reorder } from "motion/react";
import { useState } from "react";
import { RiCloseLine, RiDraggable } from "react-icons/ri";
import { ButtonModalSave } from "@/components/molecules/buttons";
import ColorPicker from "@/components/molecules/color-picker";
import { SPACER_SIZE_OPTIONS } from "@/constant/BLOCK_OPTIONS";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { ShopBlockModalProps } from "@/types/components";
import type { BlockMarginSize } from "@/types/layout-typeface";
import { cn } from "@/utils/class-names";
import { handleHexChange } from "@/utils/color-utils";

export default function ShopBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  typefaceFonts,
}: ShopBlockModalProps) {
  useModalOpen(isOpen);

  if (!isOpen) return null;

  return (
    <ShopBlockModalInner
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
      typefaceFonts={typefaceFonts}
    />
  );
}

function ShopBlockModalInner({
  onClose,
  onSave,
  initialData,
  typefaceFonts,
}: Omit<ShopBlockModalProps, "isOpen">) {
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || "#ffffff"
  );
  const [textColor, setTextColor] = useState(
    initialData?.textColor || "#000000"
  );
  const [margin, setMargin] = useState<BlockMarginSize>(
    initialData?.margin || "m"
  );
  const [fontOrder, setFontOrder] = useState<string[]>(
    initialData?.fontOrder?.length
      ? initialData.fontOrder
      : typefaceFonts.map((f) => f.id)
  );

  const orderedFonts = (() => {
    if (fontOrder.length === 0) {
      return typefaceFonts.map((f) => f.id);
    }
    const orderSet = new Set(fontOrder);
    const ordered = fontOrder.filter((id) =>
      typefaceFonts.some((f) => f.id === id)
    );
    const rest = typefaceFonts
      .filter((f) => !orderSet.has(f.id))
      .map((f) => f.id);
    return [...ordered, ...rest];
  })();

  const handleSave = () => {
    onSave({
      backgroundColor: backgroundColor || undefined,
      textColor: textColor || undefined,
      margin,
      fontOrder:
        orderedFonts.length > 0 ? orderedFonts : undefined,
    });
    onClose();
  };

  const handleReorder = (newOrder: string[]) => {
    setFontOrder(newOrder);
  };

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
            Shop Block
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
            Customize the shop section and font display
            order.
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Background color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="shop-bg-color"
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

            <div className="min-w-0 flex-1">
              <span className="mb-2 block font-semibold text-black text-sm">
                Text color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="shop-text-color"
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
          </div>

          <div>
            <span className="mb-2 block font-semibold text-black text-sm">
              Margin
            </span>
            <div className="flex gap-2">
              {SPACER_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setMargin(opt.value as BlockMarginSize)
                  }
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-center rounded-lg border px-2 py-2 font-medium font-whisper text-sm transition-colors",
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

          <div>
            <span className="mb-2 block font-semibold text-black text-sm">
              Font order
            </span>
            <p className="mb-2 font-whisper text-neutral-500 text-xs">
              Drag to reorder how fonts appear in the shop.
            </p>
            {typefaceFonts.length === 0 ? (
              <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-6 font-whisper text-neutral-500 text-sm">
                No fonts in this typeface yet.
              </p>
            ) : (
              <Reorder.Group
                axis="y"
                values={orderedFonts}
                onReorder={handleReorder}
                className="flex flex-col gap-2"
              >
                {orderedFonts.map((fontId) => {
                  const font = typefaceFonts.find(
                    (f) => f.id === fontId
                  );
                  const label =
                    font?.styleName || `Font ${fontId}`;
                  return (
                    <Reorder.Item
                      key={fontId}
                      value={fontId}
                      className="flex cursor-grab items-center gap-2 rounded-lg border border-neutral-300 bg-white p-3 transition-shadow active:cursor-grabbing active:shadow-md"
                    >
                      <RiDraggable className="h-4 w-4 shrink-0 text-neutral-400" />
                      <span className="font-whisper text-sm">
                        {label}
                        {font?.weight != null
                          ? ` (${font.weight})`
                          : ""}
                      </span>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            )}
          </div>

          <div className="pt-2">
            <ButtonModalSave
              type="button"
              onClick={handleSave}
              label="Save Shop Block"
              aria-label="Save shop block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
