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

type FontField = "headerFont" | "textFont";

type FontUploadInputProps = {
  field: FontField;
  label: string;
};

export default function FontUploadInput({
  field,
  label,
}: FontUploadInputProps) {
  const { studio, updateStudioPageSettings } = useStudio();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<
    string | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue =
    (field === "headerFont"
      ? studio?.headerFont
      : studio?.textFont) || "";

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
      await updateStudioPageSettings({ [field]: url });
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
      await updateStudioPageSettings({ [field]: "" });
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

    const urlFileName = decodeURIComponent(
      currentValue.split("/").pop()?.split("?")[0] ||
        currentValue
    );

    const uuidPrefixPattern = /^[a-f0-9-]{36}_/;
    if (uuidPrefixPattern.test(urlFileName)) {
      return urlFileName.replace(uuidPrefixPattern, "");
    }
    return urlFileName;
  })();

  return (
    <div className="relative w-full">
      <span className="mb-2 block font-normal font-whisper text-black text-sm">
        {label}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FONT_FORMATS_STRING}
        onChange={handleInputChange}
        className="hidden"
        aria-label={`Upload ${label.toLowerCase()} file`}
      />

      {isUploading ? (
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-neutral-300 border-dashed bg-neutral-50 px-6 py-8">
          <RiLoader4Line className="h-10 w-10 animate-spin text-neutral-400" />
          <p className="text-neutral-500 text-sm">
            Uploading...
          </p>
        </div>
      ) : currentValue ? (
        <div className="flex flex-col gap-3">
          {/* Preview zone with icon and filename */}
          <div className="relative flex min-h-[120px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <RiFontSize className="h-24 w-24 text-black" />
            <p className="max-w-full truncate font-medium font-whisper text-neutral-700 text-sm">
              {displayName}
            </p>
          </div>

          {/* Replace & Delete buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReplace}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 font-medium font-whisper text-sm transition-colors hover:bg-neutral-50"
            >
              <RiRefreshLine className="h-4 w-4" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 font-medium font-whisper text-red-600 text-sm transition-colors hover:bg-red-50"
            >
              <RiDeleteBinLine className="h-4 w-4" />
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
                ? "Drop your font file here"
                : "Drag & drop your font file"}
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
            {ACCEPTED_FONT_FORMATS.join(", ")} (max 5MB)
          </p>
        </button>
      )}

      {error && (
        <p className="mt-2 font-whisper text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
