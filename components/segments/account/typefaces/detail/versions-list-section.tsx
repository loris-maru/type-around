"use client";

import { RiAddFill } from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import { VersionCard } from "@/components/molecules/cards";
import type { VersionsListSectionProps } from "@/types/components";

export default function VersionsListSection({
  versions,
  onAddVersionClick,
  onEditVersion,
  onRemoveVersion,
}: VersionsListSectionProps) {
  return (
    <CollapsibleSection
      id="versions"
      title="Versions"
      count={versions.length}
      countLabel="versions"
    >
      <div className="grid grid-cols-4 gap-4">
        {versions.map((version, index) => (
          <VersionCard
            key={version.id}
            version={version}
            canDelete={index > 0}
            onRemove={onRemoveVersion}
            onEdit={onEditVersion}
          />
        ))}

        {/* Add Version Button */}
        <button
          type="button"
          onClick={onAddVersionClick}
          aria-label="Add a version"
          className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 border-dashed p-4 transition-all duration-300 ease-in-out hover:border-black hover:bg-neutral-50"
        >
          <RiAddFill className="h-8 w-8 text-neutral-400" />
          <span className="font-medium text-neutral-500">
            Add Version
          </span>
        </button>
      </div>
    </CollapsibleSection>
  );
}
