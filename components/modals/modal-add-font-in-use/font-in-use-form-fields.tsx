"use client";

import { InputDropdown } from "@/components/global/inputs";
import {
  INPUT_CLASS,
  LABEL_CLASS,
} from "@/constant/FORM_CLASSES";
import {
  PLACEHOLDER_DESIGNER_NAME,
  PLACEHOLDER_PROJECT_DESCRIPTION,
  PLACEHOLDER_PROJECT_NAME,
  PLACEHOLDER_SELECT_TYPEFACE,
} from "@/constant/MODAL_CONSTANTS";
import type { FontInUseFormFieldsProps } from "@/types/components";

export default function FontInUseFormFields({
  formData,
  onInputChange,
  onTypefaceChange,
  typefaceOptions,
}: FontInUseFormFieldsProps) {
  return (
    <>
      <div>
        <label
          htmlFor="projectName"
          className={`${LABEL_CLASS}`}
        >
          Project Name{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          value={formData.projectName}
          onChange={onInputChange}
          required
          className={INPUT_CLASS}
          placeholder={PLACEHOLDER_PROJECT_NAME}
        />
      </div>

      <div>
        <label
          htmlFor="designerName"
          className={LABEL_CLASS}
        >
          Designer Name{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="designerName"
          name="designerName"
          value={formData.designerName}
          onChange={onInputChange}
          required
          className={INPUT_CLASS}
          placeholder={PLACEHOLDER_DESIGNER_NAME}
        />
      </div>

      <div>
        <label
          htmlFor="typefaceId"
          className={LABEL_CLASS}
        >
          Typeface <span className="text-red-500">*</span>
        </label>
        <InputDropdown
          value={formData.typefaceId}
          options={[
            {
              value: "",
              label: PLACEHOLDER_SELECT_TYPEFACE,
            },
            ...typefaceOptions,
          ]}
          onChange={(v) => onTypefaceChange(v ?? "")}
          className="w-full"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className={LABEL_CLASS}
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          rows={3}
          className={`${INPUT_CLASS} resize-none`}
          placeholder={PLACEHOLDER_PROJECT_DESCRIPTION}
        />
      </div>
    </>
  );
}
