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
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
          <h2 className="font-ortank text-xl font-bold">
            Store Block
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-neutral-300 rounded-lg text-sm font-whisper font-medium text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <RiAddLine className="w-4 h-4" />
            Add product
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
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
      className="flex gap-3 p-4 border border-neutral-200 rounded-lg bg-white cursor-grab active:cursor-grabbing active:shadow-md active:border-black transition-shadow"
    >
      {/* Drag handle */}
      <div className="flex items-start pt-1 shrink-0">
        <RiDraggable className="w-4 h-4 text-neutral-400" />
      </div>

      {/* Fields + images */}
      <div className="flex-1 space-y-3 min-w-0">
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
          className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
          className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
            className="w-full px-3 py-1.5 pr-8 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none">
            $
          </span>
        </div>

        {/* Images drop zone */}
        <div>
          <span className="block text-xs font-semibold text-neutral-600 mb-1.5">
            Images
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
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
            <div className="flex flex-wrap gap-2 mb-2">
              {product.images.map((url, index) => (
                <div
                  key={url}
                  className="relative w-14 h-14 rounded-lg overflow-hidden border border-neutral-200 group"
                >
                  {/* biome-ignore lint: dynamic image URL from storage */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute inset-0 bg-black/40 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hidden group-hover:flex"
                  >
                    <RiCloseLine className="w-4 h-4 text-white" />
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
            className="w-full p-3 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors disabled:cursor-wait"
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <RiLoader4Line className="w-4 h-4 text-neutral-400 animate-spin" />
                <span className="text-xs text-neutral-500">
                  Uploading...
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <RiUploadCloud2Line className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-500">
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
        className="p-1 h-fit hover:bg-neutral-100 rounded transition-colors cursor-pointer shrink-0"
      >
        <RiDeleteBinLine className="w-4 h-4 text-neutral-400 hover:text-red-500" />
      </button>
    </Reorder.Item>
  );
}
