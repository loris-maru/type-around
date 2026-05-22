"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiAddFill,
  RiArrowDropDownLine,
  RiCloseLine,
} from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import type { DesignersSectionProps } from "@/types/components";

export default function DesignersSection({
  designerIds,
  studioDesigners,
  onDesignerIdsChange,
  backgroundColor,
}: DesignersSectionProps) {
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
    <CollapsibleSection title="Designers">
      <div className="flex flex-col gap-y-4">
        {selectedDesigners.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedDesigners.map((designer) => (
              <span
                key={designer?.id}
                className="inline-flex items-center gap-2 rounded-3xl border border-black bg-transparent px-4 py-2 text-black text-sm"
              >
                {designer?.firstName} {designer?.lastName}
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveDesigner(designer?.id || "")
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
              <div
                className="absolute right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-neutral-200 shadow-lg"
                style={{
                  backgroundColor:
                    backgroundColor ?? "transparent",
                }}
              >
                {availableDesigners.map((designer) => (
                  <button
                    key={designer.id}
                    type="button"
                    onClick={() =>
                      handleAddDesigner(designer.id || "")
                    }
                    className="w-full cursor-pointer px-4 py-2.5 text-left font-whisper text-neutral-700 text-sm transition-colors hover:bg-neutral-50"
                  >
                    {designer.firstName} {designer.lastName}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (studioDesigners ?? []).length === 0 ? (
          <p className="text-neutral-500 text-xs">
            No designers in your studio yet. Add designers
            from the Members section.
          </p>
        ) : (
          <p className="text-neutral-500 text-xs">
            All studio designers are assigned.
          </p>
        )}
      </div>
    </CollapsibleSection>
  );
}
