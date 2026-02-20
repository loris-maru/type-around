"use client";

import { RiCloseFill } from "react-icons/ri";
import { motion } from "motion/react";
import {
  getTemplateGradient,
  SPECIMEN_TEMPLATES,
} from "@/constant/specimen-templates";
import { templateToPageFields } from "@/constant/specimen-templates/apply-template";
import type { SpecimenTemplate } from "@/constant/specimen-templates/schema";
import { SPECIMEN_TEMPLATE_PICKER_WIDTH } from "@/constant/UI_LAYOUT";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import { useStudio } from "@/hooks/use-studio";
import type { SpecimenPage } from "@/types/studio";

type TemplatePickerPanelProps = {
  specimenId: string;
  pageId: string;
  pageName: string;
};

export default function TemplatePickerPanel({
  specimenId,
  pageId,
  pageName,
}: TemplatePickerPanelProps) {
  const { setTemplatePickerOpen } = useSpecimenPage();
  const { studio, updateSpecimen } = useStudio();

  const handleSelectTemplate = (
    template: SpecimenTemplate
  ) => {
    const specimen = studio?.specimens?.find(
      (s) => s.id === specimenId
    );
    const pages = specimen?.pages ?? [];
    const pageIndex = pages.findIndex(
      (p) => p.id === pageId
    );
    if (pageIndex < 0) return;

    const pageFields = templateToPageFields(
      template,
      pageId,
      pageName
    );
    const updatedPages: SpecimenPage[] = pages.map(
      (p, i) =>
        i === pageIndex ? { ...p, ...pageFields } : p
    );
    updateSpecimen(specimenId, { pages: updatedPages });
    setTemplatePickerOpen(false);
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{
        width: SPECIMEN_TEMPLATE_PICKER_WIDTH,
        opacity: 1,
      }}
      exit={{ width: 0, opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="flex shrink-0 flex-col overflow-hidden rounded-l-lg border border-neutral-300 border-r-0 bg-white"
    >
      <div className="flex items-center justify-between gap-2 border-neutral-200 border-b p-4">
        <h3 className="font-bold font-whisper text-neutral-800 text-sm">
          Choose template
        </h3>
        <button
          type="button"
          onClick={() => setTemplatePickerOpen(false)}
          className="rounded p-1 transition-colors hover:bg-neutral-100"
          aria-label="Close template panel"
        >
          <RiCloseFill className="h-5 w-5 text-neutral-600" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {SPECIMEN_TEMPLATES.map((template) => (
            <TemplateCard
              key={template.title}
              template={template}
              gradient={getTemplateGradient(template.title)}
              onSelect={() =>
                handleSelectTemplate(template)
              }
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TemplateCard({
  template,
  gradient,
  onSelect,
}: {
  template: SpecimenTemplate;
  gradient: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3 text-left transition-colors hover:border-neutral-300 hover:bg-neutral-50"
      aria-label={`Apply template: ${template.title}`}
    >
      <div
        className="h-12 w-12 shrink-0 rounded-full"
        style={{ background: gradient }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium font-whisper text-neutral-800 text-sm">
          {template.title}
        </div>
        <div className="font-whisper text-neutral-500 text-xs">
          {template.grid.columns} × {template.grid.rows}
        </div>
      </div>
    </button>
  );
}
