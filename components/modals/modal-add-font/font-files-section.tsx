"use client";

import { FONT_FORMATS } from "@/constant/FONT_FORMATS";
import type { FontFilesSectionProps } from "@/types/components";
import FontFormatDropzone from "./font-format-dropzone";

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
