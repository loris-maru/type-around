"use client";

import { Reorder } from "motion/react";
import { useState } from "react";
import { RiCloseLine, RiDraggable } from "react-icons/ri";
import FontsInUseBlockModal from "@/components/modals/modal-fonts-in-use-block";
import GalleryBlockModal from "@/components/modals/modal-gallery-block";
import MediaBlockModal from "@/components/modals/modal-media-block";
import SpacerBlockModal from "@/components/modals/modal-spacer-block";
import StoreBlockModal from "@/components/modals/modal-store-block";
import StudioAboutBlockModal from "@/components/modals/modal-studio-about-block";
import TypeTesterBlockModal from "@/components/modals/modal-type-tester-block";
import TypefaceListBlockModal from "@/components/modals/modal-typeface-list-block";
import { CONFIGURABLE_BLOCKS } from "@/constant/BLOCK_CLASS_MAPS";
import { LAYOUT_BLOCKS } from "@/constant/LAYOUT_BLOCKS";
import type { BlockBuilderProps } from "@/types/components";
import type {
  AboutBlockData,
  BlogBlockData,
  FontsInUseBlockData,
  GalleryBlockData,
  ImageBlockData,
  LayoutBlockId,
  LayoutItem,
  LayoutItemData,
  SpacerBlockData,
  StoreBlockData,
  TypefaceListBlockData,
  TypeTesterBlockData,
  VideoBlockData,
} from "@/types/layout";
import { cn } from "@/utils/class-names";
import BlogBlockInline from "./blog-block-inline";

