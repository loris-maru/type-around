"use client";

import { Reorder } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiDraggable,
  RiLoader4Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { uploadFile } from "@/lib/firebase/storage";
import type { StoreBlockModalProps } from "@/types/components";
import type { StoreProduct } from "@/types/layout";
import { generateUUID } from "@/utils/generate-uuid";

function createEmptyProduct(): StoreProduct {
  return {
    key: generateUUID(),
    name: "",
    description: "",
    images: [],
    price: 0,
  };
}

export default function StoreBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  studioId,
}: StoreBlockModalProps) {
  const [products, setProducts] = useState<StoreProduct[]>(
    () => initialData?.products || []
  );

  const handleAddProduct = () => {
    setProducts((prev) => [...prev, createEmptyProduct()]);
  };

  const handleRemoveProduct = (key: string) => {
    setProducts((prev) =>
      prev.filter((p) => p.key !== key)
    );
  };

  const handleFieldChange = (
    key: string,
    field: "name" | "description" | "price",
    value: string | number
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, [field]: value } : p
      )
    );
  };

  const handleImagesChange = (
    key: string,
    images: string[]
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, images } : p
      )
    );
  };

  const handleReorder = (newOrder: StoreProduct[]) => {
    setProducts(newOrder);
  };

  const handleSave = () => {
    onSave({ products });
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
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Store Block
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6">
          {products.length > 0 && (
            <Reorder.Group
              axis="y"
              values={products}
              onReorder={handleReorder}
              className="space-y-3"
            >
              {products.map((product) => (
                <ProductItem
                  key={product.key}
                  product={product}
                  studioId={studioId}
                  onFieldChange={handleFieldChange}
                  onImagesChange={handleImagesChange}
                  onRemove={handleRemoveProduct}
                />
              ))}
            </Reorder.Group>
          )}

          <button
            type="button"
            onClick={handleAddProduct}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 border-dashed py-3 font-medium font-whisper text-neutral-500 text-sm transition-colors hover:border-neutral-400 hover:text-neutral-700"
          >
            <RiAddLine className="h-4 w-4" />
            Add product
          </button>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-neutral-200 border-t p-6">
          <button
            type="button"
            onClick={handleSave}
            className="w-full cursor-pointer rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800"
          >
            Save Store
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Product item sub-component ---

function ProductItem({
  product,
  studioId,
  onFieldChange,
  onImagesChange,
  onRemove,
}: {
  product: StoreProduct;
  studioId: string;
  onFieldChange: (
    key: string,
    field: "name" | "description" | "price",
    value: string | number
  ) => void;
  onImagesChange: (key: string, images: string[]) => void;
  onRemove: (key: string) => void;
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
      onImagesChange(product.key, [
        ...product.images,
        ...urls,
      ]);
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
    onImagesChange(
      product.key,
      product.images.filter((_, i) => i !== index)
    );
  };

  return (
    <Reorder.Item
      key={product.key}
      value={product}
      className="flex cursor-grab gap-3 rounded-lg border border-neutral-200 bg-white p-4 transition-shadow active:cursor-grabbing active:border-black active:shadow-md"
    >
      {/* Drag handle */}
      <div className="flex shrink-0 items-start pt-1">
        <RiDraggable className="h-4 w-4 text-neutral-400" />
      </div>

      {/* Fields + images */}
      <div className="min-w-0 flex-1 space-y-3">
        <input
          type="text"
          value={product.name}
          onChange={(e) =>
            onFieldChange(
              product.key,
              "name",
              e.target.value
            )
          }
          placeholder="Product name"
          aria-label="Product name"
          className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="text"
          value={product.description}
          onChange={(e) =>
            onFieldChange(
              product.key,
              "description",
              e.target.value
            )
          }
          placeholder="Description"
          aria-label="Product description"
          className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="relative w-32">
          <input
            type="number"
            value={product.price}
            onChange={(e) =>
              onFieldChange(
                product.key,
                "price",
                Math.max(0, Number(e.target.value))
              )
            }
            min={0}
            step={0.01}
            placeholder="Price"
            aria-label="Product price in dollars"
            className="w-full rounded-lg border border-neutral-300 px-3 py-1.5 pr-8 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 text-sm">
            $
          </span>
        </div>

        {/* Images drop zone */}
        <div>
          <span className="mb-1.5 block font-semibold text-neutral-600 text-xs">
            Images
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            aria-label="Upload product images"
            onChange={(e) => {
              if (
                e.target.files &&
                e.target.files.length > 0
              ) {
                handleFilesUpload(e.target.files);
              }
            }}
            className="hidden"
          />

          {/* Thumbnails grid */}
          {product.images.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {product.images.map((url, index) => (
                <div
                  key={url}
                  className="group relative h-14 w-14 overflow-hidden rounded-lg border border-neutral-200"
                >
                  {/* biome-ignore lint: dynamic image URL from storage */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    aria-label="Remove product image"
                    className="absolute inset-0 hidden cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:flex group-hover:opacity-100"
                  >
                    <RiCloseLine className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <button
            type="button"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full cursor-pointer rounded-lg border-2 border-neutral-300 border-dashed p-3 transition-colors hover:border-neutral-400 disabled:cursor-wait"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <RiLoader4Line className="h-4 w-4 animate-spin text-neutral-400" />
                <span className="text-neutral-500 text-xs">
                  Uploading...
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <RiUploadCloud2Line className="h-4 w-4 text-neutral-400" />
                <span className="text-neutral-500 text-xs">
                  Drop images or click to browse
                </span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(product.key)}
        aria-label="Remove product"
        className="h-fit shrink-0 cursor-pointer rounded p-1 transition-colors hover:bg-neutral-100"
      >
        <RiDeleteBinLine className="h-4 w-4 text-neutral-400 hover:text-red-500" />
      </button>
    </Reorder.Item>
  );
}
