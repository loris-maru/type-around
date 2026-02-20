"use client";

import { useCallback, useMemo, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { DesignerCard } from "@/components/molecules/cards";
import { useStudio } from "@/hooks/use-studio";
import type { Designer } from "@/types/studio";
import AddDesignerModal from "./add-designer-modal";

export default function AccountDesigners() {
  const { studio, updateStudio } = useStudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesigner, setEditingDesigner] =
    useState<Designer | null>(null);

  const designers = useMemo(
    () => studio?.designers || [],
    [studio?.designers]
  );

  const handleSave = useCallback(
    async (designer: Designer) => {
      if (!studio) return;

      const existingIndex = designers.findIndex(
        (d) => d.id === designer.id
      );

      let updatedDesigners: Designer[];
      if (existingIndex >= 0) {
        updatedDesigners = [...designers];
        updatedDesigners[existingIndex] = designer;
      } else {
        updatedDesigners = [...designers, designer];
      }

      await updateStudio({ designers: updatedDesigners });
    },
    [studio, designers, updateStudio]
  );

  const handleEdit = useCallback((designer: Designer) => {
    setEditingDesigner(designer);
    setIsModalOpen(true);
  }, []);

  const handleRemove = useCallback(
    async (id: string) => {
      if (!studio) return;
      const updatedDesigners = designers.filter(
        (d) => d.id !== id
      );
      await updateStudio({ designers: updatedDesigners });
    },
    [studio, designers, updateStudio]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingDesigner(null);
  }, []);

  return (
    <div className="relative w-full">
      <h1 className="font-ortank text-3xl font-bold mb-8">
        Designers
      </h1>

      <div className="grid grid-cols-4 gap-4">
        {designers.map((designer) => (
          <DesignerCard
            key={designer.id}
            designer={designer}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        ))}

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-black hover:bg-neutral-50 transition-all duration-300 ease-in-out min-h-[200px] cursor-pointer"
        >
          <RiAddFill className="w-8 h-8 text-neutral-400" />
          <span className="text-neutral-500 font-medium">
            Add Designer
          </span>
        </button>
      </div>

      <AddDesignerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingDesigner={editingDesigner}
        studioId={studio?.id || ""}
      />
    </div>
  );
}
