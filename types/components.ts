import { ReactNode } from "react";
import { MotionValue } from "motion/react";
import { Font, FontInUse, StudioTypeface } from "./studio";
import { UploadFolder } from "@/lib/firebase/storage";

// ===========================================
// Global Component Props
// ===========================================

export type SmoothScrollProviderProps = {
  children: ReactNode;
};

export type CollapsibleSectionProps = {
  id: string;
  title: string;
  count?: number;
  countLabel?: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export type FormInputProps = {
  label: string;
  name: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: "text" | "number" | "date" | "email" | "url";
  required?: boolean;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
};

export type FormTextareaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  rows?: number;
  required?: boolean;
  placeholder?: string;
};

export type SectionTitleProps = {
  title: string;
  count?: number;
  countLabel?: string;
};

export type TagInputProps = {
  label: string;
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
};

export type FileDropZoneProps = {
  label: string;
  accept: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  icon?: "file" | "image";
  studioId: string;
  folder: UploadFolder;
};

// ===========================================
// Home Component Props
// ===========================================

export type HeaderHomeProps = {
  svgScale: MotionValue<number>;
  opacity: MotionValue<number>;
};

// ===========================================
// Account Component Props
// ===========================================

export type TypefaceDetailProps = {
  typefaceSlug: string;
};

export type TypefaceDetailHeaderProps = {
  typefaceName: string;
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
};

export type BasicInformationSectionProps = {
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
};

export type FontsListSectionProps = {
  fonts: Font[];
  onRemoveFont: (fontId: string) => void;
  onEditFont: (font: Font) => void;
  onAddFontClick: () => void;
};

export type FilesAssetsSectionProps = {
  studioId: string;
  headerImage: string;
  heroLetter: string;
  specimen: string;
  eula: string;
  variableFontFile: string;
  onFileChange: (field: string) => (value: string) => void;
};

export type AddFontModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (font: Font) => void;
  editingFont?: Font | null;
  studioId: string;
};

export type AddFontInUseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fontInUse: FontInUse) => void;
  editingFontInUse?: FontInUse | null;
  typefaces: StudioTypeface[];
  studioId: string;
};

// ===========================================
// Card Component Props
// ===========================================

export type FontCardProps = {
  font: Font;
  onRemove: (fontId: string) => void;
  onEdit: (font: Font) => void;
};

export type TypefaceCardProps = {
  typeface: StudioTypeface;
  onClick?: () => void;
};

export type FontInUseCardProps = {
  fontInUse: FontInUse;
  onRemove: (id: string) => void;
  onEdit: (fontInUse: FontInUse) => void;
};

// ===========================================
// Internal/Utility Types
// ===========================================

export type SalesFile = {
  id: string;
  name: string;
  url?: string;
  file?: File;
};

export type ImagePreview = {
  id: string;
  previewUrl: string;
  file?: File;
  uploadedUrl?: string;
};

export type FormValues = Record<string, string>;
