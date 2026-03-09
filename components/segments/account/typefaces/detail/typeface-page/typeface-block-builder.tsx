"use client";

import { Reorder } from "motion/react";
import { useState } from "react";
import { RiCloseLine, RiDraggable } from "react-icons/ri";
import AboutBlockModal from "@/components/modals/modal-about-block";
import CharacterSetBlockModal from "@/components/modals/modal-character-set-block";
import DownloadBlockModal from "@/components/modals/modal-download-block";
import GalleryBlockModal from "@/components/modals/modal-gallery-block";
import MediaBlockModal from "@/components/modals/modal-media-block";
import ShopBlockModal from "@/components/modals/modal-shop-block";
import StoreBlockModal from "@/components/modals/modal-store-block";
import TypeTesterBlockModal from "@/components/modals/modal-type-tester-block";
import UpdatesBlockModal from "@/components/modals/modal-updates-block";
import { LAYOUT_BLOCKS_TYPEFACE } from "@/constant/LAYOUT_BLOCKS_TYPEFACE";
import type { TypefaceBlockBuilderProps } from "@/types/components";
import type {
  GalleryBlockData,
  ImageBlockData,
  StoreBlockData,
  VideoBlockData,
} from "@/types/layout";
import type {
  AboutBlockData,
  CharacterSetBlockData,
  DownloadBlockData,
  ShopBlockData,
  TypefaceLayoutBlockId,
  TypefaceLayoutItem,
  TypefaceLayoutItemData,
  TypeTesterBlockData,
  UpdatesBlockData,
} from "@/types/layout-typeface";

const CONFIGURABLE_TYPEFACE_BLOCKS: TypefaceLayoutBlockId[] =
  [
    "type-tester",
    "about",
    "download",
    "updates",
    "shop",
    "gallery",
    "image",
    "video",
    "character-set",
    "goodies-shop",
  ];

export default function TypefaceBlockBuilder({
  activeItems,
  handleRemove,
  handleReorder,
  handleUpdateData,
  getLabelForId,
  studioId,
  typefaceFonts,
}: TypefaceBlockBuilderProps) {
  const [editingItem, setEditingItem] =
    useState<TypefaceLayoutItem | null>(null);

  const isRepeatable = (blockId: TypefaceLayoutBlockId) => {
    const block = LAYOUT_BLOCKS_TYPEFACE.find(
      (b) => b.id === blockId
    );
    return block ? !block.unique : false;
  };

  const handleBlockClick = (item: TypefaceLayoutItem) => {
    if (
      CONFIGURABLE_TYPEFACE_BLOCKS.includes(item.blockId)
    ) {
      setEditingItem(item);
    }
  };

  const handleModalSave = (
    data: TypefaceLayoutItemData
  ) => {
    if (editingItem) {
      handleUpdateData(editingItem.key, data);
    }
  };

  const getBlockSummary = (
    item: TypefaceLayoutItem
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
    if (blockId === "about") {
      const d = item.data as AboutBlockData;
      return d.textAlign ||
        d.textSize ||
        d.textColor ||
        d.backgroundColor ||
        d.marginTop ||
        d.marginRight ||
        d.marginBottom ||
        d.marginLeft
        ? "Configured"
        : null;
    }
    if (blockId === "character-set") {
      const d = item.data as CharacterSetBlockData;
      return d.backgroundColor || d.fontColor
        ? "Configured"
        : null;
    }
    if (blockId === "goodies-shop") {
      const d = item.data as StoreBlockData;
      const count = d.products?.length || 0;
      return count > 0
        ? `${count} product${count > 1 ? "s" : ""}`
        : null;
    }
    if (blockId === "download") {
      const d = item.data as DownloadBlockData;
      return d.showTrialFonts !== undefined ||
        d.showSpecimen !== undefined ||
        d.backgroundColor
        ? "Configured"
        : null;
    }
    if (blockId === "type-tester") {
      const d = item.data as TypeTesterBlockData;
      return d.backgroundColor || d.foregroundColor
        ? "Configured"
        : null;
    }
    if (blockId === "updates") {
      const d = item.data as UpdatesBlockData;
      return d.backgroundColor || d.textColor || d.margin
        ? "Configured"
        : null;
    }
    if (blockId === "shop") {
      const d = item.data as ShopBlockData;
      return d.backgroundColor ||
        d.textColor ||
        d.margin ||
        (d.fontOrder?.length ?? 0) > 0
        ? "Configured"
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
            const repeatable = isRepeatable(item.blockId);
            const summary = getBlockSummary(item);
            const isConfigurable =
              CONFIGURABLE_TYPEFACE_BLOCKS.includes(
                item.blockId
              );

            return (
              <Reorder.Item
                key={item.key}
                value={item}
                className="flex cursor-grab items-center gap-2 rounded-lg border border-neutral-300 bg-white transition-shadow active:cursor-grabbing active:shadow-md"
              >
                <div className="shrink-0 cursor-grab py-3 pl-3">
                  <RiDraggable className="h-4 w-4 text-neutral-400" />
                </div>

                {repeatable || isConfigurable ? (
                  <button
                    type="button"
                    onClick={() => handleBlockClick(item)}
                    className="flex flex-1 cursor-pointer items-center gap-2 py-3 text-left transition-colors hover:text-black"
                  >
                    <span className="font-medium font-whisper text-sm">
                      {getLabelForId(item.blockId)}
                    </span>
                    {summary && (
                      <span className="font-whisper text-neutral-500 text-sm">
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
                  className="mr-3 rounded p-1 transition-colors hover:bg-neutral-100"
                >
                  <RiCloseLine className="h-4 w-4 text-neutral-400 hover:text-black" />
                </button>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      {editingItem?.blockId === "type-tester" && (
        <TypeTesterBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as
              | TypeTesterBlockData
              | undefined
          }
        />
      )}

      {editingItem?.blockId === "about" && (
        <AboutBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as AboutBlockData | undefined
          }
        />
      )}

      {editingItem?.blockId === "gallery" && (
        <GalleryBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as GalleryBlockData | undefined
          }
          studioId={studioId}
        />
      )}

      {editingItem?.blockId === "image" && (
        <MediaBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as ImageBlockData | undefined
          }
          studioId={studioId}
          type="image"
        />
      )}

      {editingItem?.blockId === "video" && (
        <MediaBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as VideoBlockData | undefined
          }
          studioId={studioId}
          type="video"
        />
      )}

      {editingItem?.blockId === "updates" && (
        <UpdatesBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as UpdatesBlockData | undefined
          }
        />
      )}

      {editingItem?.blockId === "shop" && (
        <ShopBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as ShopBlockData | undefined
          }
          typefaceFonts={typefaceFonts}
        />
      )}

      {editingItem?.blockId === "download" && (
        <DownloadBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as
              | DownloadBlockData
              | undefined
          }
        />
      )}

      {editingItem?.blockId === "character-set" && (
        <CharacterSetBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as
              | CharacterSetBlockData
              | undefined
          }
        />
      )}

      {editingItem?.blockId === "goodies-shop" && (
        <StoreBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as StoreBlockData | undefined
          }
          studioId={studioId}
        />
      )}
    </div>
  );
}
