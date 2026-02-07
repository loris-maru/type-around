"use client";

import { useRef, useState } from "react";
import {
  RiDeleteBinLine,
  RiFileTextLine,
  RiImageLine,
  RiLoader4Line,
  RiRefreshLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { IMAGE_EXTENSIONS } from "@/constant/IMAGE_EXTENSIONS";
import { uploadFile } from "@/lib/firebase/storage";
import type { FileDropZoneProps } from "@/types/components";

function getExtensionFromUrl(url: string): string {
  const path = url.split("?")[0];
  return path.split(".").pop()?.toLowerCase() || "";
}

function isPreviewableImage(url: string): boolean {
  const ext = getExtensionFromUrl(url);
  return IMAGE_EXTENSIONS.includes(ext);
}

export default function FileDropZone({
  label,
  accept,
  value,
  onChange,
  instruction,
  description,
  icon = "file",
  studioId,
  folder,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadFile(file, folder, studioId);
      onChange(url);
    } catch (err) {
      setError("Failed to upload file");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleReplace = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleDelete = () => {
    onChange("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const IconComponent =
    icon === "image" ? RiImageLine : RiFileTextLine;

  // Extract filename from URL for display
  const displayValue = value
    ? value.includes("/")
      ? decodeURIComponent(
          value.split("/").pop()?.split("?")[0] || value
        )
      : value
    : "";

  const showPreview = value && isPreviewableImage(value);

  return (
    <div>
      <div className="flex flex-row gap-x-2">
        <span className="block text-sm font-semibold text-black mb-1">
          {label}
        </span>
        {!instruction && (
          <span className="text-xs text-neutral-400">
            {instruction}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Uploaded state with preview */}
      {value && !isUploading ? (
        <div className="flex flex-col gap-3">
          {/* Image preview */}
          {showPreview ? (
            <div className="relative w-full rounded-lg border border-neutral-200 bg-neutral-50 p-4 flex items-center justify-center min-h-[120px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label}
                className="max-h-48 max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <IconComponent className="w-5 h-5 text-neutral-600 shrink-0" />
              <span className="text-sm text-neutral-700 truncate">
                {displayValue}
              </span>
            </div>
          )}

          {/* Replace & Delete buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReplace}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-whisper font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <RiRefreshLine className="w-4 h-4" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-whisper font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RiDeleteBinLine className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ) : (
        /* Empty / uploading state - drag & drop zone */
        <button
          type="button"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() =>
            !isUploading && fileInputRef.current?.click()
          }
          className={`relative w-full p-6 border-2 border-dashed rounded-lg transition-colors ${
            isUploading
              ? "cursor-wait border-neutral-300 bg-neutral-50"
              : isDragging
                ? "cursor-pointer border-black bg-neutral-50"
                : "cursor-pointer border-neutral-300 hover:border-neutral-400"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <RiLoader4Line className="w-8 h-8 text-neutral-400 animate-spin" />
              <span className="text-sm text-neutral-500">
                Uploading...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <RiUploadCloud2Line className="w-8 h-8 text-neutral-400" />
              <span className="text-sm text-neutral-500">
                Drop file or click to browse
              </span>
              {description && (
                <span className="text-xs text-neutral-400">
                  {description}
                </span>
              )}
            </div>
          )}
        </button>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
