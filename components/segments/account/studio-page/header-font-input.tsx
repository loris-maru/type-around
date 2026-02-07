"use client";

import { useRef, useState } from "react";
import {
  RiDeleteBinLine,
  RiFontSize,
  RiLoader4Line,
  RiRefreshLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import {
  ACCEPTED_FONT_FORMATS,
  ACCEPTED_FONT_FORMATS_STRING,
} from "@/constant/ACCEPTED_FONT_FORMATS";
import { MAX_FONT_FILE_SIZE } from "@/constant/FILE_UPLOAD_LIMITS";
import { useStudio } from "@/hooks/use-studio";
import { uploadFile } from "@/lib/firebase/storage";
import { cn } from "@/utils/class-names";

export default function HeaderFontInput() {
  const { studio, updateStudioPageSettings } = useStudio();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<
    string | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = studio?.headerFont || "";

  const validateFile = (file: File): string | null => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ACCEPTED_FONT_FORMATS.includes(extension)) {
      return `Invalid format. Accepted: ${ACCEPTED_FONT_FORMATS.join(", ")}`;
    }
    if (file.size > MAX_FONT_FILE_SIZE) {
      return "File size exceeds 5MB limit";
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
    setOriginalFileName(file.name);

    try {
      const url = await uploadFile(
        file,
        "fonts",
        studio.id
      );
      await updateStudioPageSettings({ headerFont: url });
    } catch (err) {
      setError("Failed to upload font");
      setOriginalFileName(null);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleReplace = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleDelete = async () => {
    setError(null);
    setOriginalFileName(null);
    try {
      await updateStudioPageSettings({ headerFont: "" });
    } catch {
      setError("Failed to remove font");
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Use original filename if available, otherwise extract from URL
  const displayName = (() => {
    if (!currentValue) return "";
    if (originalFileName) return originalFileName;

    console.log(
      "Header font URL from Firestore:",
      currentValue
    );

    const urlFileName = decodeURIComponent(
      currentValue.split("/").pop()?.split("?")[0] ||
        currentValue
    );

    console.log("Extracted filename:", urlFileName);

    const uuidPrefixPattern = /^[a-f0-9-]{36}_/;
    if (uuidPrefixPattern.test(urlFileName)) {
      return urlFileName.replace(uuidPrefixPattern, "");
    }
    return urlFileName;
  })();

  return (
    <div className="relative w-full">
      <span className="text-base font-normal text-neutral-500 mb-2 block">
        Header Font
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FONT_FORMATS_STRING}
        onChange={handleInputChange}
        className="hidden"
      />

      {isUploading ? (
        <div className="w-full px-6 py-8 border-2 border-dashed rounded-lg border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center gap-3">
          <RiLoader4Line className="w-10 h-10 text-neutral-400 animate-spin" />
          <p className="text-sm text-neutral-500">
            Uploading...
          </p>
        </div>
      ) : currentValue ? (
        <div className="flex flex-col gap-3">
          {/* Preview zone with icon and filename */}
          <div className="relative w-full rounded-lg border border-neutral-200 bg-neutral-50 p-6 flex flex-col items-center justify-center min-h-[120px] gap-3">
            <RiFontSize className="w-24 h-24 text-black" />
            <p className="text-sm font-whisper font-medium text-neutral-700 truncate max-w-full">
              {displayName}
            </p>
          </div>

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
        <button
          type="button"
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
                ? "Drop your font file here"
                : "Drag & drop your font file"}
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
            {ACCEPTED_FONT_FORMATS.join(", ")} (max 5MB)
          </p>
        </button>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500 font-whisper">
          {error}
        </p>
      )}
    </div>
  );
}
