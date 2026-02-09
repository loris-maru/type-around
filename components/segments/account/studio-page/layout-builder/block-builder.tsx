"use client";

import { Reorder } from "motion/react";
import { useState } from "react";
import { RiCloseLine, RiDraggable } from "react-icons/ri";
import { CONFIGURABLE_BLOCKS } from "@/constant/BLOCK_CLASS_MAPS";
import { LAYOUT_BLOCKS } from "@/constant/LAYOUT_BLOCKS";
import type { BlockBuilderProps } from "@/types/components";
import type {
  BlogBlockData,
  GalleryBlockData,
  ImageBlockData,
  LayoutBlockId,
  LayoutItem,
  LayoutItemData,
  SpacerBlockData,
  StoreBlockData,
  TypefaceListBlockData,
  VideoBlockData,
} from "@/types/layout";
import { cn } from "@/utils/class-names";
import BlogBlockInline from "./blog-block-inline";
import GalleryBlockModal from "./gallery-block-modal";
import MediaBlockModal from "./media-block-modal";
import SpacerBlockModal from "./spacer-block-modal";
import StoreBlockModal from "./store-block-modal";
import TypefaceListBlockModal from "./typeface-list-block-modal";

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
          className="flex flex-col gap-2 rounded-lg border border-neutral-300 bg-white p-6"
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
            const isSpacer = item.blockId === "spacer";

            return (
              <Reorder.Item
                key={item.key}
                value={item}
                className={cn(
                  "flex cursor-grab items-center gap-2 rounded-lg border bg-white transition-shadow active:cursor-grabbing active:shadow-md",
                  isSpacer
                    ? "border-blue-400 active:border-blue-600"
                    : "border-neutral-300 active:border-black"
                )}
              >
                <div className="shrink-0 cursor-grab py-3 pl-3">
                  <RiDraggable className="h-4 w-4 text-neutral-400" />
                </div>

                {repeatable ||
                CONFIGURABLE_BLOCKS.includes(
                  item.blockId
                ) ? (
                  <button
                    type="button"
                    onClick={() => handleBlockClick(item)}
                    className="flex flex-1 cursor-pointer items-center gap-2 py-3 text-left transition-colors hover:text-black"
                  >
                    <span
                      className={cn(
                        "font-medium font-whisper text-sm",
                        isSpacer && "text-blue-500"
                      )}
                    >
                      {getLabelForId(item.blockId)}
                    </span>
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
                  </button>
                ) : (
                  <span className="flex-1 py-3 font-medium font-whisper text-sm">
                    {getLabelForId(item.blockId)}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(item.key)}
                  aria-label={`Remove ${getLabelForId(item.blockId)} block`}
                  className="mr-3 cursor-pointer rounded p-1 transition-colors hover:bg-neutral-100"
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
    </div>
  );
}
