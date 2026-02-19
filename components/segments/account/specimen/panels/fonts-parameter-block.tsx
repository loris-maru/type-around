"use client";

import { Fragment } from "react";
import { RiAddFill } from "react-icons/ri";
import type { FontsParameterBlockProps } from "@/types/specimen";
import ParameterBlock from "./parameter-block";

export default function FontsParameterBlock({
  fonts,
  onAddFont,
}: FontsParameterBlockProps) {
  return (
    <ParameterBlock
      title="Fonts"
      collapsible
      defaultExpanded
    >
      <div className="flex w-full flex-col gap-3">
        {fonts.map((font, index) => (
          <Fragment key={font.id}>
            <div className="flex w-full flex-row justify-between font-whisper text-neutral-700 text-sm">
              <div>{font.styleName}</div>
              <div>{font.weight ? font.weight : ""}</div>
            </div>
            {index < fonts.length - 1 && (
              <div className="h-px w-full bg-neutral-200" />
            )}
          </Fragment>
        ))}
        <button
          type="button"
          onClick={onAddFont}
          className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 border-dashed py-2 font-whisper text-neutral-600 text-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50"
        >
          <RiAddFill className="h-4 w-4" />
          Add font
        </button>
      </div>
    </ParameterBlock>
  );
}
