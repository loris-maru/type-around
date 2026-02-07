"use client";

import { Reorder } from "motion/react";
import { useState } from "react";
import { RiCloseLine, RiDraggable } from "react-icons/ri";
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
  VideoBlockData,
} from "@/types/layout";
import { cn } from "@/utils/class-names";
import BlogBlockInline from "./blog-block-inline";
import GalleryBlockModal from "./gallery-block-modal";
import MediaBlockModal from "./media-block-modal";
import SpacerBlockModal from "./spacer-block-modal";
import StoreBlockModal from "./store-block-modal";

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
      isRepeatable(item.blockId) &&
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
      <h3 className="text-sm font-whisper font-normal text-neutral-500 mb-3">
        Page content blocks
      </h3>
      {activeItems.length === 0 ? (
        <div className="flex items-center justify-center h-32 border border-dashed border-neutral-300 rounded-lg">
          <p className="text-sm text-neutral-400 font-whisper">
            Click a block to add it here
          </p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={activeItems}
          onReorder={handleReorder}
          className="flex flex-col gap-2 p-6 rounded-lg bg-white border border-neutral-300"
        >
          {activeItems.map((item) => {
            // Blog block gets special inline rendering
            if (item.blockId === "blog") {
              return (
                <Reorder.Item
                  key={item.key}
                  value={item}
                  className="cursor-grab active:cursor-grabbing active:shadow-md transition-shadow"
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
                  "flex items-center gap-2 bg-white rounded-lg cursor-grab active:cursor-grabbing active:shadow-md transition-shadow border",
                  isSpacer
                    ? "border-blue-400 active:border-blue-600"
                    : "border-neutral-300 active:border-black"
                )}
              >
                <div className="pl-3 py-3 shrink-0 cursor-grab">
                  <RiDraggable className="w-4 h-4 text-neutral-400" />
                </div>

                {repeatable ? (
                  <button
                    type="button"
                    onClick={() => handleBlockClick(item)}
                    className="flex-1 flex items-center gap-2 py-3 text-left cursor-pointer hover:text-black transition-colors"
                  >
                    <span
                      className={cn(
                        "text-sm font-whisper font-medium",
                        isSpacer && "text-blue-500"
                      )}
                    >
                      {getLabelForId(item.blockId)}
                    </span>
                    {summary && (
                      <span
                        className={cn(
                          "text-sm font-whisper",
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
                  <span className="flex-1 text-sm font-whisper font-medium py-3">
                    {getLabelForId(item.blockId)}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(item.key)}
                  className="p-1 mr-3 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                >
                  <RiCloseLine className="w-4 h-4 text-neutral-400 hover:text-black" />
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
    </div>
  );
}
