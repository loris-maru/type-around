"use client";

import { useEffect, useRef, useState } from "react";
import {
  ModalErrorDisplay,
  ModalHeader,
} from "@/components/global/modal";
import { ButtonModalSave } from "@/components/molecules/buttons";
import {
  ERROR_IMAGE_REQUIRED,
  ERROR_SAVE_FAILED,
  LABEL_UPLOADING,
  MODAL_TITLE_FONT_IN_USE,
} from "@/constant/MODAL_CONSTANTS";
import { useModalOpen } from "@/hooks/use-modal-open";
import { uploadFile } from "@/lib/firebase/storage";
import type {
  AddFontInUseModalProps,
  ImagePreview,
} from "@/types/components";
import type { FontInUse } from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";
import FontInUseFormFields from "./font-in-use-form-fields";
import FontInUseImageUpload from "./font-in-use-image-upload";

export default function AddFontInUseModal({
  isOpen,
  onClose,
  onSave,
  editingFontInUse,
  typefaces,
  studioId,
}: AddFontInUseModalProps) {
  useModalOpen(isOpen);

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

  // Prefill form when editing, re-run when modal opens
  useEffect(() => {
    if (!isOpen) return;
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
      setFormData({
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
      setError(null);
    }
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
        file.size <= 10 * 1024 * 1024 // 10MB - MAX_IMAGE_FILE_SIZE
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
        throw new Error(ERROR_IMAGE_REQUIRED);
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
          : ERROR_SAVE_FAILED
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
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden"
      data-modal
      data-lenis-prevent
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white">
        <ModalHeader
          title={
            editingFontInUse
              ? MODAL_TITLE_FONT_IN_USE.edit
              : MODAL_TITLE_FONT_IN_USE.add
          }
          onClose={handleClose}
        />

        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6"
        >
          {error && <ModalErrorDisplay message={error} />}

          <FontInUseImageUpload
            images={images}
            fileInputRef={fileInputRef}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTriggerClick={() =>
              fileInputRef.current?.click()
            }
            onFileChange={handleFileChange}
            onRemoveImage={handleRemoveImage}
          />

          <FontInUseFormFields
            formData={formData}
            onInputChange={handleInputChange}
            onTypefaceChange={(typefaceId) =>
              setFormData((prev) => ({
                ...prev,
                typefaceId,
              }))
            }
            typefaceOptions={typefaces.map((t) => ({
              value: t.id,
              label: t.name,
            }))}
          />

          {typefaces.length === 0 && (
            <p className="text-neutral-500 text-xs">
              No typefaces available. Create a typeface
              first.
            </p>
          )}

          {/* Submit */}
          <div className="pt-4">
            <ButtonModalSave
              type="submit"
              label={
                editingFontInUse
                  ? "Save Changes"
                  : "Add Font In Use"
              }
              loadingLabel={LABEL_UPLOADING}
              disabled={
                isSubmitting ||
                !formData.projectName ||
                !formData.designerName ||
                !formData.typefaceId ||
                images.length === 0
              }
              loading={isSubmitting}
              aria-label={
                editingFontInUse
                  ? "Save font in use changes"
                  : "Add font in use"
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}
