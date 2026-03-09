"use client";

import { useCallback, useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import type { GlobalTypetesterProps } from "@/types/typetester";
import { generateUUID } from "@/utils/generate-uuid";
import GlobalTypetesterBlock from "./global-block";

export default function GlobalTypetester({
  typefaces = [],
  backgroundColor,
  fontColor,
}: GlobalTypetesterProps) {
  const { displayFontFamily, textFontFamily } =
    useStudioFonts();
  const [blockIds, setBlockIds] = useState<string[]>([
    generateUUID(),
  ]);

  const addBlock = useCallback(() => {
    setBlockIds((prev) => [...prev, generateUUID()]);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlockIds((prev) => prev.filter((b) => b !== id));
  }, []);

  const canDelete = blockIds.length > 1;

  const sectionStyle: React.CSSProperties = {};
  if (backgroundColor)
    sectionStyle.backgroundColor = backgroundColor;
  if (fontColor) sectionStyle.color = fontColor;

  return (
    <div
      className="relative my-40 flex w-full flex-col gap-4 px-4 lg:px-16"
      id="tester"
      style={
        Object.keys(sectionStyle).length > 0
          ? sectionStyle
          : undefined
      }
    >
      <div
        className="relative mb-2 font-bold text-xl"
        style={{ fontFamily: displayFontFamily }}
      >
        Test our fonts!
      </div>
      <div className="relative flex flex-col gap-1">
        {blockIds.map((id) => (
          <GlobalTypetesterBlock
            key={id}
            canDelete={canDelete}
            onDelete={() => removeBlock(id)}
            typefaces={typefaces}
            initialBackgroundColor={backgroundColor}
            initialFontColor={fontColor}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addBlock}
        aria-label="Add new typetester block"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 border-dashed py-6 font-semibold text-black text-lg transition-colors hover:border-black hover:text-black"
        style={{ fontFamily: textFontFamily }}
      >
        <RiAddLine size={16} />
        Add block
      </button>
    </div>
  );
}
