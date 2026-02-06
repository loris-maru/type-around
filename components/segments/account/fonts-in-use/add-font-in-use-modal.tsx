"use client";

import { useState, useRef, useEffect } from "react";
import {
  RiCloseLine,
  RiUploadCloud2Line,
  RiDeleteBinLine,
  RiLoader4Line,
} from "react-icons/ri";
import { FontInUse } from "@/types/studio";
import {
  AddFontInUseModalProps,
  ImagePreview,
} from "@/types/components";
import { generateUUID } from "@/utils/generate-uuid";
import { uploadFile } from "@/lib/firebase/storage";
import Image from "next/image";

export default function AddFontInUseModal({
  isOpen,
  onClose,
  onSave,
  editingFontInUse,
  typefaces,
  studioId,
}: AddFontInUseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);

  const [formData, setFormData] = useState({
    projectName: "",
    designerName: "",
    typefaceId: "",
    description: "",
  });

  // Prefill form when editing
  useEffect(() => {
    if (editingFontInUse) {
      setFormData({
        projectName: editingFontInUse.projectName,
        designerName: editingFontInUse.designerName,
        typefaceId: editingFontInUse.typefaceId,
        description: editingFontInUse.description,
      });
      setImages(
        editingFontInUse.images.map((url) => ({
          id: generateUUID(),
          previewUrl: url,
          uploadedUrl: url, // Already uploaded
        }))
      );
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingFontInUse, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        file, // Store file for upload on submit
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
      // Revoke blob URL if it's a new image
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
    // Revoke all blob URLs
    images.forEach((img) => {
      if (img.file && img.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setFormData({
      projectName: "",
      designerName: "",
      typefaceId: "",
      description: "",
    });
    setImages([]);
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

      // Upload new images to Firebase Storage
      const uploadedUrls: string[] = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            // New image - upload to storage
            return await uploadFile(
              img.file,
              "images",
              studioId
            );
          }
          // Existing image - use existing URL
          return img.uploadedUrl || img.previewUrl;
        })
      );

      const selectedTypeface = typefaces.find(
        (t) => t.id === formData.typefaceId
      );

      const fontInUse: FontInUse = {
        id: editingFontInUse?.id || generateUUID(),
        images: uploadedUrls,
        projectName: formData.projectName,
        designerName: formData.designerName,
        typefaceId: formData.typefaceId,
        typefaceName: selectedTypeface?.name || "",
        description: formData.description,
      };

      onSave(fontInUse);
      resetForm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="font-ortank text-xl font-bold">
            {editingFontInUse
              ? "Edit Font In Use"
              : "Add Font In Use"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Images Drop Zone */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Images <span className="text-red-500">*</span>
            </label>
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

            {/* Image Previews */}
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
              className="block text-sm font-medium text-neutral-700 mb-1"
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
              className="block text-sm font-medium text-neutral-700 mb-1"
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

          {/* Typeface Select */}
          <div>
            <label
              htmlFor="typefaceId"
              className="block text-sm font-medium text-neutral-700 mb-1"
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value="">Select a typeface</option>
              {typefaces.map((typeface) => (
                <option
                  key={typeface.id}
                  value={typeface.id}
                >
                  {typeface.name}
                </option>
              ))}
            </select>
            {typefaces.length === 0 && (
              <p className="text-xs text-neutral-500 mt-1">
                No typefaces available. Create a typeface
                first.
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700 mb-1"
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
                !formData.projectName ||
                !formData.designerName ||
                !formData.typefaceId ||
                images.length === 0
              }
              className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <RiLoader4Line className="w-5 h-5 animate-spin" />
              )}
              {isSubmitting
                ? "Uploading..."
                : editingFontInUse
                  ? "Save Changes"
                  : "Add Font In Use"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
