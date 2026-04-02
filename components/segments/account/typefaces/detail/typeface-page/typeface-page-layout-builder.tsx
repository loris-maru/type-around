"use client";

import { useMemo } from "react";
import { DEFAULT_TYPEFACE_PAGE_LAYOUT } from "@/constant/DEFAULT_TYPEFACE_PAGE_LAYOUT";
import { LAYOUT_BLOCKS_TYPEFACE } from "@/constant/LAYOUT_BLOCKS_TYPEFACE";
import type { TypefacePageLayoutBuilderProps } from "@/types/components";
import type {
  TypefaceLayoutBlockId,
  TypefaceLayoutItem,
  TypefaceLayoutItemData,
} from "@/types/layout-typeface";
import { generateUUID } from "@/utils/generate-uuid";
import TypefaceBlockBuilder from "./typeface-block-builder";
import TypefaceBlocksList from "./typeface-blocks-list";

export default function TypefacePageLayoutBuilder({
  value,
  onChange,
  studioId,
  typefaceFonts,
  studioTypefaces,
}: TypefacePageLayoutBuilderProps) {
  const activeItems = useMemo(
    () =>
      value?.length ? value : DEFAULT_TYPEFACE_PAGE_LAYOUT,
    [value]
  );

  const usedUniqueIds = activeItems
    .map((item) => item.blockId)
    .filter((id) => {
      const block = LAYOUT_BLOCKS_TYPEFACE.find(
        (b) => b.id === id
      );
      return block?.unique;
    });

  const availableBlocks = LAYOUT_BLOCKS_TYPEFACE.filter(
    (block) =>
      !block.unique || !usedUniqueIds.includes(block.id)
  );

  const handleAdd = (blockId: TypefaceLayoutBlockId) => {
    const newItem: TypefaceLayoutItem = {
      blockId,
      key: generateUUID(),
      ...(blockId === "goodies-shop" && {
        data: { products: [] },
      }),
    };
    onChange([...activeItems, newItem]);
  };

  const handleRemove = (key: string) => {
    onChange(
      activeItems.filter((item) => item.key !== key)
    );
  };

  const handleReorder = (
    newOrder: TypefaceLayoutItem[]
  ) => {
    onChange(newOrder);
  };

  const handleUpdateData = (
    key: string,
    data: TypefaceLayoutItemData
  ) => {
    onChange(
      activeItems.map((item) =>
        item.key === key ? { ...item, data } : item
      )
    );
  };

  const getLabelForId = (id: TypefaceLayoutBlockId) =>
    LAYOUT_BLOCKS_TYPEFACE.find((b) => b.id === id)
      ?.label || id;

  return (
    <div className="grid grid-cols-3 gap-8">
      <TypefaceBlocksList
        availableBlocks={availableBlocks}
        handleAdd={handleAdd}
      />
      <TypefaceBlockBuilder
        activeItems={activeItems}
        handleRemove={handleRemove}
        handleReorder={handleReorder}
        handleUpdateData={handleUpdateData}
        getLabelForId={getLabelForId}
        studioId={studioId}
        typefaceFonts={typefaceFonts}
        studioTypefaces={studioTypefaces}
      />
    </div>
  );
}
