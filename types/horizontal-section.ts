import type { Studio } from "./typefaces";

export type HorizontalSectionProps = {
  /** Optional initial studios; if not provided, fetches from API */
  studios?: Studio[];
};
