"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  RiAddLine,
  RiCloseLine,
  RiLoader4Line,
  RiStarFill,
  RiStarLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { uploadFile } from "@/lib/firebase/storage";
import type { StoreProductVariant } from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";
import { cn } from "@/utils/class-names";

type ProductEditorBodyProps = {
  studioId: string;
  // metadata
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  // variants
  variants: StoreProductVariant[];
  onVariantsChange: (
    variants: StoreProductVariant[]
  ) => void;
  // images
  images: string[];
  onImagesChange: (images: string[]) => void;
  coverImageIndex: number;
  onCoverImageIndexChange: (index: number) => void;
  // availability
  available: boolean;
  onAvailableChange: (value: boolean) => void;
};

const inputClassName =
  "w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black";

function FormField({
  label,
  htmlFor,
  description,
  children,
}: {
  label: string;
  htmlFor?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {htmlFor ? (
        <label
          htmlFor={htmlFor}
          className="mb-1 block font-semibold text-black text-sm"
        >
          {label}
        </label>
      ) : (
        <span className="mb-1 block font-semibold text-black text-sm">
          {label}
        </span>
      )}
      {description && (
        <p className="mb-3 font-whisper text-neutral-500 text-xs">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export function ProductEditorBody({
  studioId,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  category,
  onCategoryChange,
  variants,
  onVariantsChange,
  images,
  onImagesChange,
  coverImageIndex,
  onCoverImageIndexChange,
  available,
  onAvailableChange,
}: ProductEditorBodyProps) {
  return (
    <div className="flex flex-col gap-8">
      <FormField
        label="Name"
        htmlFor="product-name"
      >
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Product name"
          aria-label="Product name"
          className={inputClassName}
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="product-description"
      >
        <textarea
          id="product-description"
          value={description}
          onChange={(e) =>
            onDescriptionChange(e.target.value)
          }
          placeholder="Describe your product..."
          aria-label="Product description"
          rows={4}
          className={`${inputClassName} resize-none`}
        />
      </FormField>

      <FormField
        label="Category"
        htmlFor="product-category"
      >
        <input
          id="product-category"
          type="text"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="e.g. Print, Apparel, Stickers"
          aria-label="Product category"
          className={inputClassName}
        />
      </FormField>

      <FormField
        label="Variants"
        description="If your product exists in different sizes or colors, create a variant for each."
      >
        <VariantsEditor
          variants={variants}
          onChange={onVariantsChange}
        />
      </FormField>

      <FormField
        label="Images"
        description="Click the star on an image to use it as the cover."
      >
        <ImagesEditor
          studioId={studioId}
          images={images}
          onChange={onImagesChange}
          coverImageIndex={coverImageIndex}
          onCoverImageIndexChange={onCoverImageIndexChange}
        />
      </FormField>

      <FormField label="Availability">
        <div className="inline-flex rounded-lg border border-neutral-300 bg-white p-1">
          <button
            type="button"
            onClick={() => onAvailableChange(true)}
            aria-pressed={available}
            className={cn(
              "cursor-pointer rounded-md px-4 py-2 font-medium font-whisper text-sm transition-colors",
              available
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            Available
          </button>
          <button
            type="button"
            onClick={() => onAvailableChange(false)}
            aria-pressed={!available}
            className={cn(
              "cursor-pointer rounded-md px-4 py-2 font-medium font-whisper text-sm transition-colors",
              !available
                ? "bg-black text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            Unavailable
          </button>
        </div>
      </FormField>
    </div>
  );
}

function VariantsEditor({
  variants,
  onChange,
}: {
  variants: StoreProductVariant[];
  onChange: (variants: StoreProductVariant[]) => void;
}) {
  const handleAdd = () => {
    onChange([
      ...variants,
      { key: generateUUID(), title: "", price: 0 },
    ]);
  };

  const handleChange = (
    key: string,
    field: "title" | "price",
    value: string | number
  ) => {
    onChange(
      variants.map((v) =>
        v.key === key ? { ...v, [field]: value } : v
      )
    );
  };

  const handleRemove = (key: string) => {
    if (variants.length <= 1) return;
    onChange(variants.filter((v) => v.key !== key));
  };

  return (
    <div className="space-y-2">
      {variants.map((variant) => (
        <div
          key={variant.key}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3"
        >
          <input
            type="text"
            value={variant.title}
            onChange={(e) =>
              handleChange(
                variant.key,
                "title",
                e.target.value
              )
            }
            placeholder="Variant name (e.g. Small, Blue)"
            aria-label="Variant title"
            className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
          <div className="relative w-28">
            <input
              type="number"
              value={variant.price}
              onChange={(e) =>
                handleChange(
                  variant.key,
                  "price",
                  Math.max(0, Number(e.target.value))
                )
              }
              min={0}
              step={0.01}
              placeholder="Price"
              aria-label="Variant price"
              className="w-full rounded border border-neutral-300 px-2 py-1.5 pr-7 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
            />
            <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400 text-sm">
              ₩
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleRemove(variant.key)}
            disabled={variants.length <= 1}
            aria-label="Remove variant"
            className="shrink-0 rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-red-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
          >
            <RiCloseLine className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 border-dashed py-2 font-medium font-whisper text-neutral-500 text-xs transition-colors hover:border-neutral-400 hover:text-neutral-700"
      >
        <RiAddLine className="h-4 w-4" />
        Add variant
      </button>
    </div>
  );
}

function ImagesEditor({
  studioId,
  images,
  onChange,
  coverImageIndex,
  onCoverImageIndexChange,
}: {
  studioId: string;
  images: string[];
  onChange: (images: string[]) => void;
  coverImageIndex: number;
  onCoverImageIndexChange: (index: number) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(
          file,
          "layout",
          studioId
        );
        urls.push(url);
      }
      onChange([...images, ...urls]);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFilesUpload(files);
  };

  const handleRemoveImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
    if (index === coverImageIndex) {
      onCoverImageIndexChange(0);
    } else if (index < coverImageIndex) {
      onCoverImageIndexChange(coverImageIndex - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        aria-label="Upload product images"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFilesUpload(e.target.files);
          }
        }}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
          {images.map((url, index) => {
            const isCover = index === coverImageIndex;
            return (
              <div
                key={url}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                  isCover
                    ? "border-black"
                    : "border-neutral-200"
                )}
              >
                <Image
                  src={url}
                  alt={`Product ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 15vw"
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() =>
                    onCoverImageIndexChange(index)
                  }
                  aria-label={
                    isCover
                      ? "Cover image"
                      : "Set as cover image"
                  }
                  aria-pressed={isCover}
                  className={cn(
                    "absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors",
                    isCover
                      ? "bg-black text-white"
                      : "bg-white/90 text-neutral-700 opacity-0 hover:bg-white group-hover:opacity-100"
                  )}
                  title={
                    isCover
                      ? "Cover image"
                      : "Set as cover image"
                  }
                >
                  {isCover ? (
                    <RiStarFill className="h-4 w-4" />
                  ) : (
                    <RiStarLine className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  aria-label="Remove product image"
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 transition-opacity hover:bg-white hover:text-red-500 group-hover:opacity-100"
                  title="Remove image"
                >
                  <RiCloseLine className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full cursor-pointer rounded-lg border-2 border-neutral-300 border-dashed p-4 transition-colors hover:border-neutral-400 disabled:cursor-wait"
      >
        {isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <RiLoader4Line className="h-4 w-4 animate-spin text-neutral-400" />
            <span className="text-neutral-500 text-sm">
              Uploading...
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <RiUploadCloud2Line className="h-5 w-5 text-neutral-400" />
            <span className="text-neutral-500 text-sm">
              Drop images or click to browse
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
