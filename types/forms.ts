import { ComponentType } from "react";

export type CustomComponentProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export type FormField = {
  label: string;
  slug: string;
  type: string;
  placeholder: string;
  icon?: ComponentType<{ className?: string }>;
  customComponent?: ComponentType<CustomComponentProps>;
};
