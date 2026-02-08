"use client";

import Image from "next/image";
import { Reorder } from "motion/react";
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

      <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header - fixed */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
          <h2 className="font-ortank text-xl font-bold">
            Gallery Block
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
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 space-y-6">
          {/* Gap + Colors */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="gallery-gap"
                className="block text-sm font-semibold text-black mb-1"
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
                  className="w-full px-3 py-2 pr-10 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none">
                  px
                </span>
              </div>
            </div>
            <div>
              <span className="block text-sm font-semibold text-black mb-1">
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
                  className="w-20 px-2 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <span className="block text-sm font-semibold text-black mb-1">
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
                  className="w-20 px-2 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
            />
            <button
              type="button"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full p-6 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-400 transition-colors disabled:cursor-wait disabled:border-neutral-200"
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
                    Drop images or click to browse
                  </span>
                  <span className="text-xs text-neutral-400">
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
                  className="flex gap-3 p-3 border border-neutral-200 rounded-lg bg-white cursor-grab active:cursor-grabbing active:shadow-md active:border-black transition-shadow"
                >
                  {/* Drag handle */}
                  <div className="flex items-start pt-1 shrink-0">
                    <RiDraggable className="w-4 h-4 text-neutral-400" />
                  </div>

                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {img.url ? (
                      <Image
                        src={img.url}
                        alt={img.title || "Gallery image"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <RiImageLine className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 space-y-2 min-w-0">
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
                        className="w-3.5 h-3.5 rounded border-neutral-300 text-black focus:ring-black cursor-pointer"
                      />
                      <label
                        htmlFor={`title-${img.key}`}
                        className="text-xs text-neutral-500 cursor-pointer select-none"
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
                          className="flex-1 px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleField(
                              img.key,
                              "showTitle"
                            )
                          }
                          className="p-1 hover:bg-neutral-100 rounded transition-colors cursor-pointer shrink-0"
                        >
                          <RiCloseLine className="w-3.5 h-3.5 text-neutral-400 hover:text-black" />
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
                        className="w-3.5 h-3.5 rounded border-neutral-300 text-black focus:ring-black cursor-pointer"
                      />
                      <label
                        htmlFor={`desc-${img.key}`}
                        className="text-xs text-neutral-500 cursor-pointer select-none"
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
                          className="flex-1 px-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleField(
                              img.key,
                              "showDescription"
                            )
                          }
                          className="p-1 hover:bg-neutral-100 rounded transition-colors cursor-pointer shrink-0"
                        >
                          <RiCloseLine className="w-3.5 h-3.5 text-neutral-400 hover:text-black" />
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
                    className="p-1 h-fit hover:bg-neutral-100 rounded transition-colors cursor-pointer shrink-0"
                  >
                    <RiDeleteBinLine className="w-4 h-4 text-neutral-400 hover:text-red-500" />
                  </button>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>

        {/* Footer - fixed save button */}
        <div className="p-6 border-t border-neutral-200 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-black text-white font-whisper font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Save Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
