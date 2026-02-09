"use client";

import Footer from "@/components/global/footer";
import StudioHeader from "@/components/segments/studio/header";
import { DEFAULT_PAGE_LAYOUT } from "@/constant/DEFAULT_PAGE_LAYOUT";
import { useStudio } from "@/hooks/use-studio";
import type { LayoutItem } from "@/types/layout";
import PreviewBlockRenderer from "./block-renderer";

export default function StudioPreview() {
  const { studio, isLoading } = useStudio();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-whisper text-neutral-500">
          Loading preview…
        </p>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-whisper text-neutral-500">
          Studio not found.
        </p>
      </div>
    );
  }

  const storedLayout = studio.pageLayout as LayoutItem[];
  const blocks = storedLayout?.length
    ? storedLayout
    : DEFAULT_PAGE_LAYOUT;

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <StudioHeader
        gradient={[
          studio.gradient?.from || "#FFF8E8",
          studio.gradient?.to || "#F2F2F2",
        ]}
      />
      <div className="flex-1">
        {blocks.map((block) => (
          <PreviewBlockRenderer
            key={block.key}
            block={block}
            studio={studio}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}
