"use client";

import { Reorder } from "motion/react";
import { useState } from "react";
import { RiCloseLine, RiDraggable } from "react-icons/ri";
import AboutBlockModal from "@/components/modals/modal-about-block";
import CharacterSetBlockModal from "@/components/modals/modal-character-set-block";
import DownloadBlockModal from "@/components/modals/modal-download-block";
import GalleryBlockModal from "@/components/modals/modal-gallery-block";
import MediaBlockModal from "@/components/modals/modal-media-block";
import MoreContentBlockModal from "@/components/modals/modal-more-content-block";
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
  MoreContentBlockData,
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
    "more-content",
  ];

export default function TypefaceBlockBuilder({
  activeItems,
  handleRemove,
  handleReorder,
  handleUpdateData,
  getLabelForId,
  studioId,
  typefaceFonts,
  studioTypefaces,
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

  const getBlockColors = (
    item: TypefaceLayoutItem
  ): { bg?: string; text?: string } | null => {
    const blockId = item.blockId;
    const d = item.data;
    if (blockId === "type-tester") {
      const data = d as TypeTesterBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.foregroundColor ?? "#000000",
      };
    }
    if (blockId === "about") {
      const data = d as AboutBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.textColor ?? "#000000",
      };
    }
    if (blockId === "download") {
      const data = d as DownloadBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.textColor ?? "#000000",
      };
    }
    if (blockId === "updates") {
      const data = d as UpdatesBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.textColor ?? "#000000",
      };
    }
    if (blockId === "shop") {
      const data = d as ShopBlockData | undefined;
      return {
        bg: data?.backgroundColor ?? "#ffffff",
        text: data?.textColor ?? "#000000",
      };
    }
    return null;
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
      return null;
    }
    if (blockId === "character-set") {
      return null;
    }
    if (blockId === "goodies-shop") {
      const d = item.data as StoreBlockData;
      const count = d.products?.length || 0;
      return count > 0
        ? `${count} product${count > 1 ? "s" : ""}`
        : null;
    }
    if (blockId === "download") {
      return null;
    }
    if (blockId === "type-tester") {
      return null;
    }
    if (blockId === "updates") {
      return null;
    }
    if (blockId === "shop") {
      return null;
    }
    return null;
  };

  return (
    <div className="col-span-2">
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
            const repeatable = isRepeatable(item.blockId);
            const summary = getBlockSummary(item);
            const colors = getBlockColors(item);
            const isConfigurable =
              CONFIGURABLE_TYPEFACE_BLOCKS.includes(
                item.blockId
              );

            return (
              <Reorder.Item
                key={item.key}
                value={item}
                className="flex min-h-[96px] cursor-grab items-center gap-2 rounded-lg border border-neutral-300 bg-white transition-shadow active:cursor-grabbing active:shadow-md"
              >
                <div className="shrink-0 cursor-grab py-6 pl-3">
                  <RiDraggable className="h-4 w-4 text-neutral-400" />
                </div>

                {repeatable || isConfigurable ? (
                  <button
                    type="button"
                    onClick={() => handleBlockClick(item)}
                    className="flex min-h-[96px] flex-1 cursor-pointer flex-col items-start justify-center gap-1 py-6 text-left transition-colors hover:text-black"
                  >
                    <span className="font-bold font-whisper text-lg">
                      {getLabelForId(item.blockId)}
                    </span>
                    {(colors || summary) && (
                      <div className="flex flex-row items-center gap-4">
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
                          <span className="font-whisper text-neutral-500 text-sm">
                            — {summary}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                ) : (
                  <span className="flex min-h-[96px] flex-1 items-center py-6 font-medium font-whisper text-lg">
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

      {editingItem?.blockId === "more-content" && (
        <MoreContentBlockModal
          isOpen
          onClose={() => setEditingItem(null)}
          onSave={(d) => handleModalSave(d)}
          initialData={
            editingItem.data as
              | MoreContentBlockData
              | undefined
          }
          studioTypefaces={studioTypefaces}
        />
      )}
    </div>
  );
}
