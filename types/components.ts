import type { MotionValue } from "motion/react";
import type { ReactNode } from "react";
import type { UploadFolder } from "@/lib/firebase/storage";
import type {
  BlogArticle,
  BlogBlockData,
  GalleryBlockData,
  ImageBlockData,
  LayoutBlock,
  LayoutBlockId,
  LayoutItem,
  LayoutItemData,
  SpacerBlockData,
  StoreBlockData,
  TypefaceListBlockData,
  VideoBlockData,
} from "./layout";
import type {
  FontInUseSubmission,
  Purchase,
  StudioSummary,
} from "./my-account";
import type {
  Designer,
  Font,
  FontInUse,
  MemberRole,
  Studio,
  StudioMember,
  StudioTypeface,
} from "./studio";
import type { Typeface } from "./typefaces";

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
  theme?: "dark" | "light";
  className?: string;
};

export type FileDropZoneProps = {
  label: string;
  accept: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  instruction?: string;
  icon?: "file" | "image";
  studioId: string;
  folder: UploadFolder;
};

// ===========================================
// Custom Select Component Props
// ===========================================

export type CustomSelectOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export type CustomSelectProps = {
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  className?: string;
};

// ===========================================
// Multi-Select Dropdown Component Props
// ===========================================

export type MultiSelectDropdownOption = {
  value: string;
  label: string;
};

export type MultiSelectDropdownProps = {
  options: MultiSelectDropdownOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  showTags?: boolean;
};

// ===========================================
// Home Component Props
// ===========================================

export type HeaderHomeProps = {
  svgScale: MotionValue<number>;
  opacity: MotionValue<number>;
};

export type AllFontsProps = {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

// ===========================================
// Account Component Props
// ===========================================

export type TypefaceDetailProps = {
  typefaceSlug: string;
};

export type TypefaceDetailHeaderProps = {
  typefaceName: string;
  status: string;
  hasChanges: boolean;
  isSaving: boolean;
  isPublished: boolean;
  viewHref: string;
  onSave: () => void;
  onStatusChange: (status: string) => void;
  onTogglePublish: () => void;
};

export type BasicInformationSectionProps = {
  name: string;
  hangeulName: string;
  categories: string[];
  characters: number | string;
  releaseDate: string;
  description: string;
  supportedLanguages: string[];
  typefaceVision: {
    usage: string;
    contrast: string;
    width: string;
    playful: string;
    frame: string;
    serif: string;
  };
  designerIds: string[];
  studioDesigners: Designer[];
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
  onCategoriesChange: (values: string[]) => void;
  onLanguagesChange: (values: string[]) => void;
  onTypefaceVisionChange: (vision: {
    usage?: string;
    contrast?: string;
    width?: string;
    playful?: string;
    frame?: string;
    serif?: string;
  }) => void;
  onDesignerIdsChange: (ids: string[]) => void;
};

// ===========================================
// Version types
// ===========================================

export type TypefaceVersion = {
  id: string;
  title: string;
  versionNumber: string;
  description: string;
  coverImage: string;
  glyphSetCurrent: number;
  glyphSetFinal: number;
  features: string;
  newWeightCurrent: number;
  newWeightFinal: number;
  newStyleCurrent: number;
  newStyleFinal: number;
  corrections: string;
};

export type VersionsListSectionProps = {
  versions: TypefaceVersion[];
  onAddVersionClick: () => void;
  onEditVersion: (version: TypefaceVersion) => void;
  onRemoveVersion: (versionId: string) => void;
};

export type AddVersionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (version: TypefaceVersion) => void;
  editingVersion: TypefaceVersion | null;
  studioId: string;
};

export type VersionCardProps = {
  version: TypefaceVersion;
  canDelete: boolean;
  onRemove: (versionId: string) => void;
  onEdit: (version: TypefaceVersion) => void;
};

