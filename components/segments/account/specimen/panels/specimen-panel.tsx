"use client";

import { Reorder } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  RiCheckboxCircleFill,
  RiDeleteBin6Line,
  RiFile2Fill,
  RiFile2Line,
} from "react-icons/ri";
import CustomSelect from "@/components/global/custom-select";
import { useStudio } from "@/hooks/use-studio";
import type { SpecimenPage } from "@/types/studio";
import { cn } from "@/utils/class-names";
import { generateUUID } from "@/utils/generate-uuid";

const FORMAT_OPTIONS = [
  { value: "A4", label: "A4" },
  { value: "Letter", label: "Letter" },
];

type SpecimenPanelProps = {
  specimenId: string;
  typefaceSlug: string;
};

function ParameterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 font-semibold text-black text-sm">
        {title}
      </div>
      {children}
    </div>
  );
}

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
    <div className="flex min-w-0 flex-1 items-center gap-1">
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
    </div>
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

export default function SpecimenPanel({
  specimenId,
  typefaceSlug,
}: SpecimenPanelProps) {
  const { studio, updateSpecimen } = useStudio();
  const specimen = useMemo(
    () =>
      studio?.specimens?.find((s) => s.id === specimenId),
    [studio?.specimens, specimenId]
  );
  const specimenName = specimen?.name ?? typefaceSlug;
  const format = specimen?.format ?? "A4";
  const orientation = specimen?.orientation ?? "portrait";
  const pages = specimen?.pages ?? [];
  const effectivePages =
    pages.length > 0
      ? pages
      : [{ id: "placeholder", name: "Page 1" }];

  // Ensure at least 1 page for legacy specimens (empty or undefined pages)
  useEffect(() => {
    if (
      specimen &&
      specimenId &&
      (!specimen.pages || specimen.pages.length === 0)
    ) {
      updateSpecimen(specimenId, {
        pages: [{ id: generateUUID(), name: "Page 1" }],
      });
    }
  }, [specimen, specimenId, updateSpecimen]);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(specimenName);
  const [deletePageId, setDeletePageId] = useState<
    string | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(specimenName);
  };

  const handleValidate = async () => {
    if (editValue.trim()) {
      await updateSpecimen(specimenId, {
        name: editValue.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleValidate();
    if (e.key === "Escape") {
      setEditValue(specimenName);
      setIsEditing(false);
    }
  };

  const handleFormatChange = (value: string) => {
    updateSpecimen(specimenId, {
      format: value as "A4" | "Letter",
    });
  };

  const handleOrientationChange = (
    value: "portrait" | "landscape"
  ) => {
    updateSpecimen(specimenId, { orientation: value });
  };

  const hasPlaceholder = effectivePages.some(
    (p) => p.id === "placeholder"
  );

  const handlePagesReorder = (newPages: SpecimenPage[]) => {
    if (hasPlaceholder) return;
    updateSpecimen(specimenId, { pages: newPages });
  };

  const handleAddPage = () => {
    const basePages = hasPlaceholder
      ? [{ id: generateUUID(), name: "Page 1" }]
      : effectivePages;
    const newPage: SpecimenPage = {
      id: generateUUID(),
      name: `Page ${basePages.length + 1}`,
    };
    updateSpecimen(specimenId, {
      pages: [...basePages, newPage],
    });
  };

  const handlePageNameSave = (
    pageId: string,
    name: string
  ) => {
    if (pageId === "placeholder") {
      updateSpecimen(specimenId, {
        pages: [{ id: generateUUID(), name }],
      });
      return;
    }
    const updated = effectivePages.map((p) =>
      p.id === pageId ? { ...p, name } : p
    );
    updateSpecimen(specimenId, { pages: updated });
  };

  const handleDeletePage = (pageId: string) => {
    if (pageId === "placeholder") return;
    const updated = effectivePages.filter(
      (p) => p.id !== pageId
    );
    updateSpecimen(specimenId, { pages: updated });
    setDeletePageId(null);
  };

  return (
    <div className="w-[300px] shrink-0 rounded-lg border border-neutral-300 p-4">
      <div className="mb-4 font-semibold text-black text-sm">
        Specimen
      </div>
      {isEditing ? (
        <div className="mb-6 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded border border-neutral-300 px-3 py-2 font-whisper text-sm outline-none focus:border-black"
          />
          <button
            type="button"
            onClick={handleValidate}
            aria-label="Validate specimen name"
            className="shrink-0 text-green-600 transition-colors hover:text-green-700"
          >
            <RiCheckboxCircleFill size={24} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onDoubleClick={handleDoubleClick}
          className="mb-6 block w-full cursor-pointer rounded px-2 py-1 text-left font-whisper text-sm transition-colors hover:bg-neutral-50"
        >
          {specimenName}
        </button>
      )}

      {/* Format block */}
      <ParameterBlock title="Format">
        <div className="flex flex-col gap-2">
          <CustomSelect
            value={format}
            options={FORMAT_OPTIONS}
            onChange={handleFormatChange}
          />
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <span className="shrink-0 font-whisper text-neutral-600 text-sm">
              Orientation
            </span>
            <div className="flex flex-row items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleOrientationChange("portrait")
                }
                aria-label="Portrait orientation"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                  orientation === "portrait"
                    ? "border-black bg-neutral-100"
                    : "border-neutral-300 hover:border-neutral-400"
                )}
              >
                {orientation === "portrait" ? (
                  <RiFile2Fill className="h-5 w-5 text-black" />
                ) : (
                  <RiFile2Line className="h-5 w-5 text-black" />
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleOrientationChange("landscape")
                }
                aria-label="Landscape orientation"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                  orientation === "landscape"
                    ? "border-black bg-neutral-100"
                    : "border-neutral-300 hover:border-neutral-400"
                )}
              >
                {orientation === "landscape" ? (
                  <RiFile2Fill className="h-5 w-5 rotate-90 text-black" />
                ) : (
                  <RiFile2Line className="h-5 w-5 text-black" />
                )}
              </button>
            </div>
          </div>
        </div>
      </ParameterBlock>

      {/* Pages block */}
      <ParameterBlock title="Pages">
        <div className="flex flex-col gap-2">
          <Reorder.Group
            axis="y"
            values={effectivePages}
            onReorder={handlePagesReorder}
            className="flex flex-col gap-2"
          >
            {effectivePages.map((page) => (
              <Reorder.Item
                key={page.id}
                value={page}
                className="group flex cursor-grab items-center gap-2 rounded-lg border border-neutral-300 bg-white py-2 pr-1 pl-2 transition-shadow active:cursor-grabbing active:shadow-md"
              >
                <RiFile2Line className="h-4 w-4 shrink-0 text-neutral-500" />
                <EditablePageName
                  page={page}
                  onSave={(name) =>
                    handlePageNameSave(page.id, name)
                  }
                />
                {effectivePages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setDeletePageId(page.id)}
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
            onClick={handleAddPage}
            className="w-full rounded-lg border border-neutral-300 border-dashed py-2 font-whisper text-neutral-600 text-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50"
          >
            Add page
          </button>
        </div>
      </ParameterBlock>

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
                onClick={() =>
                  handleDeletePage(deletePageId)
                }
                className="rounded-lg bg-red-600 px-4 py-2 font-medium font-whisper text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
