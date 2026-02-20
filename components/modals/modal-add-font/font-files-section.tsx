"use client";

import type { SalesFile } from "@/types/components";
import type { FontFormat } from "./font-format-dropzone";
import FontFormatDropzone from "./font-format-dropzone";

const FONT_FORMATS: FontFormat[] = [
  "otf",
  "ttf",
  "woff",
  "woff2",
];

type FontFilesSectionProps = {
  salesFilesByFormat: Record<FontFormat, SalesFile | null>;
  trialFilesByFormat: Record<FontFormat, SalesFile | null>;
  salesInputRefs: React.MutableRefObject<
    Record<FontFormat, HTMLInputElement | null>
  >;
  trialInputRefs: React.MutableRefObject<
    Record<FontFormat, HTMLInputElement | null>
  >;
  onSalesChange: (
    format: FontFormat
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSalesDrop: (
    format: FontFormat
  ) => (e: React.DragEvent) => void;
  onSalesRemove: (format: FontFormat) => () => void;
  onTrialChange: (
    format: FontFormat
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTrialDrop: (
    format: FontFormat
  ) => (e: React.DragEvent) => void;
  onTrialRemove: (format: FontFormat) => () => void;
};

export default function FontFilesSection({
  salesFilesByFormat,
  trialFilesByFormat,
  salesInputRefs,
  trialInputRefs,
  onSalesChange,
  onSalesDrop,
  onSalesRemove,
  onTrialChange,
  onTrialDrop,
  onTrialRemove,
}: FontFilesSectionProps) {
  return (
    <>
      {/* Fonts files for sale */}
      <div>
        <h3 className="mt-12 mb-4 font-bold font-ortank text-xl">
          Fonts files for sale
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {FONT_FORMATS.map((format) => (
            <FontFormatDropzone
              key={`sales-${format}`}
              format={format}
              file={salesFilesByFormat[format]}
              onChange={onSalesChange(format)}
              onDrop={onSalesDrop(format)}
              onRemove={onSalesRemove(format)}
              onTriggerClick={() =>
                salesInputRefs.current[format]?.click()
              }
              inputRef={(el) => {
                salesInputRefs.current[format] = el;
              }}
            />
          ))}
        </div>
      </div>

      {/* Trial fonts */}
      <div>
        <h3 className="mt-12 mb-4 font-bold font-ortank text-xl">
          Trial fonts
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {FONT_FORMATS.map((format) => (
            <FontFormatDropzone
              key={`trial-${format}`}
              format={format}
              file={trialFilesByFormat[format]}
              onChange={onTrialChange(format)}
              onDrop={onTrialDrop(format)}
              onRemove={onTrialRemove(format)}
              onTriggerClick={() =>
                trialInputRefs.current[format]?.click()
              }
              inputRef={(el) => {
                trialInputRefs.current[format] = el;
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