export default function BlockBuilder({
  activeItems,
  handleRemove,
  handleReorder,
  handleUpdateData,
  getLabelForId,
  studioId,
}: BlockBuilderProps) {
  const [editingItem, setEditingItem] =
    useState<LayoutItem | null>(null);

  const isRepeatable = (blockId: LayoutBlockId) => {
    const block = LAYOUT_BLOCKS.find(
      (b) => b.id === blockId
    );
    return block ? !block.unique : false;
  };

  const handleBlockClick = (item: LayoutItem) => {
    if (
      CONFIGURABLE_BLOCKS.includes(item.blockId) &&
      item.blockId !== "blog"
    ) {
      setEditingItem(item);
    }
  };

  const handleModalSave = (data: LayoutItemData) => {
    if (editingItem) {
      handleUpdateData(editingItem.key, data);
    }
  };

  const getBlockColors = (
    item: LayoutItem
  ): { bg?: string; text?: string } | null => {
    const blockId = item.blockId;
    const d = item.data;
    if (blockId === "gallery") {
      const data = d as GalleryBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.fontColor ?? "#000000",
      };
    }
    if (blockId === "image" || blockId === "video") {
      const data = d as
        | ImageBlockData
        | VideoBlockData
        | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.fontColor ?? "#000000",
      };
    }
    if (blockId === "typeface-list") {
      const data = d as TypefaceListBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.fontColor ?? "#000000",
      };
    }
    if (blockId === "fonts-in-use") {
      const data = d as FontsInUseBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.fontColor ?? "#000000",
      };
    }
    if (blockId === "about") {
      const data = d as AboutBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.textColor ?? "#000000",
      };
    }
    if (blockId === "type-tester") {
      const data = d as TypeTesterBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.foregroundColor ?? "#000000",
      };
    }
    return null;
  };

  const getBlockSummary = (
    item: LayoutItem
  ): string | null => {
    if (!item.data) return null;
    const blockId = item.blockId;

    if (blockId === "gallery") {
      const d = item.data as GalleryBlockData;
      const count = d.images?.length || 0;
      return count > 0
        ? `${count} image${count > 1 ? "s" : ""}`
        : null;
    }
    if (blockId === "image" || blockId === "video") {
      const d = item.data as
        | ImageBlockData
        | VideoBlockData;
      return d.title || (d.url ? "Uploaded" : null);
    }
    if (blockId === "spacer") {
      const d = item.data as SpacerBlockData;
      return d.size?.toUpperCase() || null;
    }
    if (blockId === "store") {
      const d = item.data as StoreBlockData;
      const count = d.products?.length || 0;
      return count > 0
        ? `${count} product${count > 1 ? "s" : ""}`
        : null;
    }
    return null;
  };

  return (
    <div className="col-span-3">
      <h3 className="mb-3 font-normal font-whisper text-neutral-500 text-sm">
        Page content blocks
      </h3>
      {activeItems.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-neutral-300 border-dashed">
          <p className="font-whisper text-neutral-400 text-sm">
            Click a block to add it here
          </p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={activeItems}
          onReorder={handleReorder}
          className="flex flex-col gap-2 rounded-lg border border-neutral-300 p-4"
        >
          {activeItems.map((item) => {
            // Blog block gets special inline rendering
            if (item.blockId === "blog") {
              return (
                <Reorder.Item
                  key={item.key}
                  value={item}
                  className="cursor-grab transition-shadow active:cursor-grabbing active:shadow-md"
                >
                  <BlogBlockInline
                    data={
                      (item.data as BlogBlockData) || {
                        title: "",
                        articles: [],
                      }
                    }
                    onUpdateData={(data) =>
                      handleUpdateData(item.key, data)
                    }
                    onRemove={() => handleRemove(item.key)}
                  />
                </Reorder.Item>
              );
            }

            const repeatable = isRepeatable(item.blockId);
            const summary = getBlockSummary(item);
            const colors = getBlockColors(item);
            const isSpacer = item.blockId === "spacer";
            const isConfigurable =
              CONFIGURABLE_BLOCKS.includes(item.blockId);

            return (
              <Reorder.Item
                key={item.key}
                value={item}
                className={cn(
                  "flex min-h-[96px] cursor-grab items-center gap-2 rounded-lg border bg-white transition-shadow active:cursor-grabbing active:shadow-md",
                  isSpacer
                    ? "border-blue-400 active:border-blue-600"
                    : "border-neutral-300 active:border-black"
                )}
              >
                <div className="shrink-0 cursor-grab py-6 pl-3">
                  <RiDraggable className="h-4 w-4 text-neutral-400" />
                </div>

                {repeatable || isConfigurable ? (
                  <button
                    type="button"
                    onClick={() => handleBlockClick(item)}
                    className={cn(
                      "flex min-h-[96px] flex-1 cursor-pointer flex-col items-start justify-center gap-1 py-6 text-left transition-colors hover:text-black"
                    )}
                  >
                    <span
                      className={cn(
                        "font-medium font-whisper text-lg",
                        isSpacer && "text-blue-500"
                      )}
                    >
                      {getLabelForId(item.blockId)}
                    </span>
                    {(colors || summary) && (
                      <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
                        {colors && (
                          <>
                            <span className="flex items-center gap-1.5">
                              <span className="font-whisper text-neutral-500 text-xs">
                                Background
                              </span>
                              <span
                                className="h-3 w-3 shrink-0 rounded border border-neutral-300"
                                style={{
                                  backgroundColor:
                                    colors.bg,
                                }}
                                title="Background"
                              />
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="font-whisper text-neutral-500 text-xs">
                                Text
                              </span>
                              <span
                                className="h-3 w-3 shrink-0 rounded border border-neutral-300"
                                style={{
                                  backgroundColor:
                                    colors.text,
                                }}
                                title="Text"
                              />
                            </span>
                          </>
                        )}
                        {summary && (
                          <span
                            className={cn(
                              "font-whisper text-sm",
                              isSpacer
                                ? "text-blue-400"
                                : "text-neutral-500"
                            )}
                          >
                            — {summary}
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                ) : (
                  <span
                    className={cn(
                      "flex min-h-[96px] flex-1 items-center py-6 font-medium font-whisper text-lg",
                      isSpacer && "text-blue-500"
                    )}
                  >
                    {getLabelForId(item.blockId)}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(item.key)}
                  aria-label={`Remove ${getLabelForId(item.blockId)} block`}
                  className="mr-3 shrink-0 rounded p-1 transition-colors hover:bg-neutral-100"
                >
                  <RiCloseLine className="h-4 w-4 text-neutral-400 hover:text-black" />
                </button>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      {/* Gallery modal */}
      {editingItem?.blockId === "gallery" && (
        <GalleryBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={handleModalSave}
          initialData={
            editingItem.data as GalleryBlockData | undefined
          }
          studioId={studioId}
        />
      )}

      {/* Image modal */}
      {editingItem?.blockId === "image" && (
        <MediaBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={handleModalSave}
          initialData={
            editingItem.data as ImageBlockData | undefined
          }
          studioId={studioId}
          type="image"
        />
      )}

      {/* Video modal */}
      {editingItem?.blockId === "video" && (
        <MediaBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={handleModalSave}
          initialData={
            editingItem.data as VideoBlockData | undefined
          }
          studioId={studioId}
          type="video"
        />
      )}

      {/* Spacer modal */}
      {editingItem?.blockId === "spacer" && (
        <SpacerBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={handleModalSave}
          initialData={
            editingItem.data as SpacerBlockData | undefined
          }
        />
      )}

      {/* Store modal */}
      {editingItem?.blockId === "store" && (
        <StoreBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={handleModalSave}
          initialData={
            editingItem.data as StoreBlockData | undefined
          }
          studioId={studioId}
        />
      )}

      {/* Typeface List modal */}
      {editingItem?.blockId === "typeface-list" && (
        <TypefaceListBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={handleModalSave}
          initialData={
            editingItem.data as
              | TypefaceListBlockData
              | undefined
          }
        />
      )}

      {/* Fonts in Use modal */}
      {editingItem?.blockId === "fonts-in-use" && (
        <FontsInUseBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={handleModalSave}
          initialData={
            editingItem.data as
              | FontsInUseBlockData
              | undefined
          }
        />
      )}

      {/* About modal */}
      {editingItem?.blockId === "about" && (
        <StudioAboutBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={handleModalSave}
          initialData={
            editingItem.data as AboutBlockData | undefined
          }
        />
      )}

      {/* Type Tester modal */}
      {editingItem?.blockId === "type-tester" && (
        <TypeTesterBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={handleModalSave}
          initialData={
            editingItem.data as
              | TypeTesterBlockData
              | undefined
          }
        />
      )}
    </div>
  );
}
