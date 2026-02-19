"use client";

import { Reorder } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiFile2Line,
} from "react-icons/ri";
import type { PagesParameterBlockProps } from "@/types/specimen";
import type { SpecimenPage } from "@/types/studio";
import { cn } from "@/utils/class-names";
import ParameterBlock from "./parameter-block";

function EditablePageName({
  page,
  onSave,
}: {
  page: SpecimenPage;
  onSave: (name: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(page.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(page.name);
  };

  const handleValidate = () => {
    if (editValue.trim()) {
      onSave(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleValidate();
    if (e.key === "Escape") {
      setEditValue(page.name);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <fieldset
      className="flex min-w-0 flex-1 items-center gap-1 border-0 p-0"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1 font-whisper text-sm outline-none focus:border-black"
      />
      <button
        type="button"
        onClick={handleValidate}
        aria-label="Validate page name"
        className="shrink-0 text-green-600 transition-colors hover:text-green-700"
      >
        <RiCheckboxCircleFill size={18} />
      </button>
    </fieldset>
  ) : (
    <button
      type="button"
      onDoubleClick={handleDoubleClick}
      className="min-w-0 flex-1 cursor-pointer truncate rounded px-2 py-1 text-left font-whisper text-sm transition-colors hover:bg-neutral-50"
    >
      {page.name}
    </button>
  );
}

export default function PagesParameterBlock({
  pages,
  selectedPageId,
  onPageSelect,
  onReorder,
  onAddPage,
  onPageNameSave,
  onDeletePage,
}: PagesParameterBlockProps) {
  const [deletePageId, setDeletePageId] = useState<
    string | null
  >(null);

  const handleDeleteClick = (pageId: string) => {
    setDeletePageId(pageId);
  };

  const handleConfirmDelete = () => {
    if (deletePageId) {
      onDeletePage(deletePageId);
      setDeletePageId(null);
    }
  };

  return (
    <ParameterBlock title="Pages">
      <div className="flex flex-col gap-2">
        <Reorder.Group
          axis="y"
          values={pages}
          onReorder={onReorder}
          className="flex flex-col gap-2"
        >
          {pages.map((page) => (
            <Reorder.Item
              key={page.id}
              value={page}
              onClick={() =>
                page.id !== "placeholder" &&
                onPageSelect(page.id)
              }
              className={cn(
                "group flex cursor-pointer items-center gap-2 rounded-lg border py-2 pr-1 pl-2 transition-shadow active:cursor-grabbing active:shadow-md",
                selectedPageId === page.id
                  ? "border-black bg-neutral-50"
                  : "border-neutral-300 bg-white"
              )}
            >
              <RiFile2Line className="h-4 w-4 shrink-0 text-neutral-500" />
              <EditablePageName
                page={page}
                onSave={(name) =>
                  onPageNameSave(page.id, name)
                }
              />
              {pages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(page.id);
                  }}
                  aria-label={`Delete ${page.name}`}
                  className="shrink-0 rounded p-1 text-neutral-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                >
                  <RiDeleteBin6Line className="h-4 w-4" />
                </button>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <button
          type="button"
          onClick={onAddPage}
          className="w-full rounded-lg border border-neutral-300 border-dashed py-2 font-whisper text-neutral-600 text-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50"
        >
          Add page
        </button>
      </div>

      {/* Delete confirmation modal */}
      {deletePageId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click to dismiss */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop click to dismiss */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeletePageId(null)}
          />
          <div
            className="relative mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-page-title"
          >
            <h3
              id="delete-page-title"
              className="mb-2 font-bold font-ortank text-lg"
            >
              Delete page
            </h3>
            <p className="mb-6 font-whisper text-neutral-600 text-sm">
              Are you sure you want to delete the page?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletePageId(null)}
                className="rounded-lg border border-neutral-300 px-4 py-2 font-medium font-whisper transition-colors hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium font-whisper text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ParameterBlock>
  );
}
