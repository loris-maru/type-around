"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RiEyeLine, RiSaveLine } from "react-icons/ri";
import { useStudio } from "@/hooks/use-studio";
import type { LayoutItem } from "@/types/layout";
import AccountForm from "./form";
import LayoutBuilder from "./studio-page/layout-builder";
import STUDIO_PAGE_FORM_FIELDS from "./studio-page/STUDIO_PAGE_FORM_FIELDS";

export default function AccountStudioPage() {
  const { studio, isLoading, updateStudioPageSettings } =
    useStudio();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (
    values: Record<string, string>
  ) => {
    const gradientFrom = values.gradientFrom;
    const gradientTo = values.gradientTo;

    await updateStudioPageSettings({
      headerFont: values.headerFont,
      gradient:
        gradientFrom && gradientTo
          ? { from: gradientFrom, to: gradientTo }
          : undefined,
    });
  };

  const handleLayoutChange = async (
    layout: LayoutItem[]
  ) => {
    await updateStudioPageSettings({ pageLayout: layout });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStudioPageSettings({
        pageLayout:
          (studio?.pageLayout as LayoutItem[]) || [],
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!studio?.id) return;
    window.open(`/preview/${studio.id}`, "_blank");
  };

  const initialValues = studio
    ? {
        headerFont: studio.headerFont,
        gradientFrom: studio.gradient?.from || "#FFF8E8",
        gradientTo: studio.gradient?.to || "#F2F2F2",
      }
    : undefined;

  return (
    <div className="relative w-full flex flex-col gap-y-10">
      <AccountForm
        title="Design"
        FORM_FIELDS={STUDIO_PAGE_FORM_FIELDS}
        initialValues={initialValues}
        onChange={handleSubmit}
        isLoading={isLoading}
      />

      {studio?.id && (
        <div className="relative w-full flex flex-col gap-y-4">
          <h2 className="text-xl font-ortank font-bold">
            Layout
          </h2>
          <LayoutBuilder
            value={
              (studio.pageLayout as LayoutItem[]) || []
            }
            onChange={handleLayoutChange}
            studioId={studio.id}
          />
        </div>
      )}

      {/* Fixed bottom-right Save & Preview buttons */}
      <AnimatePresence>
        {studio?.id && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center justify-center gap-2 w-40 py-3 bg-white text-black border border-black rounded-lg hover:bg-neutral-100 transition-colors shadow-lg cursor-pointer"
            >
              <RiEyeLine className="w-5 h-5" />
              Preview
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 w-40 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors shadow-lg cursor-pointer"
            >
              <RiSaveLine className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
