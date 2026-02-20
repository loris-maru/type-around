"use client";

import {
  RiFileTextLine,
  RiUploadCloud2Line,
} from "react-icons/ri";

type TypeTesterDropzoneProps = {
  fileName: string | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onDrop: (e: React.DragEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export default function TypeTesterDropzone({
  fileName,
  onChange,
  onDrop,
  inputRef,
}: TypeTesterDropzoneProps) {
  return (
    <div>
      <label
        htmlFor="fontFile"
        className="mb-2 block font-normal font-whisper text-black text-sm"
      >
        Font file for type tester (woff2)
      </label>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone triggers file input */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: drop zone triggers file input */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="w-full cursor-pointer rounded-lg border-2 border-neutral-300 border-dashed p-6 transition-colors hover:border-neutral-400"
      >
        <input
          ref={inputRef}
          id="fontFile"
          type="file"
          accept=".woff2"
          onChange={onChange}
          className="hidden"
          aria-label="Upload woff2 font file for type tester"
        />
        {fileName ? (
          <div className="flex items-center justify-center gap-2">
            <RiFileTextLine className="h-5 w-5 text-neutral-600" />
            <span className="text-neutral-700 text-sm">
              {fileName}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <RiUploadCloud2Line className="h-8 w-8 text-neutral-400" />
            <span className="text-neutral-500 text-sm">
              Drop woff2 file or click to browse
            </span>
            <span className="text-neutral-400 text-xs">
              .woff2
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
