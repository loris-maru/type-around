"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiAddFill,
  RiArrowDropDownLine,
  RiCloseLine,
} from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import FormInput from "@/components/global/form-input";
import FormTextarea from "@/components/global/form-textarea";
import TagInput from "@/components/global/tag-input";
import type { BasicInformationSectionProps } from "@/types/components";

export default function BasicInformationSection({
  name,
  hangeulName,
  categories,
  characters,
  releaseDate,
  description,
  supportedLanguages,
  designerIds,
  studioDesigners,
  fontLineText,
  onInputChange,
  onCategoriesChange,
  onLanguagesChange,
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
          <FormInput
            label="Latin Name"
            name="name"
            value={name}
            onChange={onInputChange}
            required
          />
          <FormInput
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
          <FormInput
            label="Characters"
            name="characters"
            type="number"
            value={characters}
            onChange={onInputChange}
            min={0}
          />
          <FormInput
            label="Release Date"
            name="releaseDate"
            type="date"
            value={releaseDate}
            onChange={onInputChange}
          />
        </div>

        <FormTextarea
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

        {/* Designers */}
        <div>
          <span className="block font-whisper text-sm font-normal text-black mb-2">
            Designers
          </span>

          {/* Selected designers */}
          {selectedDesigners.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedDesigners.map((designer) => (
                <span
                  key={designer?.id}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-3xl bg-transparent text-black border border-black"
                >
                  {designer?.firstName} {designer?.lastName}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveDesigner(
                        designer?.id || ""
                      )
                    }
                    className="p-0.5 rounded transition-colors hover:bg-neutral-100 cursor-pointer"
                  >
                    <RiCloseLine className="w-3.5 h-3.5 text-neutral-400 hover:text-black" />
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
                className="w-full flex items-center justify-between px-4 py-3 border border-neutral-300 rounded-lg bg-white text-sm font-whisper text-neutral-500 hover:border-neutral-400 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RiAddFill className="w-4 h-4" />
                  Add a designer...
                </span>
                <RiArrowDropDownLine
                  className={`w-5 h-5 transition-transform ${isDesignerDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDesignerDropdownOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
                  {availableDesigners.map((designer) => (
                    <button
                      key={designer.id}
                      type="button"
                      onClick={() =>
                        handleAddDesigner(designer.id || "")
                      }
                      className="w-full px-4 py-2.5 text-left text-sm font-whisper text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      {designer.firstName}{" "}
                      {designer.lastName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : studioDesigners.length === 0 ? (
            <p className="text-xs text-neutral-500">
              No designers in your studio yet. Add designers
              from the Designers section.
            </p>
          ) : (
            <p className="text-xs text-neutral-500">
              All studio designers are assigned.
            </p>
          )}
        </div>

        {/* Font line text */}
        <div>
          <label
            htmlFor="fontLineText"
            className="block font-whisper text-sm font-normal text-black"
          >
            Font line text
          </label>
          <p className="text-xs text-neutral-400 mb-2">
            This is the text that will be used when showing
            your typeface or its fonts
          </p>
          <input
            type="text"
            id="fontLineText"
            name="fontLineText"
            value={fontLineText}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="e.g., The quick brown fox jumps over the lazy dog"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
