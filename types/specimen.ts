import type {
  Font,
  SpecimenPage,
  SpecimenPageBackground,
  SpecimenPageGrid,
  SpecimenPageMargins,
} from "./studio";

// ===========================================
// Layout & Page
// ===========================================

export type SpecimenLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string; specimenId: string }>;
};

export type SpecimenPageProps = {
  params: Promise<{ id: string; specimenId: string }>;
};

// ===========================================
// Context
// ===========================================

export type SelectedCell = {
  pageId: string;
  cellIndex: number;
};

export type SpecimenSelectionAttributes = {
  fontSize: string | null;
  color: string | null;
  backgroundColor: string | null;
  fontFamily: string | null;
  lineHeight: string | null;
};

export type SpecimenPageContextValue = {
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;
  selectedCell: SelectedCell | null;
  setSelectedCell: (cell: SelectedCell | null) => void;
  /** TipTap editor instance for the active cell (set when cell editor mounts) */
  activeEditor: unknown;
  setActiveEditor: (editor: unknown) => void;
  /** Selection attributes from TipTap (updated on selection change) */
  selectionAttributes: SpecimenSelectionAttributes | null;
  setSelectionAttributes: (
    attrs: SpecimenSelectionAttributes | null
  ) => void;
  /** Stored selection range captured before blur (e.g. when clicking panel) */
  storedSelectionRange: { from: number; to: number } | null;
  setStoredSelectionRange: (
    range: { from: number; to: number } | null
  ) => void;
  /** Save active cell content (call after applying format from panel to avoid sync overwrite) */
  saveActiveCellContent: (() => void) | null;
  setSaveActiveCellContent: (
    fn: (() => void) | null
  ) => void;
  centerOnPageRequest: string | null;
  requestCenterOnPage: (pageId: string) => void;
  clearCenterOnPageRequest: () => void;
  isTemplatePickerOpen: boolean;
  setTemplatePickerOpen: (open: boolean) => void;
};

// ===========================================
// Workspace & Single Page
// ===========================================

export type SpecimenPageWorkspaceProps = {
  specimenId: string;
};

export type SinglePageProps = {
  page: SpecimenPage;
  format: "A4" | "Letter";
  orientation: "portrait" | "landscape";
  className?: string;
  specimenId: string;
  typefaceSlug: string;
  /** Workspace scale factor - used to keep "Click to edit" text viewport-fixed */
  workspaceScale?: number;
};

// ===========================================
// Top Bar Components
// ===========================================

export type BackToTypefaceLinkProps = {
  studioId: string;
  typefaceSlug: string;
};

export type CenterOnPageButtonProps = {
  specimenId: string;
};

// ===========================================
// Panels
// ===========================================

export type PageSettingPanelProps = {
  specimenId: string;
  studioId: string;
  typefaceSlug: string;
};

export type CellSettingPanelProps = {
  specimenId: string;
  studioId: string | undefined;
  typefaceSlug: string;
  pageId: string;
  cellIndex: number;
};

export type ExpandedBlockId = null;

// ===========================================
// Parameter Blocks
// ===========================================

export type ParameterBlockProps = {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  /** Controlled: when provided with onToggle, parent controls expanded state */
  expanded?: boolean;
  onToggle?: () => void;
};

export type MarginsParameterBlockProps = {
  page: SpecimenPage;
  onMarginChange: (
    field: keyof SpecimenPageMargins,
    value: number
  ) => void;
  onApply?: (margins: SpecimenPageMargins) => void;
  expanded?: boolean;
  onToggle?: () => void;
};

export type BackgroundParameterBlockProps = {
  page: SpecimenPage;
  studioId: string;
  onChange: (background: SpecimenPageBackground) => void;
  expanded?: boolean;
  onToggle?: () => void;
};

export type GridParameterBlockProps = {
  page: SpecimenPage;
  onGridChange: (grid: SpecimenPageGrid) => void;
  expanded?: boolean;
  onToggle?: () => void;
};

export type FontsParameterBlockProps = {
  fonts: Font[];
  onAddFont: () => void;
};

export type FormatParameterBlockProps = {
  format: string;
  orientation: "portrait" | "landscape";
  onFormatChange: (value: string) => void;
  onOrientationChange: (
    value: "portrait" | "landscape"
  ) => void;
};

export type PagesParameterBlockProps = {
  pages: SpecimenPage[];
  selectedPageId: string | null;
  onPageSelect: (pageId: string) => void;
  onReorder: (pages: SpecimenPage[]) => void;
  onAddPage: () => void;
  onPageNameSave: (pageId: string, name: string) => void;
  onDeletePage: (pageId: string) => void;
};

// ===========================================
// Typeface Specimen Page
// ===========================================

export type TypefaceSpecimenPageProps = {
  specimenId: string;
};
