import type { MotionValue } from "motion/react";
import type { ReactNode } from "react";
import type { FontFormat } from "@/constant/FONT_FORMATS";
import type { UploadFolder } from "@/lib/firebase/storage";
import type {
  AboutBlockData as LayoutAboutBlockData,
  BlogArticle,
  BlogBlockData,
  FontsInUseBlockData,
  GalleryBlockData,
  ImageBlockData,
  LayoutBlock,
  LayoutBlockId,
  LayoutItem,
  LayoutItemData,
  SpacerBlockData,
  StoreBlockData,
  TypefaceListBlockData,
  TypeTesterBlockData as LayoutTypeTesterBlockData,
  VideoBlockData,
} from "./layout";
import type {
  AboutBlockData,
  CharacterSetBlockData,
  DownloadBlockData,
  ShopBlockData,
  TypefaceLayoutBlock,
  TypefaceLayoutBlockId,
  TypeTesterBlockData,
  UpdatesBlockData,
} from "./layout-typeface";
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
  Package,
  Studio,
  StudioMember,
  StudioSpecimen,
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
  id?: string;
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
  type?:
    | "text"
    | "number"
    | "date"
    | "email"
    | "url"
    | "time";
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
  backgroundColor?: string;
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
  // Font line (at bottom of Information section)
  fonts: Font[];
  displayFontId: string;
  fontLineText: string;
  onDisplayFontChange: (fontId: string) => void;
  // Typeface card (displayed font + content for typeface card)
  typefaceCardDisplayFontId: string;
  typefaceCardContent: string;
  onTypefaceCardDisplayFontChange: (fontId: string) => void;
  backgroundColor?: string;
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

export type ShopSectionProps = {
  printPrice: string;
  webPrice: string;
  appPrice: string;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
};

export type AddPackageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkg: Package) => void;
  editingPackage: Package | null;
  fonts: Font[];
};

export type PackagesListSectionProps = {
  packages: Package[];
  fonts: Font[];
  onAddPackageClick: () => void;
  onEditPackageClick: (pkg: Package) => void;
  onSavePackage: (pkg: Package) => void;
  onRemovePackage: (packageId: string) => void;
};

export type FontsListSectionProps = {
  fonts: Font[];
  onRemoveFont: (fontId: string) => void;
  onEditFont: (font: Font) => void;
  onAddFontClick: () => void;
};

export type FilesAssetsSectionProps = {
  studioId: string;
  typefaceSlug: string;
  heroLetter: string;
  specimen: string;
  eula: string;
  variableFontFile: string;
  galleryImages: string[];
  onFileChange: (field: string) => (value: string) => void;
  onGalleryImagesChange: (images: string[]) => void;
  onOpenEulaGenerator: () => void;
};

// ===========================================
// Typeface Detail Section Props
// ===========================================

export type HeroLetterBlockProps = {
  value: string;
  onChange: (value: string) => void;
  studioId: string;
};

export type VariableFontFileBlockProps = {
  value: string;
  onChange: (value: string) => void;
  studioId: string;
};

export type GalleryImagesBlockProps = {
  studioId: string;
  images: string[];
  onChange: (images: string[]) => void;
};

export type AssetsSectionProps = {
  studioId: string;
  heroLetter: string;
  variableFontFile: string;
  galleryImages: string[];
  onHeroLetterChange: (value: string) => void;
  onVariableFontFileChange: (value: string) => void;
  onGalleryImagesChange: (images: string[]) => void;
};

export type EulaSectionProps = {
  studioId: string;
  eula: string;
  onEulaChange: (value: string) => void;
  onOpenEulaGenerator: () => void;
};

export type SpecimenSectionProps = {
  studioId: string;
  typefaceSlug: string;
  specimen: string;
  onSpecimenChange: (value: string) => void;
};

export type SpecimenCardProps = {
  specimen: StudioSpecimen;
  studioId: string;
};

export type SpecimenPanelProps = {
  specimenId: string;
  typefaceSlug: string;
};

export type AddFontModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (font: Font) => void;
  editingFont?: Font | null;
  studioId: string;
  /** Default prices when adding a new font (from typeface Shop section) */
  defaultPrices?: {
    printPrice: number;
    webPrice: number;
    appPrice: number;
  };
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

export type PackageCardProps = {
  pkg: Package;
  fonts: Font[];
  onEdit: () => void;
  onRemove: () => void;
};

export type TypefaceCardProps = {
  typeface: StudioTypeface;
  onClick?: () => void;
};

