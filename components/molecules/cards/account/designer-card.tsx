"use client";

import Image from "next/image";
import {
  RiDeleteBinLine,
  RiUserLine,
} from "react-icons/ri";
import type { DesignerCardProps } from "@/types/components";

export default function DesignerCard({
  designer,
  onEdit,
  onRemove,
}: DesignerCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if ((e.target as HTMLElement).closest("a")) return;
    onEdit(designer);
  };

  const fullName =
    `${designer.firstName} ${designer.lastName}`.trim();

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: card click to edit
    // biome-ignore lint/a11y/useKeyWithClickEvents: card click to edit
    <div
      onClick={handleCardClick}
      className="relative flex cursor-pointer flex-col justify-between rounded-lg border border-black bg-white p-4 shadow-button transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover"
    >
      {/* Avatar */}
      <div className="relative mb-3 h-24 w-24 shrink-0 overflow-hidden rounded-full bg-neutral-100">
        {designer.avatar ? (
          <Image
            src={designer.avatar}
            alt={fullName}
            fill
            className="object-cover"
            unoptimized={
              designer.avatar.startsWith("data:") ||
              designer.avatar.includes("firebasestorage")
            }
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <RiUserLine className="h-7 w-7 text-neutral-300" />
          </div>
        )}
      </div>

      <div>
        {/* Name */}
        <h3 className="mb-0.5 font-bold font-ortank text-lg">
          {fullName}
        </h3>

        {/* Email */}
        {designer.email && (
          <p className="mb-1 truncate text-neutral-500 text-sm">
            {designer.email}
          </p>
        )}
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (designer.id) onRemove(designer.id);
        }}
        className="absolute top-2 right-2 cursor-pointer p-2 text-neutral-400 transition-colors hover:text-red-500"
        title="Remove designer"
        aria-label="Remove designer"
      >
        <RiDeleteBinLine className="h-5 w-5" />
      </button>
    </div>
  );
}
