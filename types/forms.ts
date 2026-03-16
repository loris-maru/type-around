import { ComponentType } from "react";

export type CustomComponentProps = {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
};

export type FormField = {
  label: string;
  slug: string;
  type: string;
  placeholder: string;
  icon?: ComponentType<{ className?: string }>;
  customComponent?: ComponentType<CustomComponentProps>;
  /** Grid column span (1 or 2). Default 2 for custom/textarea. */
  colSpan?: 1 | 2;
};
