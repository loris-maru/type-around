"use client";

import { useState } from "react";
import {
  RiArrowDownSLine,
  RiCloseLine,
} from "react-icons/ri";
import { ButtonModalSave } from "@/components/molecules/buttons";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { MoreContentBlockData } from "@/types/layout-typeface";
import { cn } from "@/utils/class-names";

type MoreContentBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MoreContentBlockData) => void;
  initialData?: MoreContentBlockData;
  studioTypefaces: { slug: string; name: string }[];
};

export default function MoreContentBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  studioTypefaces,
}: MoreContentBlockModalProps) {
  useModalOpen(isOpen);

  if (!isOpen) return null;

  return (
    <MoreContentBlockModalInner
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
      studioTypefaces={studioTypefaces}
    />
  );
}

function TypefaceDropdown({
  label,
  value,
  onChange,
  typefaces,
}: {
  label: string;
  value: string;
  onChange: (slug: string) => void;
  typefaces: { slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const selected = typefaces.find((t) => t.slug === value);

  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold font-whisper text-black text-sm">
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-3 text-left font-whisper text-sm transition-colors hover:border-neutral-400"
        >
          <span
            className={
              selected ? "text-black" : "text-neutral-400"
            }
          >
            {selected?.name ?? "Select a typeface..."}
          </span>
          <RiArrowDownSLine
            className={cn(
              "h-5 w-5 text-neutral-400 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
        {open && (
          <div className="absolute right-0 left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left font-whisper text-neutral-400 text-sm transition-colors hover:bg-neutral-50"
            >
              None
            </button>
            {typefaces.map((tf) => (
              <button
                key={tf.slug}
                type="button"
                onClick={() => {
                  onChange(tf.slug);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2.5 text-left font-whisper text-sm transition-colors hover:bg-neutral-50",
                  tf.slug === value
                    ? "bg-neutral-100 font-medium text-black"
                    : "text-neutral-700"
                )}
              >
                {tf.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MoreContentBlockModalInner({
  onClose,
  onSave,
  initialData,
  studioTypefaces,
}: Omit<MoreContentBlockModalProps, "isOpen">) {
  const [rec1, setRec1] = useState(
    initialData?.recommendedTypeface1 ?? ""
  );
  const [rec2, setRec2] = useState(
    initialData?.recommendedTypeface2 ?? ""
  );

  const handleSave = () => {
    onSave({
      recommendedTypeface1: rec1 || undefined,
      recommendedTypeface2: rec2 || undefined,
    });
    onClose();
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
            More Content
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
            Choose up to two typefaces to recommend.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <TypefaceDropdown
              label="Recommended typeface 1"
              value={rec1}
              onChange={setRec1}
              typefaces={studioTypefaces}
            />
            <TypefaceDropdown
              label="Recommended typeface 2"
              value={rec2}
              onChange={setRec2}
              typefaces={studioTypefaces}
            />
          </div>

          <div className="pt-2">
            <ButtonModalSave
              type="button"
              onClick={handleSave}
              label="Save"
              aria-label="Save more content block"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
