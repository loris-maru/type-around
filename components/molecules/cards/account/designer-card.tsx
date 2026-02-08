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
      className="relative flex flex-col p-4 justify-between border border-black bg-white shadow-button transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover rounded-lg cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden bg-neutral-100 shrink-0">
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
            <RiUserLine className="w-7 h-7 text-neutral-300" />
          </div>
        )}
      </div>

      <div>
        {/* Name */}
        <h3 className="font-ortank text-lg font-bold mb-0.5">
          {fullName}
        </h3>

        {/* Email */}
        {designer.email && (
          <p className="text-sm text-neutral-500 mb-1 truncate">
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
        className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
        title="Remove designer"
      >
        <RiDeleteBinLine className="w-5 h-5" />
      </button>
    </div>
  );
}
