"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiCloseLine,
  RiLoader4Line,
  RiRefreshLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import {
  ALIGNMENT_OPTIONS,
  MARGIN_OPTIONS,
} from "@/constant/BLOCK_OPTIONS";
import { uploadFile } from "@/lib/firebase/storage";
import type { MediaBlockModalProps } from "@/types/components";
import type {
  BlockAlignment,
  BlockMargin,
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
  const [alignment, setAlignment] =
    useState<BlockAlignment>(
      initialData?.alignment || "center"
    );
  const [margin, setMargin] = useState<BlockMargin>(
    initialData?.margin || "m"
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
    onSave({ url, title, description, alignment, margin });
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
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="font-ortank text-xl font-bold">
            {label} Block
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {isImage ? (
            /* Image: Drop zone / Preview */
            <div>
              <span className="block text-sm font-semibold text-black mb-2">
                {label} file
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptTypes}
                onChange={handleFileChange}
                className="hidden"
              />

              {url && !isUploading ? (
                <div className="space-y-3">
                  <div className="relative w-full rounded-lg border border-neutral-200 bg-neutral-50 p-4 flex items-center justify-center min-h-[120px]">
                    {/* biome-ignore lint: dynamic image URL from storage */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={title || label}
                      className="max-h-48 max-w-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-whisper font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors w-full"
                  >
                    <RiRefreshLine className="w-4 h-4" />
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
                  className="w-full p-6 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors disabled:cursor-wait"
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
                className="block text-sm font-semibold text-black mb-1"
              >
                Video URL
              </label>
              <input
                type="url"
                id="video-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor={`${type}-title`}
              className="block text-sm font-semibold text-black mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id={`${type}-title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor={`${type}-description`}
              className="block text-sm font-semibold text-black mb-1"
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm resize-none"
            />
          </div>

          {/* Alignment */}
          <div>
            <span className="block text-sm font-semibold text-black mb-2">
              Alignment
            </span>
            <div className="flex gap-2">
              {ALIGNMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAlignment(opt.value)}
                  className={cn(
                    "flex-1 py-2 text-sm font-whisper font-medium rounded-lg border transition-colors",
                    alignment === opt.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Margin */}
          <div>
            <span className="block text-sm font-semibold text-black mb-2">
              Margin
            </span>
            <div className="flex gap-2">
              {MARGIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMargin(opt.value)}
                  className={cn(
                    "flex-1 py-2 text-sm font-whisper font-medium rounded-lg border transition-colors",
                    margin === opt.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Save {label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
