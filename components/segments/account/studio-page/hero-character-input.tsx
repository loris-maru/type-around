"use client";

import { cn } from "@/utils/class-names";
import {
  useState,
  useRef,
  DragEvent,
  ChangeEvent,
} from "react";
import {
  RiUploadCloud2Line,
  RiCloseLine,
  RiLoader4Line,
} from "react-icons/ri";
import { uploadFile } from "@/lib/firebase/storage";
import { useStudio } from "@/hooks/use-studio";
import {
  MAX_SVG_FILE_SIZE,
  ACCEPTED_SVG_FORMATS,
} from "@/constant/FILE_UPLOAD_LIMITS";

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
      <label className="block font-whisper text-sm font-normal text-black mb-2">
        Single Character
      </label>

      {isUploading ? (
        <div className="w-full px-6 py-8 border-2 border-dashed rounded-lg border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center gap-3">
          <RiLoader4Line className="w-10 h-10 text-neutral-400 animate-spin" />
          <p className="text-sm text-neutral-500">
            Uploading...
          </p>
        </div>
      ) : !currentValue ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "w-full px-6 py-8 border-2 border-dashed rounded-lg cursor-pointer",
            "transition-colors flex flex-col items-center justify-center gap-3",
            isDragging
              ? "border-neutral-300 bg-neutral-100"
              : "bg-transparent"
          )}
        >
          <RiUploadCloud2Line
            className={cn(
              "w-10 h-10",
              isDragging ? "text-black" : "text-neutral-400"
            )}
          />
          <div className="text-center">
            <p className="font-whisper font-medium text-black">
              {isDragging
                ? "Drop your SVG file here"
                : "Drag & drop your SVG file"}
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              or{" "}
              <span className="text-black underline">
                browse
              </span>{" "}
              to upload
            </p>
          </div>
          <p className="text-xs text-neutral-400">
            Upload a SVG with your hero character (max 2MB)
          </p>
        </div>
      ) : (
        <div className="w-full px-4 py-4 border border-neutral-300 bg-white rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentValue}
                alt="Preview"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="font-whisper font-medium text-black text-sm truncate max-w-[200px]">
                {displayName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RiCloseLine className="w-5 h-5 text-neutral-500 hover:text-red-500" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500 font-whisper">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".svg"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
