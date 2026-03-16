"use client";

import { Reorder } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiDraggable,
  RiLoader4Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { ButtonModalSave } from "@/components/molecules/buttons";
import { useModalOpen } from "@/hooks/use-modal-open";
import { uploadFile } from "@/lib/firebase/storage";
import type { StoreBlockModalProps } from "@/types/components";
import type {
  StoreProduct,
  StoreProductVariant,
} from "@/types/layout";
import { generateUUID } from "@/utils/generate-uuid";

function createEmptyProduct(): StoreProduct {
  return {
    key: generateUUID(),
    name: "",
    description: "",
    images: [],
    variants: [
      { key: generateUUID(), title: "Default", price: 0 },
    ],
  };
}

function createEmptyVariant(): StoreProductVariant {
  return { key: generateUUID(), title: "", price: 0 };
}

export default function StoreBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  studioId,
}: StoreBlockModalProps) {
  useModalOpen(isOpen);

  const [products, setProducts] = useState<StoreProduct[]>(
    () =>
      initialData?.products?.map((p) => ({
        ...p,
        variants:
          p.variants && p.variants.length > 0
            ? p.variants
            : p.price !== undefined
              ? [
                  {
                    key: generateUUID(),
                    title: "Default",
                    price: p.price,
                  },
                ]
              : [
                  {
                    key: generateUUID(),
                    title: "Default",
                    price: 0,
                  },
                ],
      })) ?? []
  );

  const [selectedKey, setSelectedKey] = useState<
    string | null
  >(() => products[0]?.key ?? null);

  const selectedProduct = products.find(
    (p) => p.key === selectedKey
  );

  const handleAddProduct = () => {
    const newProduct = createEmptyProduct();
    setProducts((prev) => [...prev, newProduct]);
    setSelectedKey(newProduct.key);
  };

  const handleRemoveProduct = (key: string) => {
    setProducts((prev) =>
      prev.filter((p) => p.key !== key)
    );
    if (selectedKey === key) {
      const remaining = products.filter(
        (p) => p.key !== key
      );
      setSelectedKey(remaining[0]?.key ?? null);
    }
  };

  const handleFieldChange = (
    key: string,
    field: "name" | "description",
    value: string
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, [field]: value } : p
      )
    );
  };

  const handleVariantsChange = (
    key: string,
    variants: StoreProductVariant[]
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, variants } : p
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden"
      data-modal
      data-lenis-prevent
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismiss */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white">
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

        {/* Two-column content */}
        <div className="grid min-h-0 flex-1 grid-cols-[280px_1fr] overflow-hidden">
          {/* Left: Product list */}
          <div className="flex flex-col overflow-y-auto border-neutral-200 border-r">
            <div className="flex flex-col gap-2 p-4">
              {products.length === 0 ? (
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 border-dashed py-4 font-medium font-whisper text-neutral-500 text-sm transition-colors hover:border-neutral-400 hover:text-neutral-700"
                >
                  <RiAddLine className="h-4 w-4" />
                  Add product
                </button>
              ) : (
                <>
                  <Reorder.Group
                    axis="y"
                    values={products}
                    onReorder={handleReorder}
                    className="flex flex-col gap-2"
                  >
                    {products.map((product) => (
                      <Reorder.Item
                        key={product.key}
                        value={product}
                        className="group flex cursor-grab items-center gap-2 rounded-lg border bg-white p-3 transition-colors active:cursor-grabbing"
                        style={{
                          borderColor:
                            selectedKey === product.key
                              ? "rgb(0 0 0)"
                              : "rgb(229 229 229)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedKey(product.key)
                          }
                          className="min-w-0 flex-1 text-left"
                        >
                          <span className="block truncate font-medium font-whisper text-sm">
                            {product.name ||
                              "Untitled product"}
                          </span>
                          {product.images?.[0] && (
                            <div className="mt-1.5 aspect-square w-12 overflow-hidden rounded border border-neutral-200">
                              <Image
                                src={product.images[0]}
                                alt=""
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                        </button>
                        <div className="flex shrink-0 items-center gap-1">
                          <RiDraggable className="h-4 w-4 text-neutral-400" />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveProduct(
                                product.key
                              )
                            }
                            aria-label="Remove product"
                            className="rounded p-1 opacity-0 transition-opacity hover:bg-neutral-100 group-hover:opacity-100"
                          >
                            <RiDeleteBinLine className="h-4 w-4 text-neutral-400 hover:text-red-500" />
                          </button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 border-dashed py-2 font-medium font-whisper text-neutral-500 text-xs transition-colors hover:border-neutral-400 hover:text-neutral-700"
                  >
                    <RiAddLine className="h-4 w-4" />
                    Add product
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right: Product detail */}
          <div className="overflow-y-auto overscroll-contain p-6">
            {selectedProduct ? (
              <ProductDetailView
                product={selectedProduct}
                studioId={studioId}
                onFieldChange={handleFieldChange}
                onVariantsChange={handleVariantsChange}
                onImagesChange={handleImagesChange}
              />
            ) : (
              <div className="flex items-center justify-center py-24 text-center">
                <p className="font-whisper text-neutral-500 text-sm">
                  {products.length === 0
                    ? "Add a product to get started"
                    : "Select a product to edit"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-neutral-200 border-t p-6">
          <ButtonModalSave
            type="button"
            onClick={handleSave}
            label="Save Store"
            aria-label="Save store block"
          />
        </div>
      </div>
    </div>
  );
}

// --- Product detail view ---

function ProductDetailView({
  product,
  studioId,
  onFieldChange,
  onVariantsChange,
  onImagesChange,
}: {
  product: StoreProduct;
  studioId: string;
  onFieldChange: (
    key: string,
    field: "name" | "description",
    value: string
  ) => void;
  onVariantsChange: (
    key: string,
    variants: StoreProductVariant[]
  ) => void;
  onImagesChange: (key: string, images: string[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const variants = product.variants ?? [
    { key: generateUUID(), title: "Default", price: 0 },
  ];

  const handleAddVariant = () => {
    onVariantsChange(product.key, [
      ...variants,
      createEmptyVariant(),
    ]);
  };

  const handleVariantChange = (
    variantKey: string,
    field: "title" | "price",
    value: string | number
  ) => {
    onVariantsChange(
      product.key,
      variants.map((v) =>
        v.key === variantKey ? { ...v, [field]: value } : v
      )
    );
  };

  const handleRemoveVariant = (variantKey: string) => {
    if (variants.length <= 1) return;
    onVariantsChange(
      product.key,
      variants.filter((v) => v.key !== variantKey)
    );
  };

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
    <div className="flex flex-col gap-6">
      {/* 4A) Title */}
      <div>
        <label
          htmlFor="product-title"
          className="mb-1.5 block font-semibold text-neutral-700 text-sm"
        >
          Title
        </label>
        <input
          id="product-title"
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
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* 4B) Description */}
      <div>
        <label
          htmlFor="product-description"
          className="mb-1.5 block font-semibold text-neutral-700 text-sm"
        >
          Description
        </label>
        <textarea
          id="product-description"
          value={product.description}
          onChange={(e) =>
            onFieldChange(
              product.key,
              "description",
              e.target.value
            )
          }
          placeholder="Describe your product..."
          aria-label="Product description"
          rows={3}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* 4C) Variants */}
      <div>
        <div className="mb-1.5 block font-semibold text-neutral-700 text-sm">
          Variant
        </div>
        <p className="mb-3 font-whisper text-neutral-500 text-xs">
          If your product exists in different size or color,
          create a variant for each.
        </p>
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
                  handleVariantChange(
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
                    handleVariantChange(
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
                onClick={() =>
                  handleRemoveVariant(variant.key)
                }
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
            onClick={handleAddVariant}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 border-dashed py-2 font-medium font-whisper text-neutral-500 text-xs transition-colors hover:border-neutral-400 hover:text-neutral-700"
          >
            <RiAddLine className="h-4 w-4" />
            Add variant
          </button>
        </div>
      </div>

      {/* 4D) Images */}
      <div>
        <label
          htmlFor="product-images-upload"
          className="mb-1.5 block font-semibold text-neutral-700 text-sm"
        >
          Images
        </label>
        <input
          ref={fileInputRef}
          id="product-images-upload"
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

        {product.images.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {product.images.map((url, index) => (
              <div
                key={url}
                className="group relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-200"
              >
                <Image
                  src={url}
                  alt={`Product ${index + 1}`}
                  width={80}
                  height={80}
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
    </div>
  );
}
