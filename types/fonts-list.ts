import type { Studio } from "./typefaces";

export type FontsListProps = {
  /** Optional initial studios; if not provided, fetches from API */
  studios?: Studio[];
};