export type FontsListSectionProps = {
  fonts: Font[];
  displayFontId: string;
  fontLineText: string;
  onRemoveFont: (fontId: string) => void;
  onEditFont: (font: Font) => void;
  onAddFontClick: () => void;
  onDisplayFontChange: (fontId: string) => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export type FilesAssetsSectionProps = {
  studioId: string;
  headerImage: string;
  heroLetter: string;
  specimen: string;
  eula: string;
  variableFontFile: string;
  galleryImages: string[];
  onFileChange: (field: string) => (value: string) => void;
  onGalleryImagesChange: (images: string[]) => void;
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

export type AddTypefaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  studio: Studio | null;
  onAddTypeface: (
    typeface: StudioTypeface
  ) => Promise<void>;
};

export type AddTypefaceProps = {
  studio: Studio | null;
  onAddTypeface: (
    typeface: StudioTypeface
  ) => Promise<void>;
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

export type PublicTypefaceCardProps = {
  studioName: string;
  typeface: Typeface;
};

export type FontInUseCardProps = {
  fontInUse: FontInUse;
  onRemove: (id: string) => void;
  onEdit: (fontInUse: FontInUse) => void;
};

// ===========================================
// Settings Component Props
// ===========================================

export type MemberAvatarProps = {
  imageUrl?: string;
  name: string;
  size?: "sm" | "md" | "lg";
};

export type MemberRoleBadgeProps = {
  role: MemberRole;
  isOwner: boolean;
  canManageMembers: boolean;
  isRemoving: boolean;
  onRoleChange?: (role: MemberRole) => void;
  onRemove?: () => void;
};

export type MemberListItemProps = {
  member: StudioMember;
  currentUserEmail?: string;
  isOwner: boolean;
  canManageMembers: boolean;
  isRemoving: boolean;
  onRoleChange: (
    memberId: string,
    role: MemberRole
  ) => void;
  onRemove: (memberId: string) => void;
};

export type AddMemberFormProps = {
  studio: Studio;
  onMemberAdded: (members: StudioMember[]) => void;
  onCancel: () => void;
  onError: (error: string) => void;
};

// ===========================================
// Layout Builder Component Props
// ===========================================

export type LayoutBuilderProps = {
  value: LayoutItem[];
  onChange: (layout: LayoutItem[]) => void;
  studioId: string;
};

export type BlockBuilderProps = {
  activeItems: LayoutItem[];
  handleRemove: (key: string) => void;
  handleReorder: (newOrder: LayoutItem[]) => void;
  handleUpdateData: (
    key: string,
    data: LayoutItemData
  ) => void;
  getLabelForId: (id: LayoutBlockId) => string;
  studioId: string;
};

export type BlocksListProps = {
  availableBlocks: LayoutBlock[];
  handleAdd: (blockId: LayoutBlockId) => void;
};

export type GalleryBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GalleryBlockData) => void;
  initialData?: GalleryBlockData;
  studioId: string;
};

export type MediaBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ImageBlockData | VideoBlockData) => void;
  initialData?: ImageBlockData | VideoBlockData;
  studioId: string;
  type: "image" | "video";
};

export type SpacerBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SpacerBlockData) => void;
  initialData?: SpacerBlockData;
};

export type StoreBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StoreBlockData) => void;
  initialData?: StoreBlockData;
  studioId: string;
};

export type BlogArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: BlogArticle) => void;
  initialArticle?: BlogArticle;
};

export type BlogBlockInlineProps = {
  data: BlogBlockData;
  onUpdateData: (data: BlogBlockData) => void;
  onRemove: () => void;
};

export type TypefaceListBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TypefaceListBlockData) => void;
  initialData?: TypefaceListBlockData;
};

// ===========================================
// Studio Preview Component Props
// ===========================================

export type StudioGalleryProps = {
  data: GalleryBlockData;
};

export type StudioImageBlockProps = {
  data: ImageBlockData;
};

export type StudioVideoBlockProps = {
  data: VideoBlockData;
};

export type StudioSpacerBlockProps = {
  data: SpacerBlockData;
};

export type StudioStoreBlockProps = {
  data: StoreBlockData;
};

export type StudioBlogBlockProps = {
  data: BlogBlockData;
};

export type PreviewBlockRendererProps = {
  block: LayoutItem;
  studio: Studio;
};

// ===========================================
// Molecule Component Props
// ===========================================

export type ColorPickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
};

// ===========================================
// Designers Component Props
// ===========================================

export type DesignerCardProps = {
  designer: Designer;
  onEdit: (designer: Designer) => void;
  onRemove: (id: string) => void;
};

export type AddDesignerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (designer: Designer) => void;
  editingDesigner?: Designer | null;
  studioId: string;
};

// ===========================================
// My Account Component Props
// ===========================================

export type PurchaseCardProps = {
  purchase: Purchase;
};

export type SubmissionCardProps = {
  submission: FontInUseSubmission;
  onAccept: (
    submission: FontInUseSubmission
  ) => Promise<void>;
  onReject: (submissionId: string) => Promise<void>;
};

export type SubmitFontInUseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<FontInUseSubmission, "id">
  ) => Promise<void>;
  studios: StudioSummary[];
  userId: string;
  userName: string;
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

// ===========================================
// Rich Text Editor Component Props
// ===========================================

export type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
};

export type ToolbarButtonProps = {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
};