export type PublicTypefaceCardProps = {
  studioName: string;
  typeface: Typeface;
  compact?: boolean;
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
  canManageMembers: boolean;
  canEditProfile: boolean;
  isRemoving: boolean;
  studioId: string;
  onRoleChange: (
    memberId: string,
    role: MemberRole
  ) => void;
  onRemove: (memberId: string) => void;
  onProfileUpdate?: (members: StudioMember[]) => void;
  onError?: (error: string) => void;
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

export type TypefacePageLayoutBuilderProps = {
  value: import("@/types/layout-typeface").TypefaceLayoutItem[];
  onChange: (
    layout: import("@/types/layout-typeface").TypefaceLayoutItem[]
  ) => void;
  studioId: string;
  typefaceId: string;
  typefaceFonts: {
    id: string;
    styleName?: string;
    weight?: number;
  }[];
};

export type TypefaceBlockBuilderProps = {
  activeItems: import("@/types/layout-typeface").TypefaceLayoutItem[];
  handleRemove: (key: string) => void;
  handleReorder: (
    newOrder: import("@/types/layout-typeface").TypefaceLayoutItem[]
  ) => void;
  handleUpdateData: (
    key: string,
    data: import("@/types/layout-typeface").TypefaceLayoutItemData
  ) => void;
  getLabelForId: (
    id: import("@/types/layout-typeface").TypefaceLayoutBlockId
  ) => string;
  studioId: string;
  typefaceFonts: {
    id: string;
    styleName?: string;
    weight?: number;
  }[];
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

export type FontsInUseBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FontsInUseBlockData) => void;
  initialData?: FontsInUseBlockData;
};

export type StudioAboutBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LayoutAboutBlockData) => void;
  initialData?: LayoutAboutBlockData;
};

export type StudioTypeTesterBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LayoutTypeTesterBlockData) => void;
  initialData?: LayoutTypeTesterBlockData;
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
// Modal & Button Component Props
// ===========================================

export type ButtonModalSaveProps = {
  label: string;
  loadingLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  "aria-label"?: string;
  className?: string;
};

export type ButtonAddPackageProps = {
  onClick: () => void;
};

export type AddAvailabilityModalProps = {
  isOpen: boolean;
  date: Date | null;
  onClose: () => void;
  onSave: (startTime: string, endTime: string) => void;
  isSaving?: boolean;
};

export type PageBackgroundBlockProps = {
  value: import("./studio").TypefacePageBackground;
  onChange: (
    value: import("./studio").TypefacePageBackground
  ) => void;
  studioId: string;
};

export type TypefacePageSectionProps = {
  typefacePageLayout: import("./layout-typeface").TypefaceLayoutItem[];
  onLayoutChange: (
    layout: import("./layout-typeface").TypefaceLayoutItem[]
  ) => void;
  typefacePageBackground?: import("./studio").TypefacePageBackground;
  onPageBackgroundChange: (
    value: import("./studio").TypefacePageBackground
  ) => void;
  studioId: string;
  typefaceId: string;
  typefaceFonts: {
    id: string;
    styleName?: string;
    weight?: number;
  }[];
};

export type AddVersionFormData = Omit<
  TypefaceVersion,
  "id"
>;

export type AddVersionOptionalToggles = {
  newWeight: boolean;
  newStyle: boolean;
  corrections: boolean;
};

// Modal sub-components
export type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

export type ModalErrorDisplayProps = {
  message: string;
};

export type ModalPhase =
  | "form"
  | "preview"
  | "confirmation";

// Add Font modal
export type AddFontFormData = {
  styleName: string;
  weight: string;
  width: string;
  isItalic: boolean;
};

export type AddFontFormFieldsProps = {
  formData: AddFontFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => void;
};

export type FontFormatDropzoneProps = {
  format: FontFormat;
  file: SalesFile | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemove: () => void;
  onTriggerClick: () => void;
  inputRef: React.RefCallback<HTMLInputElement | null>;
};

export type FontFilesSectionProps = {
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

export type TypeTesterDropzoneProps = {
  fileName: string | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onDrop: (e: React.DragEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

// Add Font In Use modal
export type FontInUseFormFieldsProps = {
  formData: {
    projectName: string;
    designerName: string;
    typefaceId: string;
    description: string;
  };
  onInputChange: (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => void;
  onTypefaceChange: (typefaceId: string) => void;
  typefaceOptions: { value: string; label: string }[];
};

export type FontInUseImageUploadProps = {
  images: ImagePreview[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onTriggerClick: () => void;
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onRemoveImage: (id: string) => void;
};

// Character Set Block modal
export type CharacterSetBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CharacterSetBlockData) => void;
  initialData?: CharacterSetBlockData;
};

// About Block modal
export type AboutBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AboutBlockData) => void;
  initialData?: AboutBlockData;
};

// Download Block modal
export type DownloadBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DownloadBlockData) => void;
  initialData?: DownloadBlockData;
};

