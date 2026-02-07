"use client";

import { useCallback, useMemo, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { FontInUseCard } from "@/components/molecules/cards/account";
import { useStudio } from "@/hooks/use-studio";
import type { FontInUse } from "@/types/studio";
import AddFontInUseModal from "./fonts-in-use/add-font-in-use-modal";

export default function AccountFontsInUse() {
  const { studio, updateStudio } = useStudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFontInUse, setEditingFontInUse] =
    useState<FontInUse | null>(null);

  const fontsInUse = useMemo(
    () => studio?.fontsInUse || [],
    [studio?.fontsInUse]
  );
  const typefaces = useMemo(
    () => studio?.typefaces || [],
    [studio?.typefaces]
  );

  const handleSave = useCallback(
    async (fontInUse: FontInUse) => {
      if (!studio) return;

      const existingIndex = fontsInUse.findIndex(
        (f) => f.id === fontInUse.id
      );

      let updatedFontsInUse: FontInUse[];
      if (existingIndex >= 0) {
        updatedFontsInUse = [...fontsInUse];
        updatedFontsInUse[existingIndex] = fontInUse;
      } else {
        updatedFontsInUse = [...fontsInUse, fontInUse];
      }

      await updateStudio({ fontsInUse: updatedFontsInUse });
    },
    [studio, fontsInUse, updateStudio]
  );

  const handleEdit = useCallback((fontInUse: FontInUse) => {
    setEditingFontInUse(fontInUse);
    setIsModalOpen(true);
  }, []);

  const handleRemove = useCallback(
    async (id: string) => {
      if (!studio) return;
      const updatedFontsInUse = fontsInUse.filter(
        (f) => f.id !== id
      );
      await updateStudio({ fontsInUse: updatedFontsInUse });
    },
    [studio, fontsInUse, updateStudio]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingFontInUse(null);
  }, []);

  return (
    <div className="relative w-full">
      <h1 className="font-ortank text-3xl font-bold mb-8">
        Fonts In Use
      </h1>

      <div className="grid grid-cols-4 gap-4">
        {fontsInUse.map((fontInUse) => (
          <FontInUseCard
            key={fontInUse.id}
            fontInUse={fontInUse}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        ))}

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-black hover:bg-neutral-50 transition-all duration-300 ease-in-out min-h-[200px]"
        >
          <RiAddFill className="w-8 h-8 text-neutral-400" />
          <span className="text-neutral-500 font-medium">
            Add Font In Use
          </span>
        </button>
      </div>

      <AddFontInUseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingFontInUse={editingFontInUse}
        typefaces={typefaces}
        studioId={studio?.id || ""}
      />
    </div>
  );
}
