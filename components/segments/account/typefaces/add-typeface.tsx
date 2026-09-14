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
        className="group relative flex h-[320px] w-full cursor-pointer flex-col items-start justify-between border border-neutral-300 bg-white p-5 text-left transition-colors hover:border-black"
      >
        <RiAddFill className="h-6 w-6 text-neutral-400 transition-colors group-hover:text-swiss-red" />
        <div className="swiss-h2 text-neutral-400 transition-colors group-hover:text-black">
          Add typeface
        </div>
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
