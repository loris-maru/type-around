"use client";

import Image from "next/image";
import {
  RiDeleteBinLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { MAX_IMAGE_FILE_SIZE } from "@/constant/FILE_UPLOAD_LIMITS";
import { HINT_IMAGE_DROPZONE } from "@/constant/MODAL_CONSTANTS";
import type { FontInUseImageUploadProps } from "@/types/components";

const IMAGE_ACCEPT = "image/*";
const MAX_SIZE_MB = MAX_IMAGE_FILE_SIZE / (1024 * 1024);

export default function FontInUseImageUpload({
  images,
  fileInputRef,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onTriggerClick,
  onFileChange,
  onRemoveImage,
}: FontInUseImageUploadProps) {
  return (
    <div>
      <label
        htmlFor="images"
        className="mb-2 block font-normal font-whisper text-black text-sm"
      >
        Images <span className="text-red-500">*</span>
      </label>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone triggers file input */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: drop zone triggers file input */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onTriggerClick}
        className={`w-full cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragging
            ? "border-black bg-neutral-50"
            : "border-neutral-300 hover:border-neutral-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          multiple
          onChange={onFileChange}
          className="hidden"
          aria-label="Upload images for font in use"
        />
        <div className="flex flex-col items-center gap-2">
          <RiUploadCloud2Line className="h-8 w-8 text-neutral-400" />
          <span className="text-neutral-500 text-sm">
            {HINT_IMAGE_DROPZONE}
          </span>
          <span className="text-neutral-400 text-xs">
            PNG, JPG, WebP (max {MAX_SIZE_MB}MB each)
          </span>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
            >
              <Image
                src={img.previewUrl}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveImage(img.id);
                }}
                aria-label="Remove image"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <RiDeleteBinLine className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
