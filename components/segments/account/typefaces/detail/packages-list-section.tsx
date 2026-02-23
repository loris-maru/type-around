"use client";

import CollapsibleSection from "@/components/global/collapsible-section";
import { ButtonAddPackage } from "@/components/molecules/buttons";
import { PackageCard } from "@/components/molecules/cards";
import type { PackagesListSectionProps } from "@/types/components";

export default function PackagesListSection({
  packages,
  fonts,
  onAddPackageClick,
  onEditPackageClick,
  onRemovePackage,
}: PackagesListSectionProps) {
  return (
    <CollapsibleSection
      title="Packages"
      count={packages.length}
      countLabel="packages"
    >
      <div className="grid grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            fonts={fonts}
            onEdit={() => onEditPackageClick(pkg)}
            onRemove={() => onRemovePackage(pkg.id)}
          />
        ))}

        <ButtonAddPackage onClick={onAddPackageClick} />
      </div>
    </CollapsibleSection>
  );
}