// Type Tester Block modal
export type TypeTesterBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TypeTesterBlockData) => void;
  initialData?: TypeTesterBlockData;
};

// Updates Block modal
export type UpdatesBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdatesBlockData) => void;
  initialData?: UpdatesBlockData;
};

// Shop Block modal
export type ShopBlockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ShopBlockData) => void;
  initialData?: ShopBlockData;
  typefaceFonts: {
    id: string;
    styleName?: string;
    weight?: number;
  }[];
};

// Typeface page
export type TypefaceBlocksListProps = {
  availableBlocks: TypefaceLayoutBlock[];
  handleAdd: (blockId: TypefaceLayoutBlockId) => void;
};

export type TypefaceVisionBlockProps = {
  usage: string;
  contrast: string;
  width: string;
  playful: string;
  frame: string;
  serif: string;
  onUsageChange: (value: string) => void;
  onContrastChange: (value: string) => void;
  onWidthChange: (value: string) => void;
  onPlayfulChange: (value: string) => void;
  onFrameChange: (value: string) => void;
  onSerifChange: (value: string) => void;
};

export type DownloadButtonsProps = {
  typefaceName: string;
  specimenUrl?: string;
  trialFontUrls?: { styleName: string; file: string }[];
  showTrialFonts?: boolean;
  showSpecimen?: boolean;
  backgroundColor?: string;
  textColor?: string;
};

// Input components
export type InputDropdownProps = CustomSelectProps & {
  disabled?: boolean;
  transparent?: boolean;
  backgroundColor?: string;
};

export type InputCheckboxProps = {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
};

// Button components (beyond ButtonModalSaveProps, ButtonAddPackageProps)
export type ButtonCancelFormProps = {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
};

export type ButtonCloseModalProps = {
  onClick: () => void;
  children?: React.ReactNode;
  variant?: "icon" | "text";
};

export type ButtonSaveFormProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
};

export type ButtonSaveChangesProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
};

export type ButtonGoBackProps = {
  onClick: () => void;
};

export type ButtonAddAvailabilityProps = {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

export type ButtonAddAvailabilityDayProps = {
  day: number;
  onClick: () => void;
  slotCount?: number;
};

export type ButtonAddMemberProps = {
  onClick: () => void;
};

export type ButtonRemoveDesignerProps = {
  onClick: () => void;
  ariaLabel: string;
  children?: React.ReactNode;
};

export type ButtonReplaceFileProps = {
  onClick: () => void;
};

export type ButtonDeleteFileProps = {
  onClick: () => void;
};

export type ButtonConnectStripeProps = {
  onClick: () => void;
  disabled?: boolean;
};

export type ButtonAddCardProps = {
  label: string;
  onClick: () => void;
};

export type ButtonPreviewPageProps = {
  onClick: () => void;
};

export type ButtonDismissErrorProps = {
  onClick: () => void;
};

export type ButtonSendRequestProps = {
  onClick: () => void;
  className?: string;
};

export type ButtonViewStripeDashboardProps = {
  onClick: () => void;
  disabled?: boolean;
};

export type ButtonSelectSlotProps = {
  slot: string;
  onClick: () => void;
};

export type ButtonSelectReviewerProps = {
  children: React.ReactNode;
  onSelect: () => void;
};

// Feedback & Nylas
export type NylasBookedEvent = {
  start_time?: string | number;
  end_time?: string | number;
  title?: string;
  selectedTimeslot?: {
    start_time?: string | number;
    end_time?: string | number;
  };
  [key: string]: unknown;
};

export type FeedbacksSectionProps = {
  studioId: string;
};

export type FeedbackFormProps = {
  studioId: string;
  studioName: string;
  typefaces: import("./studio").StudioTypeface[];
  reviewers: import("@/constant/FEEDBACK_REVIEWERS").FeedbackReviewer[];
  step: number;
  onStepChange: (step: number) => void;
};

// Specimen
export type TemplatePickerPanelProps = {
  specimenId: string;
  pageId: string;
  pageName: string;
};

// EULA generator
export type ToggleFieldProps = {
  label: string;
  labelKo: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export type StepIndicatorProps = {
  currentStep: number;
};

// Gallery & upload
export type GalleryUploaderProps = {
  studioId: string;
  images: string[];
  onChange: (images: string[]) => void;
};

export type FontField = "headerFont" | "textFont";

export type FontUploadInputProps = {
  field: FontField;
  label: string;
};

// Typeface gallery
export type TypefaceGalleryImage = {
  src: string;
  alt?: string;
};

export type TypefaceGalleryProps = {
  images: TypefaceGalleryImage[];
};

export type TypefaceGalleryTransitionPhase =
  | "idle"
  | "cover-up"
  | "hold"
  | "uncover-up";

// Footer / newsletter
export type SubscribeStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

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
