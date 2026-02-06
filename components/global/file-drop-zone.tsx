"use client";

import { useState, useRef } from "react";
import {
  RiUploadCloud2Line,
  RiFileTextLine,
  RiImageLine,
  RiCloseLine,
  RiLoader4Line,
} from "react-icons/ri";
import { uploadFile } from "@/lib/firebase/storage";
import { FileDropZoneProps } from "@/types/components";

export default function FileDropZone({
  label,
  accept,
  value,
  onChange,
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

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>
      <div
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
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <RiLoader4Line className="w-8 h-8 text-neutral-400 animate-spin" />
            <span className="text-sm text-neutral-500">
              Uploading...
            </span>
          </div>
        ) : value ? (
          <div className="flex items-center justify-center gap-2">
            <IconComponent className="w-5 h-5 text-neutral-600" />
            <span className="text-sm text-neutral-700 truncate max-w-[200px]">
              {displayValue}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-neutral-200 rounded-full transition-colors"
            >
              <RiCloseLine className="w-4 h-4 text-neutral-500" />
            </button>
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
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
