"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  RiCloseLine,
  RiDeleteBinLine,
  RiLoader4Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { uploadFile } from "@/lib/firebase/storage";
import type { SubmitFontInUseModalProps } from "@/types/components";
import type { StudioSummary } from "@/types/my-account";
import type { ImagePreview } from "@/types/components";
import { generateUUID } from "@/utils/generate-uuid";

export default function SubmitFontInUseModal({
  isOpen,
  onClose,
  onSubmit,
  studios,
  userId,
  userName,
}: SubmitFontInUseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);

  const [selectedStudio, setSelectedStudio] =
    useState<StudioSummary | null>(null);

  const [formData, setFormData] = useState({
    studioId: "",
    projectName: "",
    designerName: "",
    typefaceId: "",
    description: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      studioId: "",
      projectName: "",
      designerName: "",
      typefaceId: "",
      description: "",
    });
    setImages((prev) => {
      for (const img of prev) {
        if (
          img.file &&
          img.previewUrl.startsWith("blob:")
        ) {
          URL.revokeObjectURL(img.previewUrl);
        }
      }
      return [];
    });
    setSelectedStudio(null);
    setError(null);
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "studioId") {
      const studio = studios.find((s) => s.id === value);
      setSelectedStudio(studio || null);
      setFormData((prev) => ({
        ...prev,
        studioId: value,
        typefaceId: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= 10 * 1024 * 1024
    );

    const newImages: ImagePreview[] = validFiles.map(
      (file) => ({
        id: generateUUID(),
        previewUrl: URL.createObjectURL(file),
        file,
      })
    );

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFilesSelected(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (
        image?.file &&
        image.previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(image.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const resetForm = () => {
    for (const img of images) {
      if (img.file && img.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(img.previewUrl);
      }
    }
    setFormData({
      studioId: "",
      projectName: "",
      designerName: "",
      typefaceId: "",
      description: "",
    });
    setImages([]);
    setSelectedStudio(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (images.length === 0) {
        throw new Error("At least one image is required");
      }

      if (!selectedStudio) {
        throw new Error("Please select a studio");
      }

      // Upload images
      const uploadedUrls: string[] = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            return await uploadFile(
              img.file,
              "images",
              `submissions/${userId}`
            );
          }
          return img.uploadedUrl || img.previewUrl;
        })
      );

      const selectedTypeface =
        selectedStudio.typefaces.find(
          (t) => t.id === formData.typefaceId
        );

      await onSubmit({
        studioId: selectedStudio.id,
        studioName: selectedStudio.name,
        submittedBy: userName,
        submittedByUserId: userId,
        submittedAt: new Date().toISOString(),
        status: "pending",
        images: uploadedUrls,
        projectName: formData.projectName,
        designerName: formData.designerName,
        typefaceId: formData.typefaceId,
        typefaceName: selectedTypeface?.name || "",
        description: formData.description,
      });

      resetForm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
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

      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
          <h2 className="font-ortank text-xl font-bold">
            Submit a Font In Use
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 p-6 space-y-4 overflow-y-auto overscroll-contain"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Studio Select */}
          <div>
            <label
              htmlFor="studioId"
              className="block font-whisper text-sm font-normal text-black mb-2"
            >
              Studio <span className="text-red-500">*</span>
            </label>
            <select
              id="studioId"
              name="studioId"
              value={formData.studioId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value="">Select a studio</option>
              {studios.map((studio) => (
                <option
                  key={studio.id}
                  value={studio.id}
                >
                  {studio.name}
                </option>
              ))}
            </select>
          </div>

          {/* Typeface Select */}
          <div>
            <label
              htmlFor="typefaceId"
              className="block font-whisper text-sm font-normal text-black mb-2"
            >
              Typeface{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="typefaceId"
              name="typefaceId"
              value={formData.typefaceId}
              onChange={handleInputChange}
              required
              disabled={!selectedStudio}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white disabled:bg-neutral-100 disabled:text-neutral-400"
            >
              <option value="">
                {selectedStudio
                  ? "Select a typeface"
                  : "Select a studio first"}
              </option>
              {selectedStudio?.typefaces.map((typeface) => (
                <option
                  key={typeface.id}
                  value={typeface.id}
                >
                  {typeface.name}
                </option>
              ))}
            </select>
            {selectedStudio &&
              selectedStudio.typefaces.length === 0 && (
                <p className="text-xs text-neutral-500 mt-1">
                  This studio has no typefaces.
                </p>
              )}
          </div>

          {/* Images Drop Zone */}
          <div>
            <label
              htmlFor="images"
              className="block font-whisper text-sm font-normal text-black mb-2"
            >
              Images <span className="text-red-500">*</span>
            </label>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone triggers file input */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: drop zone triggers file input */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragging
                  ? "border-black bg-neutral-50"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <RiUploadCloud2Line className="w-8 h-8 text-neutral-400" />
                <span className="text-sm text-neutral-500">
                  Drop images or click to browse
                </span>
                <span className="text-xs text-neutral-400">
                  PNG, JPG, WebP (max 10MB each)
                </span>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 group"
                  >
                    <Image
                      src={img.previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(img.id);
                      }}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <RiDeleteBinLine className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Name */}
          <div>
            <label
              htmlFor="projectName"
              className="block font-whisper text-sm font-normal text-black mb-2"
            >
              Project Name{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., Brand Identity for XYZ"
            />
          </div>

          {/* Designer Name */}
          <div>
            <label
              htmlFor="designerName"
              className="block font-whisper text-sm font-normal text-black mb-2"
            >
              Designer Name{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="designerName"
              name="designerName"
              value={formData.designerName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., John Doe"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block font-whisper text-sm font-normal text-black mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              placeholder="Brief description of the project..."
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.studioId ||
                !formData.projectName ||
                !formData.designerName ||
                !formData.typefaceId ||
                images.length === 0
              }
              className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting && (
                <RiLoader4Line className="w-5 h-5 animate-spin" />
              )}
              {isSubmitting
                ? "Submitting..."
                : "Submit Font In Use"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
