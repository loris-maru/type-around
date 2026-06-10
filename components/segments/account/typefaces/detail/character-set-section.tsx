"use client";

import { useId, useRef, useState } from "react";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiPencilLine,
} from "react-icons/ri";
import type { GlyphCollection } from "@/types/studio";

function generateId() {
  return `col-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

type Props = {
  glyphCollections: GlyphCollection[];
  onGlyphCollectionsChange: (
    collections: GlyphCollection[]
  ) => void;
};

function GlyphCell({
  glyph,
  onRemove,
}: {
  glyph: string;
  onRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover state wrapper
    <div
      className="relative flex h-14 w-14 cursor-default items-center justify-center rounded-lg border border-neutral-200 bg-white text-xl transition-colors hover:border-neutral-400"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="select-none">{glyph}</span>
      {hovered && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove glyph ${glyph}`}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-50 transition-colors hover:bg-red-100"
        >
          <RiDeleteBinLine className="h-4 w-4 text-red-500" />
        </button>
      )}
    </div>
  );
}

export default function CharacterSetSection({
  glyphCollections,
  onGlyphCollectionsChange,
}: Props) {
  const inputId = useId();
  const nameInputId = useId();
  const [activeId, setActiveId] = useState<string>(
    glyphCollections[0]?.id ?? ""
  );
  const [inputValue, setInputValue] = useState("");
  const [editingCollectionId, setEditingCollectionId] =
    useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const activeCollection =
    glyphCollections.find((c) => c.id === activeId) ??
    glyphCollections[0];

  const updateCollection = (
    id: string,
    patch: Partial<GlyphCollection>
  ) => {
    onGlyphCollectionsChange(
      glyphCollections.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      )
    );
  };

  const handleAddGlyphs = () => {
    if (!inputValue.trim() || !activeCollection) return;
    const incoming = inputValue
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
    const existing = new Set(activeCollection.glyphs);
    const merged = [
      ...activeCollection.glyphs,
      ...incoming.filter((g) => !existing.has(g)),
    ];
    updateCollection(activeCollection.id, {
      glyphs: merged,
    });
    setInputValue("");
  };

  const handleRemoveGlyph = (glyph: string) => {
    if (!activeCollection) return;
    updateCollection(activeCollection.id, {
      glyphs: activeCollection.glyphs.filter(
        (g) => g !== glyph
      ),
    });
  };

  const handleAddCollection = () => {
    const newCol: GlyphCollection = {
      id: generateId(),
      name: "New collection",
      glyphs: [],
    };
    onGlyphCollectionsChange([...glyphCollections, newCol]);
    setActiveId(newCol.id);
    setEditingCollectionId(newCol.id);
    setEditingName(newCol.name);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const handleDeleteCollection = (id: string) => {
    const updated = glyphCollections.filter(
      (c) => c.id !== id
    );
    onGlyphCollectionsChange(updated);
    if (activeId === id) {
      setActiveId(updated[0]?.id ?? "");
    }
  };

  const startEditingName = (
    col: GlyphCollection,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingCollectionId(col.id);
    setEditingName(col.name);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  const commitNameEdit = () => {
    if (editingCollectionId && editingName.trim()) {
      updateCollection(editingCollectionId, {
        name: editingName.trim(),
      });
    }
    setEditingCollectionId(null);
  };

  return (
    <div className="flex flex-col gap-y-4">
      {/* Collection tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {glyphCollections.map((col) => (
          <div
            key={col.id}
            className="group relative flex items-center"
          >
            {editingCollectionId === col.id ? (
              <input
                ref={nameInputRef}
                id={nameInputId}
                type="text"
                value={editingName}
                onChange={(e) =>
                  setEditingName(e.target.value)
                }
                onBlur={commitNameEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitNameEdit();
                  if (e.key === "Escape") {
                    setEditingCollectionId(null);
                  }
                }}
                className="rounded-full border border-black bg-black px-4 py-1.5 font-whisper text-sm text-white outline-none"
                style={{
                  width: `${Math.max(editingName.length + 2, 10)}ch`,
                }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setActiveId(col.id)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-whisper text-sm transition-colors ${
                  activeId === col.id
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50"
                }`}
              >
                {col.name || "Untitled"}
                {activeId === col.id && (
                  <>
                    <button
                      type="button"
                      onClick={(e) =>
                        startEditingName(col, e)
                      }
                      aria-label="Rename collection"
                      className="rounded p-0.5 transition-colors hover:bg-white/20"
                    >
                      <RiPencilLine className="h-3 w-3" />
                    </button>
                    {glyphCollections.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCollection(col.id);
                        }}
                        aria-label="Delete collection"
                        className="rounded p-0.5 transition-colors hover:bg-white/20"
                      >
                        <RiDeleteBinLine className="h-3 w-3" />
                      </button>
                    )}
                  </>
                )}
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddCollection}
          aria-label="Add collection"
          className="flex items-center gap-1 rounded-full border border-dashed border-neutral-300 px-3 py-1.5 font-whisper text-neutral-500 text-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50"
        >
          <RiAddLine className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* Add glyphs input */}
      {activeCollection ? (
        <>
          <div className="flex gap-2">
            <input
              id={inputId}
              type="text"
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddGlyphs();
                }
              }}
              placeholder="Paste glyphs comma-separated, e.g. A, B, C, 가, 나, 다…"
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2.5 font-whisper text-sm focus:border-black focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddGlyphs}
              disabled={!inputValue.trim()}
              className="rounded-lg bg-black px-4 py-2.5 font-whisper text-sm text-white transition-opacity disabled:opacity-40"
            >
              Add
            </button>
          </div>

          {/* Glyph grid */}
          {activeCollection.glyphs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeCollection.glyphs.map((glyph) => (
                <GlyphCell
                  key={glyph}
                  glyph={glyph}
                  onRemove={() => handleRemoveGlyph(glyph)}
                />
              ))}
            </div>
          ) : (
            <p className="font-whisper text-neutral-400 text-sm">
              No glyphs yet. Paste some above and press
              Enter.
            </p>
          )}
        </>
      ) : (
        <p className="font-whisper text-neutral-400 text-sm">
          Create a collection to start adding glyphs.
        </p>
      )}
    </div>
  );
}
