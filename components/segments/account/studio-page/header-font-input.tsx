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
  RiFileTextLine,
} from "react-icons/ri";

type FontFile = {
  name: string;
  size: number;
  file: File;
};

const ACCEPTED_FORMATS = [
  ".woff",
  ".woff2",
  ".otf",
  ".ttf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function HeaderFontInput() {
  const [fontFile, setFontFile] = useState<FontFile | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ACCEPTED_FORMATS.includes(extension)) {
      return `Invalid format. Accepted: ${ACCEPTED_FORMATS.join(", ")}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 5MB limit";
    }
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFontFile({
      name: file.name,
      size: file.size,
      file: file,
    });
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

  const handleRemoveFile = () => {
    setFontFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="relative w-full">
      <label className="text-base font-normal text-neutral-500 mb-2 block">
        Header Font
      </label>

      {!fontFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "w-full px-6 py-8 border-[2px] border-dashed rounded-lg cursor-pointer",
            "transition-colors flex flex-col items-center justify-center gap-3",
            isDragging
              ? "border-black bg-neutral-100"
              : "bg-transparent"
          )}
        >
          <RiUploadCloud2Line
            className={`w-10 h-10 ${isDragging ? "text-black" : "text-neutral-400"}`}
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
            {ACCEPTED_FORMATS.join(", ")} (max 5MB)
          </p>
        </div>
      ) : (
        <div className="w-full px-4 py-4 border border-neutral-300 bg-white rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
              <RiFileTextLine className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="font-whisper font-medium text-black text-sm truncate max-w-[200px]">
                {fontFile.name}
              </p>
              <p className="text-xs text-neutral-500">
                {formatFileSize(fontFile.size)}
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
        accept={ACCEPTED_FORMATS.join(",")}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
