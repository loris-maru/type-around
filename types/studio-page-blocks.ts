import type { LayoutItem } from "./layout";
import type { Studio } from "./studio";
import type { TypefaceMeta } from "./typefaces";

export type StudioPageBlocksProps = {
  blocks: LayoutItem[];
  studio: Studio;
  typefaceMeta: TypefaceMeta[];
};
