"use client";

import {
  RiDeleteBinLine,
  RiFileTextLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import type { SalesFile } from "@/types/components";

export type FontFormat = "otf" | "ttf" | "woff" | "woff2";

type FontFormatDropzoneProps = {
  format: FontFormat;
  file: SalesFile | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemove: () => void;
  onTriggerClick: () => void;
  inputRef: React.RefCallback<HTMLInputElement | null>;
};

export default function FontFormatDropzone({
  format,
  file,
  onChange,
  onDrop,
  onRemove,
  onTriggerClick,
  inputRef,
}: FontFormatDropzoneProps) {
  return (
    <div>
      <span className="mb-1 block font-normal font-whisper text-black text-sm">
        {format.toUpperCase()}
      </span>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={onTriggerClick}
        className="cursor-pointer rounded-lg border-2 border-neutral-300 border-dashed p-4 transition-colors hover:border-neutral-400"
      >
        <input
          ref={inputRef}
          type="file"
          accept={`.${format}`}
          onChange={onChange}
          className="hidden"
          aria-label={`Upload ${format}`}
        />
        {file ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <RiFileTextLine className="h-4 w-4 shrink-0 text-neutral-500" />
              <span className="truncate text-neutral-700 text-sm">
                {file.name}
              </span>
              {file.url && (
                <span className="shrink-0 text-green-600 text-xs">
                  (uploaded)
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="shrink-0 rounded p-1 transition-colors hover:bg-neutral-200"
            >
              <RiDeleteBinLine className="h-4 w-4 text-neutral-500 hover:text-red-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <RiUploadCloud2Line className="h-6 w-6 text-neutral-400" />
            <span className="text-neutral-500 text-xs">
              Drop or click
            </span>
            <span className="text-neutral-400 text-xs">
              .{format}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
