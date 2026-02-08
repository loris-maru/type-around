"use client";

import Footer from "@/components/global/footer";
import StudioHeader from "@/components/segments/studio/header";
import { useStudio } from "@/hooks/use-studio";
import type { LayoutItem } from "@/types/layout";
import PreviewBlockRenderer from "./block-renderer";

export default function StudioPreview() {
  const { studio, isLoading } = useStudio();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-500 font-whisper">
          Loading preview…
        </p>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-500 font-whisper">
          Studio not found.
        </p>
      </div>
    );
  }

  const blocks = (studio.pageLayout as LayoutItem[]) || [];

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <StudioHeader
        gradient={[
          studio.gradient?.from || "#FFF8E8",
          studio.gradient?.to || "#F2F2F2",
        ]}
      />
      <div className="flex-1">
        {blocks.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <p className="text-neutral-400 font-whisper">
              No blocks added yet. Go back and build your
              page layout.
            </p>
          </div>
        )}
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
