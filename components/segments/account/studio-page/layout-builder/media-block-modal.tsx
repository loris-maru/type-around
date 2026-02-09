"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  RiCloseLine,
  RiLoader4Line,
  RiRefreshLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import ColorPicker from "@/components/molecules/color-picker";
import {
  ALIGNMENT_OPTIONS,
  MARGIN_OPTIONS,
  SIZE_OPTIONS,
} from "@/constant/BLOCK_OPTIONS";
import { uploadFile } from "@/lib/firebase/storage";
import type { MediaBlockModalProps } from "@/types/components";
import type {
  BlockAlignment,
  BlockMargin,
  BlockSize,
} from "@/types/layout";
import { cn } from "@/utils/class-names";

export default function MediaBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  studioId,
  type,
}: MediaBlockModalProps) {
  const [url, setUrl] = useState(initialData?.url || "");
  const [title, setTitle] = useState(
    initialData?.title || ""
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [showTitle, setShowTitle] = useState(
    !!initialData?.title
  );
  const [showDescription, setShowDescription] = useState(
    !!initialData?.description
  );
  const [alignment, setAlignment] =
    useState<BlockAlignment>(
      initialData?.alignment || "center"
    );
  const [margin, setMargin] = useState<BlockMargin>(
    initialData?.margin || "m"
  );
  const [size, setSize] = useState<BlockSize>(
    initialData?.size || "full"
  );
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || ""
  );
  const [fontColor, setFontColor] = useState(
    initialData?.fontColor || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = type === "image";
  const acceptTypes = isImage ? "image/*" : "video/*";
  const label = isImage ? "Image" : "Video";

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadFile(
        file,
        "layout",
        studioId
      );
      setUrl(uploadedUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSave = () => {
    onSave({
      url,
      title,
      description,
      alignment,
      margin,
      size,
      backgroundColor,
      fontColor,
    });
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            {label} Block
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="cursor-pointer rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Two-column body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* ---- Left column: Content ---- */}
            <div className="space-y-5">
              <h3 className="font-normal text-neutral-500 text-sm uppercase tracking-wide">
                Content
              </h3>

              {isImage ? (
                /* Image: Drop zone / Preview */
                <div>
                  <span className="mb-2 block font-semibold text-black text-sm">
                    {label} file
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptTypes}
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label={`Upload ${label} file`}
                  />

                  {url && !isUploading ? (
                    <div className="space-y-3">
                      <div className="relative flex min-h-[120px] w-full items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                        <Image
                          src={url}
                          alt={title || label}
                          width={400}
                          height={192}
                          className="max-h-48 max-w-full object-contain"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 font-medium font-whisper text-sm transition-colors hover:bg-neutral-50"
                      >
                        <RiRefreshLine className="h-4 w-4" />
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={isUploading}
                      className="w-full cursor-pointer rounded-lg border-2 border-neutral-300 border-dashed p-6 transition-colors hover:border-neutral-400 disabled:cursor-wait"
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
                            Drop image or click to browse
                          </span>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                /* Video: URL input */
                <div>
                  <label
                    htmlFor="video-url"
                    className="mb-1 block font-semibold text-black text-sm"
                  >
                    Video URL
                  </label>
                  <input
                    type="url"
                    id="video-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}

              {/* Add title checkbox */}
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={showTitle}
                  onChange={(e) => {
                    setShowTitle(e.target.checked);
                    if (!e.target.checked) setTitle("");
                  }}
                  className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-black"
                />
                <span className="font-medium text-black text-sm">
                  Add title?
                </span>
              </label>

              {showTitle && (
                <div>
                  <label
                    htmlFor={`${type}-title`}
                    className="mb-1 block font-semibold text-black text-sm"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id={`${type}-title`}
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    placeholder="Enter a title"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}

              {/* Add description checkbox */}
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={showDescription}
                  onChange={(e) => {
                    setShowDescription(e.target.checked);
                    if (!e.target.checked)
                      setDescription("");
                  }}
                  className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-black"
                />
                <span className="font-medium text-black text-sm">
                  Add description?
                </span>
              </label>

              {showDescription && (
                <div>
                  <label
                    htmlFor={`${type}-description`}
                    className="mb-1 block font-semibold text-black text-sm"
                  >
                    Description
                  </label>
                  <textarea
                    id={`${type}-description`}
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Enter a description"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}
            </div>

            {/* ---- Right column: Settings ---- */}
            <div className="flex flex-col space-y-5 rounded-xl border border-neutral-300 bg-neutral-100 p-5">
              <h3 className="font-normal text-neutral-500 text-sm uppercase tracking-wide">
                Settings
              </h3>

              {/* Alignment */}
              <div>
                <span className="mb-2 block font-semibold text-black text-sm">
                  Alignment
                </span>
                <div className="flex gap-2">
                  {ALIGNMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setAlignment(opt.value)
                      }
                      className={cn(
                        "flex-1 cursor-pointer rounded-lg border py-2 font-medium font-whisper text-sm transition-colors",
                        alignment === opt.value
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margin */}
              <div>
                <span className="mb-2 block font-semibold text-black text-sm">
                  Margin
                </span>
                <div className="flex gap-2">
                  {MARGIN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMargin(opt.value)}
                      className={cn(
                        "flex-1 cursor-pointer rounded-lg border py-2 font-medium font-whisper text-sm transition-colors",
                        margin === opt.value
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <span className="mb-2 block font-semibold text-black text-sm">
                  Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSize(opt.value)}
                      className={cn(
                        "cursor-pointer rounded-lg border px-3 py-2 font-medium font-whisper text-sm transition-colors",
                        size === opt.value
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="mb-1 block font-semibold text-black text-sm">
                    Background color
                  </span>
                  <div className="flex items-center gap-2">
                    <ColorPicker
                      id={`${type}-bg-color`}
                      value={backgroundColor || "#ffffff"}
                      onChange={setBackgroundColor}
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) =>
                        setBackgroundColor(e.target.value)
                      }
                      placeholder="#ffffff"
                      className="w-20 rounded-lg border border-neutral-300 px-2 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div>
                  <span className="mb-1 block font-semibold text-black text-sm">
                    Font color
                  </span>
                  <div className="flex items-center gap-2">
                    <ColorPicker
                      id={`${type}-font-color`}
                      value={fontColor || "#000000"}
                      onChange={setFontColor}
                    />
                    <input
                      type="text"
                      value={fontColor}
                      onChange={(e) =>
                        setFontColor(e.target.value)
                      }
                      placeholder="#000000"
                      className="w-20 rounded-lg border border-neutral-300 px-2 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Save - pushed to bottom of right column */}
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full cursor-pointer rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800"
                >
                  Save {label}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
