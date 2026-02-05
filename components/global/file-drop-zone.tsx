"use client";

import { useState, useRef } from "react";
import {
  RiUploadCloud2Line,
  RiFileTextLine,
  RiImageLine,
  RiCloseLine,
} from "react-icons/ri";

interface FileDropZoneProps {
  label: string;
  accept: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  icon?: "file" | "image";
}

export default function FileDropZone({
  label,
  accept,
  value,
  onChange,
  description,
  icon = "file",
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // In a real app, you'd upload to storage and get a URL
      onChange(file.name);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to storage and get a URL
      onChange(file.name);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const IconComponent =
    icon === "image" ? RiImageLine : RiFileTextLine;

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging
            ? "border-black bg-neutral-50"
            : "border-neutral-300 hover:border-neutral-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        {value ? (
          <div className="flex items-center justify-center gap-2">
            <IconComponent className="w-5 h-5 text-neutral-600" />
            <span className="text-sm text-neutral-700">
              {value}
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
    </div>
  );
}
