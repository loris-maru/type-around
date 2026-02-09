"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useRef,
  useState,
} from "react";
import {
  RiCloseLine,
  RiLoader4Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import {
  ACCEPTED_SVG_FORMATS,
  MAX_SVG_FILE_SIZE,
} from "@/constant/FILE_UPLOAD_LIMITS";
import { useStudio } from "@/hooks/use-studio";
import { uploadFile } from "@/lib/firebase/storage";
import { cn } from "@/utils/class-names";

export default function HeroCharacterInput() {
  const { studio, updateStudioPageSettings } = useStudio();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = studio?.heroCharacter || "";

  const validateFile = (file: File): string | null => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ACCEPTED_SVG_FORMATS.includes(extension)) {
      return "Invalid format. Only SVG files are accepted.";
    }
    if (file.size > MAX_SVG_FILE_SIZE) {
      return "File size exceeds 2MB limit";
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!studio) {
      setError("Studio not loaded");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const url = await uploadFile(
        file,
        "icons",
        studio.id
      );
      await updateStudioPageSettings({
        heroCharacter: url,
      });
    } catch (err) {
      setError("Failed to upload SVG");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (
    e: DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemoveFile = async () => {
    setError(null);
    try {
      await updateStudioPageSettings({ heroCharacter: "" });
    } catch {
      setError("Failed to remove file");
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Extract filename from URL for display
  const displayName = currentValue
    ? decodeURIComponent(
        currentValue.split("/").pop()?.split("?")[0] || ""
      )
    : "";

  return (
    <div className="relative w-full">
      <span className="mb-2 block font-normal font-whisper text-black text-sm">
        Single Character
      </span>

      {isUploading ? (
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-neutral-300 border-dashed bg-neutral-50 px-6 py-8">
          <RiLoader4Line className="h-10 w-10 animate-spin text-neutral-400" />
          <p className="text-neutral-500 text-sm">
            Uploading...
          </p>
        </div>
      ) : !currentValue ? (
        // biome-ignore lint/a11y/useSemanticElements: div required for drag-and-drop support
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload SVG hero character file"
          className={cn(
            "w-full cursor-pointer rounded-lg border-2 border-dashed px-6 py-8",
            "flex flex-col items-center justify-center gap-3 transition-colors",
            isDragging
              ? "border-neutral-300 bg-neutral-100"
              : "bg-transparent"
          )}
        >
          <RiUploadCloud2Line
            className={cn(
              "h-10 w-10",
              isDragging ? "text-black" : "text-neutral-400"
            )}
          />
          <div className="text-center">
            <p className="font-medium font-whisper text-black">
              {isDragging
                ? "Drop your SVG file here"
                : "Drag & drop your SVG file"}
            </p>
            <p className="mt-1 text-neutral-500 text-sm">
              or{" "}
              <span className="text-black underline">
                browse
              </span>{" "}
              to upload
            </p>
          </div>
          <p className="text-neutral-400 text-xs">
            Upload a SVG with your hero character (max 2MB)
          </p>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentValue}
                alt="Preview"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <p className="max-w-[200px] truncate font-medium font-whisper text-black text-sm">
                {displayName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="rounded-lg p-2 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-5 w-5 text-neutral-500 hover:text-red-500" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 font-whisper text-red-500 text-sm">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".svg"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload hero character SVG file"
      />
    </div>
  );
}
