"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  RiFileTextLine,
  RiImageLine,
  RiLoader4Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import {
  ButtonDeleteFile,
  ButtonReplaceFile,
} from "@/components/molecules/buttons";
import { uploadFile } from "@/lib/firebase/storage";
import type { FileDropZoneProps } from "@/types/components";
import { isPreviewableImage } from "@/utils/image-utils";

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
  const [originalFileName, setOriginalFileName] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setOriginalFileName(file.name);
    try {
      const url = await uploadFile(file, folder, studioId);
      onChange(url);
    } catch (err) {
      setError("Failed to upload file");
      setOriginalFileName(null);
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
    setOriginalFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const IconComponent =
    icon === "image" ? RiImageLine : RiFileTextLine;

  // Use original filename if available, otherwise extract from URL
  // Storage filenames are formatted as "uuid_originalname.ext"
  const displayValue = (() => {
    if (!value) return "";
    if (originalFileName) return originalFileName;

    const urlFileName = decodeURIComponent(
      value.split("/").pop()?.split("?")[0] || value
    );
    // Strip the UUID prefix (36 chars + underscore) if present
    const uuidPrefixPattern = /^[a-f0-9-]{36}_/;
    if (uuidPrefixPattern.test(urlFileName)) {
      return urlFileName.replace(uuidPrefixPattern, "");
    }
    return urlFileName;
  })();

  const showPreview = value && isPreviewableImage(value);

  return (
    <div>
      {label && (
        <div className="flex flex-row gap-x-2">
          <span className="mb-1 block font-medium text-black text-sm">
            {label}
          </span>
          {!instruction && (
            <span className="text-neutral-400 text-xs">
              {instruction}
            </span>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
        aria-label={`Upload ${label}`}
      />

      {/* Uploaded state with preview */}
      {value && !isUploading ? (
        <div className="flex flex-col gap-3">
          {/* Image preview */}
          {showPreview ? (
            <div className="relative flex min-h-[120px] w-full items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <Image
                width={100}
                height={100}
                src={value}
                alt={label}
                className="max-h-48 max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <IconComponent className="h-5 w-5 shrink-0 text-neutral-600" />
              <span className="truncate text-neutral-700 text-sm">
                {displayValue}
              </span>
            </div>
          )}

          {/* Replace & Delete buttons */}
          <div className="flex gap-2">
            <ButtonReplaceFile onClick={handleReplace} />
            <ButtonDeleteFile onClick={handleDelete} />
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
          className={`relative w-full rounded-lg border-2 border-dashed p-6 transition-colors ${
            isUploading
              ? "cursor-wait border-neutral-300 bg-neutral-50"
              : isDragging
                ? "cursor-pointer border-black bg-neutral-50"
                : "cursor-pointer border-neutral-300 hover:border-neutral-400"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <RiLoader4Line className="h-8 w-8 animate-spin text-neutral-400" />
              <span className="text-neutral-500 text-sm">
                Uploading...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <RiUploadCloud2Line className="h-8 w-8 text-neutral-400" />
              <span className="text-neutral-500 text-sm">
                Drop file or click to browse
              </span>
              {description && (
                <span className="text-neutral-400 text-xs">
                  {description}
                </span>
              )}
            </div>
          )}
        </button>
      )}

      {error && (
        <p className="mt-1 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}
