"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiAddFill,
  RiArrowDropDownLine,
  RiCloseLine,
} from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import {
  InputDate,
  InputNumber,
  InputText,
  InputTextarea,
} from "@/components/global/inputs";
import TagInput from "@/components/global/tag-input";
import type { BasicInformationSectionProps } from "@/types/components";
import TypefaceVisionBlock from "./typeface-vision-block";

export default function BasicInformationSection({
  name,
  hangeulName,
  categories,
  characters,
  releaseDate,
  description,
  supportedLanguages,
  typefaceVision,
  designerIds,
  studioDesigners,
  onInputChange,
  onCategoriesChange,
  onLanguagesChange,
  onTypefaceVisionChange,
  onDesignerIdsChange,
}: BasicInformationSectionProps) {
  const [
    isDesignerDropdownOpen,
    setIsDesignerDropdownOpen,
  ] = useState(false);
  const designerDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        designerDropdownRef.current &&
        !designerDropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsDesignerDropdownOpen(false);
      }
    };
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleAddDesigner = (designerId: string) => {
    if (!designerId || designerIds.includes(designerId))
      return;
    onDesignerIdsChange([...designerIds, designerId]);
    setIsDesignerDropdownOpen(false);
  };

  const handleRemoveDesigner = (designerId: string) => {
    onDesignerIdsChange(
      designerIds.filter((id) => id !== designerId)
    );
  };

  const availableDesigners = studioDesigners.filter(
    (d) => !designerIds.includes(d.id || "")
  );

  const selectedDesigners = designerIds
    .map((id) => studioDesigners.find((d) => d.id === id))
    .filter(Boolean);

  return (
    <CollapsibleSection
      id="information"
      title="Information"
    >
      <div className="flex flex-col gap-y-8">
        <div className="grid grid-cols-2 gap-4">
          <InputText
            label="Latin Name"
            name="name"
            value={name}
            onChange={onInputChange}
            required
          />
          <InputText
            label="Hangeul Name"
            name="hangeulName"
            value={hangeulName}
            onChange={onInputChange}
          />
        </div>

        <TagInput
          label="Categories"
          value={categories}
          onChange={onCategoriesChange}
          placeholder="Type a category and press Enter..."
        />

        <div className="grid grid-cols-2 gap-4">
          <InputNumber
            label="Characters"
            name="characters"
            value={characters}
            onChange={onInputChange}
            min={0}
          />
          <InputDate
            label="Release Date"
            name="releaseDate"
            value={releaseDate}
            onChange={onInputChange}
          />
        </div>

        <InputTextarea
          label="Description"
          name="description"
          value={description}
          onChange={onInputChange}
          rows={4}
        />

        <TagInput
          label="Supported Languages"
          value={supportedLanguages}
          onChange={onLanguagesChange}
          placeholder="Type a language and press Enter..."
          theme="light"
        />

        <TypefaceVisionBlock
          usage={typefaceVision.usage}
          contrast={typefaceVision.contrast}
          width={typefaceVision.width}
          playful={typefaceVision.playful}
          frame={typefaceVision.frame}
          serif={typefaceVision.serif}
          onUsageChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              usage: v,
            })
          }
          onContrastChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              contrast: v,
            })
          }
          onWidthChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              width: v,
            })
          }
          onPlayfulChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              playful: v,
            })
          }
          onFrameChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              frame: v,
            })
          }
          onSerifChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              serif: v,
            })
          }
        />

        {/* Designers */}
        <div>
          <span className="mb-2 block font-normal font-whisper text-black text-sm">
            Designers
          </span>

          {/* Selected designers */}
          {selectedDesigners.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedDesigners.map((designer) => (
                <span
                  key={designer?.id}
                  className="inline-flex items-center gap-2 rounded-3xl border border-black bg-transparent px-4 py-2 text-black text-sm"
                >
                  {designer?.firstName} {designer?.lastName}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveDesigner(
                        designer?.id || ""
                      )
                    }
                    aria-label={`Remove designer ${designer?.firstName} ${designer?.lastName}`}
                    className="cursor-pointer rounded p-0.5 transition-colors hover:bg-neutral-100"
                  >
                    <RiCloseLine className="h-3.5 w-3.5 text-neutral-400 hover:text-black" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Dropdown to add */}
          {availableDesigners.length > 0 ? (
            <div
              ref={designerDropdownRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setIsDesignerDropdownOpen((prev) => !prev)
                }
                className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-3 font-whisper text-neutral-500 text-sm transition-colors hover:border-neutral-400"
              >
                <span className="flex items-center gap-2">
                  <RiAddFill className="h-4 w-4" />
                  Add a designer...
                </span>
                <RiArrowDropDownLine
                  className={`h-5 w-5 transition-transform ${isDesignerDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDesignerDropdownOpen && (
                <div className="absolute right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
                  {availableDesigners.map((designer) => (
                    <button
                      key={designer.id}
                      type="button"
                      onClick={() =>
                        handleAddDesigner(designer.id || "")
                      }
                      className="w-full cursor-pointer px-4 py-2.5 text-left font-whisper text-neutral-700 text-sm transition-colors hover:bg-neutral-50"
                    >
                      {designer.firstName}{" "}
                      {designer.lastName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : studioDesigners.length === 0 ? (
            <p className="text-neutral-500 text-xs">
              No designers in your studio yet. Add designers
              from the Designers section.
            </p>
          ) : (
            <p className="text-neutral-500 text-xs">
              All studio designers are assigned.
            </p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
