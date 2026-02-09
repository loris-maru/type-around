"use client";

import { Reorder } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  RiCloseLine,
  RiDeleteBinLine,
  RiDraggable,
  RiImageLine,
  RiLoader4Line,
  RiUploadCloud2Line,
} from "react-icons/ri";
import ColorPicker from "@/components/molecules/color-picker";
import { uploadFile } from "@/lib/firebase/storage";
import type { GalleryBlockModalProps } from "@/types/components";
import type { GalleryImage } from "@/types/layout";
import { generateUUID } from "@/utils/generate-uuid";

export default function GalleryBlockModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  studioId,
}: GalleryBlockModalProps) {
  const [gap, setGap] = useState<number>(
    initialData?.gap ?? 0
  );
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || ""
  );
  const [fontColor, setFontColor] = useState(
    initialData?.fontColor || ""
  );
  const [images, setImages] = useState<GalleryImage[]>(() =>
    (initialData?.images || []).map((img) => ({
      ...img,
      showTitle: img.showTitle ?? !!img.title,
      showDescription:
        img.showDescription ?? !!img.description,
    }))
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const newImages: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(
          file,
          "layout",
          studioId
        );
        newImages.push({
          key: generateUUID(),
          url,
          title: "",
          description: "",
          showTitle: false,
          showDescription: false,
        });
      }
      setImages((prev) => [...prev, ...newImages]);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      handleFileUpload(e.target.files);
    }
  };

  const handleImageFieldChange = (
    key: string,
    field: "title" | "description",
    value: string
  ) => {
    setImages((prev) =>
      prev.map((img) =>
        img.key === key ? { ...img, [field]: value } : img
      )
    );
  };

  const handleToggleField = (
    key: string,
    field: "showTitle" | "showDescription"
  ) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.key !== key) return img;
        const newValue = !img[field];
        const cleared =
          field === "showTitle"
            ? {
                showTitle: newValue,
                title: newValue ? img.title : "",
              }
            : {
                showDescription: newValue,
                description: newValue
                  ? img.description
                  : "",
              };
        return { ...img, ...cleared };
      })
    );
  };

  const handleRemoveImage = (key: string) => {
    setImages((prev) =>
      prev.filter((img) => img.key !== key)
    );
  };

  const handleReorder = (newOrder: GalleryImage[]) => {
    setImages(newOrder);
  };

  const handleSave = () => {
    onSave({ gap, images, backgroundColor, fontColor });
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
        {/* Header - fixed */}
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            Gallery Block
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
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-6">
          {/* Gap + Colors */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="gallery-gap"
                className="mb-1 block font-semibold text-black text-sm"
              >
                Gap
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="gallery-gap"
                  value={gap}
                  onChange={(e) =>
                    setGap(
                      Math.max(0, Number(e.target.value))
                    )
                  }
                  min={0}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 pr-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 text-sm">
                  px
                </span>
              </div>
            </div>
            <div>
              <span className="mb-1 block font-semibold text-black text-sm">
                Background color
              </span>
              <div className="flex items-center gap-2">
                <ColorPicker
                  id="gallery-bg-color"
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
                  aria-label="Gallery background color hex value"
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
                  id="gallery-font-color"
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
                  aria-label="Gallery font color hex value"
                  className="w-20 rounded-lg border border-neutral-300 px-2 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Drop zone */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload gallery images"
            />
            <button
              type="button"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full cursor-pointer rounded-lg border-2 border-neutral-300 border-dashed p-6 transition-colors hover:border-neutral-400 disabled:cursor-wait disabled:border-neutral-200"
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
                    Drop images or click to browse
                  </span>
                  <span className="text-neutral-400 text-xs">
                    You can upload multiple images
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Draggable image list */}
          {images.length > 0 && (
            <Reorder.Group
              axis="y"
              values={images}
              onReorder={handleReorder}
              className="space-y-3"
            >
              {images.map((img) => (
                <Reorder.Item
                  key={img.key}
                  value={img}
                  className="flex cursor-grab gap-3 rounded-lg border border-neutral-200 bg-white p-3 transition-shadow active:cursor-grabbing active:border-black active:shadow-md"
                >
                  {/* Drag handle */}
                  <div className="flex shrink-0 items-start pt-1">
                    <RiDraggable className="h-4 w-4 text-neutral-400" />
                  </div>

                  {/* Thumbnail */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
                    {img.url ? (
                      <Image
                        src={img.url}
                        alt={img.title || "Gallery image"}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <RiImageLine className="h-5 w-5 text-neutral-400" />
                    )}
                  </div>

                  {/* Fields */}
                  <div className="min-w-0 flex-1 space-y-2">
                    {/* Title toggle */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`title-${img.key}`}
                        checked={img.showTitle}
                        onChange={() =>
                          handleToggleField(
                            img.key,
                            "showTitle"
                          )
                        }
                        className="h-3.5 w-3.5 cursor-pointer rounded border-neutral-300 text-black focus:ring-black"
                      />
                      <label
                        htmlFor={`title-${img.key}`}
                        className="cursor-pointer select-none text-neutral-500 text-xs"
                      >
                        Title
                      </label>
                    </div>
                    {img.showTitle && (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={img.title}
                          onChange={(e) =>
                            handleImageFieldChange(
                              img.key,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Enter title"
                          className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleField(
                              img.key,
                              "showTitle"
                            )
                          }
                          aria-label="Remove title"
                          className="shrink-0 cursor-pointer rounded p-1 transition-colors hover:bg-neutral-100"
                        >
                          <RiCloseLine className="h-3.5 w-3.5 text-neutral-400 hover:text-black" />
                        </button>
                      </div>
                    )}

                    {/* Description toggle */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`desc-${img.key}`}
                        checked={img.showDescription}
                        onChange={() =>
                          handleToggleField(
                            img.key,
                            "showDescription"
                          )
                        }
                        className="h-3.5 w-3.5 cursor-pointer rounded border-neutral-300 text-black focus:ring-black"
                      />
                      <label
                        htmlFor={`desc-${img.key}`}
                        className="cursor-pointer select-none text-neutral-500 text-xs"
                      >
                        Description
                      </label>
                    </div>
                    {img.showDescription && (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={img.description}
                          onChange={(e) =>
                            handleImageFieldChange(
                              img.key,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Enter description"
                          className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleField(
                              img.key,
                              "showDescription"
                            )
                          }
                          aria-label="Remove description"
                          className="shrink-0 cursor-pointer rounded p-1 transition-colors hover:bg-neutral-100"
                        >
                          <RiCloseLine className="h-3.5 w-3.5 text-neutral-400 hover:text-black" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage(img.key)
                    }
                    aria-label="Remove image"
                    className="h-fit shrink-0 cursor-pointer rounded p-1 transition-colors hover:bg-neutral-100"
                  >
                    <RiDeleteBinLine className="h-4 w-4 text-neutral-400 hover:text-red-500" />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* Footer - fixed save button */}
        <div className="shrink-0 border-neutral-200 border-t p-6">
          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800"
          >
            Save Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
