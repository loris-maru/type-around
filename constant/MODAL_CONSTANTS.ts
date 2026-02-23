/**
 * Shared constants for modal forms and UI
 */

// Font form defaults
export const DEFAULT_FONT_WEIGHT = "400";
export const DEFAULT_FONT_WIDTH = "100";
export const DEFAULT_FONT_PRICES = {
  printPrice: 0,
  webPrice: 0,
  appPrice: 0,
} as const;

// Availability form defaults
export const DEFAULT_AVAILABILITY_START_TIME = "15:00";
export const DEFAULT_AVAILABILITY_END_TIME = "20:00";

// Loading / button labels
export const LABEL_SAVING = "Saving...";
export const LABEL_UPLOADING = "Uploading...";
export const LABEL_ADDING = "Adding…";

// Modal titles (add vs edit pattern)
export const MODAL_TITLE_FONT = {
  add: "Add New Font",
  edit: "Edit Font",
} as const;
export const MODAL_TITLE_DESIGNER = {
  add: "Add Designer",
  edit: "Edit Designer",
} as const;
export const MODAL_TITLE_PACKAGE = {
  add: "Add Package",
  edit: "Edit Package",
} as const;
export const MODAL_TITLE_VERSION = {
  add: "Add Version",
  edit: "Edit Version",
} as const;
export const MODAL_TITLE_FONT_IN_USE = {
  add: "Add Font In Use",
  edit: "Edit Font In Use",
} as const;
export const MODAL_TITLE_ARTICLE = {
  add: "New Article",
  edit: "Edit Article",
} as const;

// Placeholders
export const PLACEHOLDER_SELECT_TYPEFACE =
  "Select a typeface";
export const PLACEHOLDER_SELECT_STUDIO = "Select a studio";
export const PLACEHOLDER_SELECT_STUDIO_FIRST =
  "Select a studio first";
export const PLACEHOLDER_PROJECT_NAME =
  "e.g., Brand Identity for XYZ";
export const PLACEHOLDER_DESIGNER_NAME = "e.g., John Doe";
export const PLACEHOLDER_PROJECT_DESCRIPTION =
  "Brief description of the project...";
export const PLACEHOLDER_PACKAGE_NAME =
  "e.g., Complete Family";
export const PLACEHOLDER_PACKAGE_DESCRIPTION =
  "Describe this package...";
export const PLACEHOLDER_VERSION_TITLE =
  "e.g. Initial release";
export const PLACEHOLDER_VERSION_NUMBER = "e.g. 1.0";
export const PLACEHOLDER_VERSION_DESCRIPTION =
  "Describe what's included in this version";
export const PLACEHOLDER_VERSION_FEATURES =
  "List the features of this version";
export const PLACEHOLDER_VERSION_CORRECTIONS =
  "List the corrections made in this version";
export const PLACEHOLDER_ARTICLE_NAME =
  "Enter article name";
export const PLACEHOLDER_ARTICLE_INTRODUCTION =
  "Brief introduction to the article";
export const PLACEHOLDER_ARTICLE_AUTHORS =
  "Author 1, Author 2, ...";
export const PLACEHOLDER_ARTICLE_KEYWORDS =
  "keyword1, keyword2, ...";
export const PLACEHOLDER_PRODUCT_NAME = "Product name";
export const PLACEHOLDER_PRODUCT_DESCRIPTION =
  "Description";

// Helper / hint text
export const HINT_ARTICLE_AUTHORS =
  "Separate multiple authors with commas";
export const HINT_ARTICLE_KEYWORDS =
  "Separate multiple keywords with commas";
export const HINT_IMAGE_DROPZONE =
  "Drop images or click to browse";
export const HINT_IMAGE_DROP =
  "Drop an image or click to upload";

// Error messages
export const ERROR_IMAGE_SIZE =
  "Please select an image file under 10MB.";
export const ERROR_INVALID_URL =
  "Please enter a valid URL.";
export const ERROR_IMAGE_REQUIRED =
  "At least one image is required";
export const ERROR_SAVE_FAILED = "Failed to save";
export const ERROR_SAVE_FONT_FAILED = "Failed to save font";
export const ERROR_SAVE_DESIGNER_FAILED =
  "Failed to save designer";

// Empty state messages
export const MESSAGE_NO_FONTS =
  "No fonts available. Add fonts in the Fonts section first.";
export const MESSAGE_ALL_FONTS_ADDED =
  "All fonts have been added to this package.";

// Currency
export const CURRENCY_WON = "₩";
export const CURRENCY_DOLLAR = "$";
