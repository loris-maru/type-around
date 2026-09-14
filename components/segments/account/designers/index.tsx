"use client";

import { useCallback, useMemo, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import AddDesignerModal from "@/components/modals/modal-add-designer";
import { DesignerCard } from "@/components/molecules/cards";
import { useStudio } from "@/hooks/use-studio";
import type { Designer } from "@/types/studio";
import AccountPageHeader from "../page-header";

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
      <AccountPageHeader
        eyebrow="Designers"
        title="Designers"
      />

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
          className="group flex min-h-[200px] cursor-pointer flex-col items-start justify-between border border-neutral-300 p-5 text-left transition-colors hover:border-black"
        >
          <RiAddFill className="h-6 w-6 text-neutral-400 transition-colors group-hover:text-swiss-red" />
          <span className="swiss-label text-neutral-500 transition-colors group-hover:text-black">
            Add designer
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
