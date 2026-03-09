"use client";

import { useCallback, useState } from "react";
import { RiAddLine } from "react-icons/ri";
import type { TypetesterFont } from "@/types/typetester";
import { generateUUID } from "@/utils/generate-uuid";
import SingleTypetesterBlock from "./single-block";

export type SingleTypetesterProps = {
  fonts?: TypetesterFont[];
  initialBackgroundColor?: string;
  initialForegroundColor?: string;
};

export default function SingleTypetester({
  fonts = [],
  initialBackgroundColor,
  initialForegroundColor,
}: SingleTypetesterProps) {
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

  return (
    <div
      className="relative my-8 flex w-full flex-col gap-4 px-4 lg:my-40 lg:px-16"
      id="tester"
    >
      <div className="relative mb-2 font-bold font-ortank text-xl">
        Test our fonts!
      </div>
      <div className="relative flex flex-col gap-1">
        {blockIds.map((id) => (
          <SingleTypetesterBlock
            key={id}
            canDelete={canDelete}
            onDelete={() => removeBlock(id)}
            fonts={fonts}
            initialBackgroundColor={initialBackgroundColor}
            initialForegroundColor={initialForegroundColor}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addBlock}
        aria-label="Add new typetester block"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 border-dashed py-6 font-semibold font-whisper text-black text-lg transition-colors hover:border-black hover:text-black"
      >
        <RiAddLine size={16} />
        Add block
      </button>
    </div>
  );
}
