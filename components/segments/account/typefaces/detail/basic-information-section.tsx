"use client";

import CollapsibleSection from "@/components/global/collapsible-section";
import FormInput from "@/components/global/form-input";
import FormTextarea from "@/components/global/form-textarea";
import MultiSelectDropdown from "@/components/global/multi-select-dropdown";
import TagInput from "@/components/global/tag-input";
import { SUPPORTED_LANGUAGES } from "@/constant/SUPPORTED_LANGUAGES";
import type { BasicInformationSectionProps } from "@/types/components";

const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map(
  (language) => ({
    value: language,
    label: language,
  })
);

export default function BasicInformationSection({
  name,
  hangeulName,
  categories,
  characters,
  releaseDate,
  description,
  supportedLanguages,
  onInputChange,
  onCategoriesChange,
  onLanguagesChange,
}: BasicInformationSectionProps) {
  return (
    <CollapsibleSection
      id="information"
      title="Information"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Latin Name"
            name="name"
            value={name}
            onChange={onInputChange}
            required
          />
          <FormInput
            label="Hangeul Name"
            name="hangeulName"
            value={hangeulName}
            onChange={onInputChange}
          />
        </div>

        <TagInput
          label="Categories"
          value={categories}
          onChange={onCategoriesChange}
          placeholder="Type a category and press Enter..."
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Characters"
            name="characters"
            type="number"
            value={characters}
            onChange={onInputChange}
            min={0}
          />
          <FormInput
            label="Release Date"
            name="releaseDate"
            type="date"
            value={releaseDate}
            onChange={onInputChange}
          />
        </div>

        <FormTextarea
          label="Description"
          name="description"
          value={description}
          onChange={onInputChange}
          rows={4}
        />

        <MultiSelectDropdown
          label="Supported Languages"
          options={LANGUAGE_OPTIONS}
          value={supportedLanguages}
          onChange={onLanguagesChange}
          placeholder="Select supported languages..."
        />
      </div>
    </CollapsibleSection>
  );
}
