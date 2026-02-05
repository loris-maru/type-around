"use client";

import { useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { Studio, StudioTypeface } from "@/types/studio";
import AddTypefaceModal from "./add-typeface-modal";

export type AddTypefaceProps = {
  studio: Studio | null;
  onAddTypeface: (
    typeface: StudioTypeface
  ) => Promise<void>;
};

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
        className="relative w-full h-[320px] border border-neutral-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors"
      >
        <div className="relative font-ortank text-xl font-bold">
          Add typeface
        </div>
        <RiAddFill className="w-8 h-8 text-black" />
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
