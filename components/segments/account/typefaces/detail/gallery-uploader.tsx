"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import {
  RiAddLine,
  RiDeleteBin6Line,
  RiImageLine,
} from "react-icons/ri";
import { uploadFile } from "@/lib/firebase/storage";

type GalleryUploaderProps = {
  studioId: string;
  images: string[];
  onChange: (images: string[]) => void;
};

export default function GalleryUploader({
  studioId,
  images,
  onChange,
}: GalleryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (files: FileList) => {
      setIsUploading(true);
      try {
        const uploadedUrls: string[] = [];
        for (const file of Array.from(files)) {
          const url = await uploadFile(
            file,
            "images",
            studioId
          );
          uploadedUrls.push(url);
        }
        onChange([...images, ...uploadedUrls]);
      } catch (err) {
        console.error("Gallery upload failed:", err);
      } finally {
        setIsUploading(false);
      }
    },
    [studioId, images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  const handleRemove = useCallback(
    (index: number) => {
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange]
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: Drop zone */}
      {/* biome-ignore lint/a11y/useSemanticElements: div required for drag-and-drop support */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload gallery images drop zone"
        className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragging
            ? "border-black bg-neutral-100"
            : "border-neutral-300 hover:border-neutral-400"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <RiImageLine
          size={32}
          className="text-neutral-400"
        />
        <span className="text-center font-whisper text-neutral-500 text-sm">
          {isUploading
            ? "Uploading..."
            : "Drop images here or click to upload"}
        </span>
        <span className="font-whisper text-neutral-400 text-xs">
          .jpg, .png, .webp
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleUpload(e.target.files);
              e.target.value = "";
            }
          }}
          aria-label="Upload gallery images"
        />
      </div>

      {/* Right: Image grid */}
      <div className="min-h-[200px]">
        {images.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-neutral-300 border-dashed">
            <span className="font-whisper text-neutral-400 text-sm">
              No images yet
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((url, index) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={url}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  aria-label={`Remove gallery image ${index + 1}`}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <RiDeleteBin6Line
                    size={20}
                    className="text-white"
                  />
                </button>
              </div>
            ))}
            {/* Add more button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Add more gallery images"
              className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-neutral-300 border-dashed transition-colors hover:border-neutral-400"
            >
              <RiAddLine
                size={20}
                className="text-neutral-400"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
