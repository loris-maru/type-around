"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  SPECIMEN_PANEL_WIDTH,
  SPECIMEN_TEMPLATE_PICKER_WIDTH,
} from "@/constant/UI_LAYOUT";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import { useStudio } from "@/hooks/use-studio";
import type { PageSettingPanelProps } from "@/types/specimen";
import CellSettingPanel from "./cell-setting-panel";
import PageSettingPanel from "./page-setting-panel";
import TemplatePickerPanel from "./template-picker-panel";

export default function RightPanelContainer({
  specimenId,
  studioId,
  typefaceSlug,
}: PageSettingPanelProps) {
  const {
    selectedCell,
    selectedPageId,
    isTemplatePickerOpen,
  } = useSpecimenPage();
  const { studio } = useStudio();

  const specimen = studio?.specimens?.find(
    (s) => s.id === specimenId
  );
  const pages = specimen?.pages ?? [];
  const selectedPage = selectedPageId
    ? pages.find((p) => p.id === selectedPageId)
    : pages[0];
  const showTemplatePicker =
    !selectedCell &&
    isTemplatePickerOpen &&
    selectedPage &&
    selectedPage.id !== "placeholder";

  const containerWidth = showTemplatePicker
    ? SPECIMEN_PANEL_WIDTH + SPECIMEN_TEMPLATE_PICKER_WIDTH
    : SPECIMEN_PANEL_WIDTH;

  return (
    <div className="relative z-20 mr-10 flex h-full min-h-0 shrink-0 overflow-hidden">
      <motion.div
        className="relative flex h-full flex-row"
        animate={{ width: containerWidth }}
        initial={false}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <AnimatePresence>
          {showTemplatePicker && selectedPage && (
            <TemplatePickerPanel
              key="template-picker"
              specimenId={specimenId}
              pageId={selectedPage.id}
              pageName={selectedPage.name}
            />
          )}
        </AnimatePresence>
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          {selectedCell ? (
            <motion.div
              key="cell-panel"
              initial={{ x: SPECIMEN_PANEL_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -SPECIMEN_PANEL_WIDTH }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-y-0 right-0 shrink-0"
              style={{ width: SPECIMEN_PANEL_WIDTH }}
            >
              <CellSettingPanel
                specimenId={specimenId}
                studioId={studioId}
                typefaceSlug={typefaceSlug}
                pageId={selectedCell.pageId}
                cellIndex={selectedCell.cellIndex}
              />
            </motion.div>
          ) : (
            <motion.div
              key="page-panel"
              initial={{ x: -SPECIMEN_PANEL_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: SPECIMEN_PANEL_WIDTH }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-y-0 right-0 shrink-0"
              style={{ width: SPECIMEN_PANEL_WIDTH }}
            >
              <PageSettingPanel
                specimenId={specimenId}
                studioId={studioId}
                typefaceSlug={typefaceSlug}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
