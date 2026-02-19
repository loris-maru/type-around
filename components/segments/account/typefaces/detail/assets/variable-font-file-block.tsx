"use client";

import { useState } from "react";
import FileDropZone from "@/components/global/file-drop-zone";
import type { VariableFontFileBlockProps } from "@/types/components";

export default function VariableFontFileBlock({
  value,
  onChange,
  studioId,
}: VariableFontFileBlockProps) {
  const [showDropzone, setShowDropzone] = useState(true);

  return (
    <div className="flex flex-1 flex-col gap-y-2">
      <div className="flex flex-row items-center justify-between">
        <span className="font-semibold text-black text-sm">
          Variable Font File
        </span>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showDropzone}
            onChange={(e) =>
              setShowDropzone(e.target.checked)
            }
            className="rounded border-neutral-300"
          />
          <span className="font-whisper text-neutral-600 text-sm">
            Show
          </span>
        </label>
      </div>
      {showDropzone && (
        <FileDropZone
          label=""
          accept=".ttf,.otf,.woff,.woff2"
          value={value}
          onChange={onChange}
          description=".ttf, .otf, .woff, .woff2"
          instruction="If available, add the variable font file. This will be used to display the variable font in the browser."
          studioId={studioId}
          folder="fonts"
        />
      )}
    </div>
  );
}
