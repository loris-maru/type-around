export type TextAlign = "left" | "center" | "right";

export type TypetesterFont = {
  id: string;
  styleName: string;
  weight: number;
  isItalic: boolean;
  file: string; // woff2 URL for type tester
};

/** A typeface group used in the GlobalTypetester grouped font dropdown */
export type TypetesterTypeface = {
  id: string;
  name: string;
  fonts: TypetesterFont[];
};

export type TypetesterParams = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: TextAlign;
  fontId: string;
  backgroundColor: string;
  fontColor: string;
};

export type TypetesterBlock = {
  id: string;
  columns: number;
  backgroundColor: string;
  fontColor: string;
};

export type TypetesterParametersProps = {
  params: TypetesterParams;
  onChange: (params: TypetesterParams) => void;
};

export type SingleTypetesterBlockProps = {
  placeholder?: string;
  canDelete?: boolean;
  onDelete?: () => void;
  fonts?: TypetesterFont[];
};

export type GlobalTypetesterBlockProps = {
  placeholder?: string;
  canDelete?: boolean;
  onDelete?: () => void;
  typefaces?: TypetesterTypeface[];
};

export type GlobalTypetesterProps = {
  typefaces?: TypetesterTypeface[];
};
