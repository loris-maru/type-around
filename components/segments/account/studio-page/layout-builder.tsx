"use client";

import { useState } from "react";
import { LAYOUT_BLOCKS } from "@/constant/LAYOUT_BLOCKS";
import type { LayoutBuilderProps } from "@/types/components";
import type {
  LayoutBlockId,
  LayoutItem,
  LayoutItemData,
} from "@/types/layout";
import { generateUUID } from "@/utils/generate-uuid";
import BlockBuilder from "./layout-builder/block-builder";
import BlocksList from "./layout-builder/blocks-list";

export default function LayoutBuilder({
  value,
  onChange,
  studioId,
}: LayoutBuilderProps) {
  const [activeItems, setActiveItems] = useState<
    LayoutItem[]
  >(value || []);

  // Unique blocks that are already in the layout
  const usedUniqueIds = activeItems
    .map((item) => item.blockId)
    .filter((id) => {
      const block = LAYOUT_BLOCKS.find((b) => b.id === id);
      return block?.unique;
    });

  // Available blocks: show all non-unique blocks + unique blocks not yet used
  const availableBlocks = LAYOUT_BLOCKS.filter(
    (block) =>
      !block.unique || !usedUniqueIds.includes(block.id)
  );

  const handleAdd = (blockId: LayoutBlockId) => {
    const newItem: LayoutItem = {
      blockId,
      key: generateUUID(),
      ...(blockId === "spacer" && { data: { size: "m" } }),
    };
    const updated = [...activeItems, newItem];
    setActiveItems(updated);
    onChange(updated);
  };

  const handleRemove = (key: string) => {
    const updated = activeItems.filter(
      (item) => item.key !== key
    );
    setActiveItems(updated);
    onChange(updated);
  };

  const handleReorder = (newOrder: LayoutItem[]) => {
    setActiveItems(newOrder);
    onChange(newOrder);
  };

  const handleUpdateData = (
    key: string,
    data: LayoutItemData
  ) => {
    const updated = activeItems.map((item) =>
      item.key === key ? { ...item, data } : item
    );
    setActiveItems(updated);
    onChange(updated);
  };

  const getLabelForId = (id: LayoutBlockId) =>
    LAYOUT_BLOCKS.find((b) => b.id === id)?.label || id;

  return (
    <div className="grid grid-cols-4 gap-8">
      {/* Left column: Available blocks */}
      <BlocksList
        availableBlocks={availableBlocks}
        handleAdd={handleAdd}
      />

      {/* Right column: Active blocks (draggable) */}
      <BlockBuilder
        activeItems={activeItems}
        handleRemove={handleRemove}
        handleReorder={handleReorder}
        handleUpdateData={handleUpdateData}
        getLabelForId={getLabelForId}
        studioId={studioId}
      />
    </div>
  );
}
