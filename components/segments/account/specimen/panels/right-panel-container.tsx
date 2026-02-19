"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import type { PageSettingPanelProps } from "@/types/specimen";
import CellSettingPanel from "./cell-setting-panel";
import PageSettingPanel from "./page-setting-panel";

const PANEL_WIDTH = 300;

export default function RightPanelContainer({
  specimenId,
  studioId,
  typefaceSlug,
}: PageSettingPanelProps) {
  const { selectedCell } = useSpecimenPage();

  return (
    <div className="relative z-20 mr-10 flex h-full min-h-0 shrink-0 overflow-hidden">
      <div
        className="relative flex h-full"
        style={{ width: PANEL_WIDTH }}
      >
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          {selectedCell ? (
            <motion.div
              key="cell-panel"
              initial={{ x: PANEL_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -PANEL_WIDTH }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-y-0 left-0"
              style={{ width: PANEL_WIDTH }}
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
              initial={{ x: -PANEL_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: PANEL_WIDTH }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-y-0 left-0"
              style={{ width: PANEL_WIDTH }}
            >
              <PageSettingPanel
                specimenId={specimenId}
                studioId={studioId}
                typefaceSlug={typefaceSlug}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
