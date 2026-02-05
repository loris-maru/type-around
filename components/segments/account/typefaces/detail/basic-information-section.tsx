"use client";

import FormInput from "@/components/global/form-input";
import FormTextarea from "@/components/global/form-textarea";
import MultiSelectDropdown from "@/components/global/multi-select-dropdown";
import CollapsibleSection from "@/components/global/collapsible-section";
import { TYPEFACE_CATEGORIES } from "@/constant/TYPEFACE_CATEGORIES";
import { SUPPORTED_LANGUAGES } from "@/constant/SUPPORTED_LANGUAGES";

const CATEGORY_OPTIONS = TYPEFACE_CATEGORIES.map(
  (category) => ({
    value: category,
    label: category,
  })
);

const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map(
  (language) => ({
    value: language,
    label: language,
  })
);

interface BasicInformationSectionProps {
  name: string;
  hangeulName: string;
  categories: string[];
  characters: number | string;
  releaseDate: string;
  description: string;
  supportedLanguages: string[];
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
  onCategoriesChange: (values: string[]) => void;
  onLanguagesChange: (values: string[]) => void;
}

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

        <MultiSelectDropdown
          label="Categories"
          options={CATEGORY_OPTIONS}
          value={categories}
          onChange={onCategoriesChange}
          placeholder="Select categories..."
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
