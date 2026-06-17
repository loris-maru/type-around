"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";
import { RiAddLine } from "react-icons/ri";
import { LAYOUT_BLOCKS } from "@/constant/LAYOUT_BLOCKS";
import type { LayoutBuilderProps } from "@/types/components";
import type {
  LayoutBlockId,
  LayoutItem,
  LayoutItemData,
} from "@/types/layout";
import { generateUUID } from "@/utils/generate-uuid";
import BlockBuilder from "./layout-builder/block-builder";

export default function LayoutBuilder({
  value,
  onChange,
  studioId,
  studioName,
  studioHangeulName,
  headerFont,
  gradientFrom,
  gradientTo,
}: LayoutBuilderProps) {
  const [activeItems, setActiveItems] = useState<
    LayoutItem[]
  >(value || []);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      startTransition(() => setActiveItems(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setIsPanelOpen(false);
      }
    };
    if (isPanelOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [isPanelOpen]);

  const usedUniqueIds = activeItems
    .map((item) => item.blockId)
    .filter((id) => {
      const block = LAYOUT_BLOCKS.find((b) => b.id === id);
      return block?.unique;
    });

  const availableBlocks = LAYOUT_BLOCKS.filter(
    (block) =>
      !block.unique || !usedUniqueIds.includes(block.id)
  );

  const uniqueBlocks = availableBlocks.filter(
    (b) => b.unique
  );
  const repeatableBlocks = availableBlocks.filter(
    (b) => !b.unique
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
    setIsPanelOpen(false);
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
    <div className="relative w-full">
      {/* Round Add button — overlaid on top of the Safari frame */}
      <div
        ref={panelRef}
        className="absolute top-9 right-4 z-20"
      >
        <button
          type="button"
          onClick={() => setIsPanelOpen((prev) => !prev)}
          aria-label="Add block"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-black shadow-md transition-colors hover:bg-neutral-800"
        >
          <RiAddLine
            className={`h-7 w-7 text-white transition-transform duration-200 ${isPanelOpen ? "rotate-45" : "rotate-0"}`}
          />
        </button>

        {isPanelOpen && (
          <div
            className="absolute top-1/2 right-full z-50 mr-1 -translate-y-1/2 flex flex-col rounded-xl border border-neutral-200 bg-white py-2 shadow-xl"
            style={{
              whiteSpace: "nowrap",
              minWidth: "12rem",
            }}
          >
            {availableBlocks.length === 0 ? (
              <p className="px-4 py-2 font-whisper text-neutral-400 text-sm">
                All blocks have been added.
              </p>
            ) : (
              <>
                {uniqueBlocks.length > 0 && (
                  <>
                    <p className="px-4 pb-1 pt-2 font-whisper text-neutral-400 text-xs uppercase tracking-wider">
                      Unique
                    </p>
                    {uniqueBlocks.map((block) => (
                      <button
                        key={block.id}
                        type="button"
                        onClick={() => handleAdd(block.id)}
                        className="w-full whitespace-nowrap px-4 py-2 text-left font-whisper text-sm transition-colors hover:bg-neutral-50"
                      >
                        {block.label}
                      </button>
                    ))}
                  </>
                )}
                {repeatableBlocks.length > 0 && (
                  <>
                    <p className="px-4 pb-1 pt-2 font-whisper text-neutral-400 text-xs uppercase tracking-wider">
                      Repeatable
                    </p>
                    {repeatableBlocks.map((block) => (
                      <button
                        key={block.id}
                        type="button"
                        onClick={() => handleAdd(block.id)}
                        className="w-full whitespace-nowrap px-4 py-2 text-left font-whisper text-sm transition-colors hover:bg-neutral-50"
                      >
                        {block.label}
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Full-width block builder */}
      <BlockBuilder
        activeItems={activeItems}
        handleRemove={handleRemove}
        handleReorder={handleReorder}
        handleUpdateData={handleUpdateData}
        getLabelForId={getLabelForId}
        studioId={studioId}
        studioName={studioName}
        studioHangeulName={studioHangeulName}
        headerFont={headerFont}
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
      />
    </div>
  );
}
