"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  RiCloseLine,
  RiDeleteBinLine,
  RiLoader4Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { InputDropdown } from "@/components/global/inputs";
import { uploadFile } from "@/lib/firebase/storage";
import type {
  ImagePreview,
  SubmitFontInUseModalProps,
} from "@/types/components";
import type { StudioSummary } from "@/types/my-account";
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
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
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

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Submit a Font In Use
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

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6"
        >
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Studio Select */}
          <div>
            <label
              htmlFor="studioId"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Studio <span className="text-red-500">*</span>
            </label>
            <InputDropdown
              value={formData.studioId}
              options={[
                { value: "", label: "Select a studio" },
                ...studios.map((s) => ({
                  value: s.id,
                  label: s.name,
                })),
              ]}
              onChange={(value) => {
                const studio = studios.find(
                  (s) => s.id === value
                );
                setSelectedStudio(studio || null);
                setFormData((prev) => ({
                  ...prev,
                  studioId: value,
                  typefaceId: "",
                }));
              }}
              className="w-full"
            />
          </div>

          {/* Typeface Select */}
          <div>
            <label
              htmlFor="typefaceId"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Typeface{" "}
              <span className="text-red-500">*</span>
            </label>
            <InputDropdown
              value={formData.typefaceId}
              options={[
                {
                  value: "",
                  label: selectedStudio
                    ? "Select a typeface"
                    : "Select a studio first",
                },
                ...(selectedStudio?.typefaces.map((t) => ({
                  value: t.id,
                  label: t.name,
                })) ?? []),
              ]}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  typefaceId: value,
                }))
              }
              disabled={!selectedStudio}
              className="w-full"
            />
            {selectedStudio &&
              selectedStudio.typefaces.length === 0 && (
                <p className="mt-1 text-neutral-500 text-xs">
                  This studio has no typefaces.
                </p>
              )}
          </div>

          {/* Images Drop Zone */}
          <div>
            <label
              htmlFor="images"
              className="mb-2 block font-normal font-whisper text-black text-sm"
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
              className={`w-full cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors ${
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
                aria-label="Upload images for font in use submission"
              />
              <div className="flex flex-col items-center gap-2">
                <RiUploadCloud2Line className="h-8 w-8 text-neutral-400" />
                <span className="text-neutral-500 text-sm">
                  Drop images or click to browse
                </span>
                <span className="text-neutral-400 text-xs">
                  PNG, JPG, WebP (max 10MB each)
                </span>
              </div>
            </div>

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
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
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <RiDeleteBinLine className="h-5 w-5 text-white" />
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
              className="mb-2 block font-normal font-whisper text-black text-sm"
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
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Brand Identity for XYZ"
            />
          </div>

          {/* Designer Name */}
          <div>
            <label
              htmlFor="designerName"
              className="mb-2 block font-normal font-whisper text-black text-sm"
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
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., John Doe"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
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
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {isSubmitting && (
                <RiLoader4Line className="h-5 w-5 animate-spin" />
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
