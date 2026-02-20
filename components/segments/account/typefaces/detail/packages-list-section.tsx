"use client";

import { RiAddFill } from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import type { PackagesListSectionProps } from "@/types/components";
import type { Font, Package } from "@/types/studio";

function PackageCard({
  pkg,
  fonts,
  onEdit,
  onRemove,
}: {
  pkg: Package;
  fonts: Font[];
  onEdit: () => void;
  onRemove: () => void;
}) {
  const packageFonts = fonts.filter((f) =>
    pkg.fontIds.includes(f.id)
  );

  return (
    <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-2 font-bold font-ortank text-base">
        {pkg.name}
      </div>
      {pkg.description && (
        <p className="mb-3 font-whisper text-neutral-600 text-sm line-clamp-2">
          {pkg.description}
        </p>
      )}
      <div className="mb-3 flex flex-wrap gap-1">
        {packageFonts.map((f) => (
          <span
            key={f.id}
            className="rounded bg-neutral-100 px-2 py-0.5 font-whisper text-xs"
          >
            {f.styleName}
          </span>
        ))}
        {packageFonts.length === 0 && (
          <span className="font-whisper text-neutral-400 text-xs">
            No fonts
          </span>
        )}
      </div>
      <div className="mt-auto flex flex-wrap gap-3 font-whisper text-neutral-500 text-xs">
        {pkg.printPrice && (
          <span>
            Print{" "}
            {pkg.printPriceAmount
              ? `₩${Number(pkg.printPriceAmount).toLocaleString()}`
              : ""}
          </span>
        )}
        {pkg.webPrice && (
          <span>
            Web{" "}
            {pkg.webPriceAmount
              ? `₩${Number(pkg.webPriceAmount).toLocaleString()}`
              : ""}
          </span>
        )}
        {pkg.appPrice && (
          <span>
            App{" "}
            {pkg.appPriceAmount
              ? `₩${Number(pkg.appPriceAmount).toLocaleString()}`
              : ""}
          </span>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded border border-neutral-300 px-3 py-1.5 font-whisper text-sm hover:bg-neutral-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded border border-red-200 px-3 py-1.5 font-whisper text-red-600 text-sm hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function PackagesListSection({
  packages,
  fonts,
  onAddPackageClick,
  onEditPackageClick,
  onRemovePackage,
}: PackagesListSectionProps) {
  return (
    <CollapsibleSection
      id="packages"
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

        {/* Add Package Button */}
        <button
          type="button"
          onClick={onAddPackageClick}
          aria-label="Add package"
          className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 border-dashed p-4 transition-all duration-300 ease-in-out hover:border-black hover:bg-neutral-50"
        >
          <RiAddFill className="h-8 w-8 text-neutral-400" />
          <span className="font-medium text-neutral-500">
            Add package
          </span>
        </button>
      </div>
    </CollapsibleSection>
  );
}
