"use client";

import { useState } from "react";
import { RiAddFill } from "react-icons/ri";
import AddTypefaceModal from "@/components/modals/modal-add-typeface";
import type { AddTypefaceProps } from "@/types/components";

export default function AddTypeface({
  studio,
  onAddTypeface,
}: AddTypefaceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Add Typeface Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="relative flex h-[320px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-neutral-300 transition-colors hover:border-neutral-400"
      >
        <div className="relative font-bold font-ortank text-xl">
          Add typeface
        </div>
        <RiAddFill className="h-8 w-8 text-black" />
      </button>

      {/* Modal */}
      <AddTypefaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studio={studio}
        onAddTypeface={onAddTypeface}
      />
    </>
  );
}
