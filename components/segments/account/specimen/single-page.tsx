"use client";

import { getPageDimensions } from "@/constant/SPECIMEN_PAGE_DIMENSIONS";
import type { SinglePageProps } from "@/types/specimen";
import type {
  SpecimenPage,
  SpecimenPageBackground,
  SpecimenPageGrid,
} from "@/types/studio";
import { cn } from "@/utils/class-names";

const DEFAULT_GRID: SpecimenPageGrid = {
  columns: 2,
  rows: 2,
  gap: 8,
  showGrid: false,
};

function getPageGrid(
  page: SpecimenPage
): SpecimenPageGrid | null {
  const grid = page.grid ?? DEFAULT_GRID;
  return grid.showGrid ? grid : null;
}

const DEFAULT_BACKGROUND: SpecimenPageBackground = {
  type: "color",
  color: "#ffffff",
  gradient: { from: "#FFF8E8", to: "#F2F2F2" },
  image: "",
};

function getPageBackgroundStyle(
  page: SpecimenPage
): React.CSSProperties {
  const bg = page.background ?? DEFAULT_BACKGROUND;
  if (bg.type === "color") {
    return { backgroundColor: bg.color ?? "#ffffff" };
  }
  if (bg.type === "gradient") {
    return {
      background: `linear-gradient(180deg, ${bg.gradient?.from ?? "#FFF8E8"} 0%, ${bg.gradient?.to ?? "#F2F2F2"} 100%)`,
    };
  }
  if (bg.type === "image" && bg.image) {
    return {
      backgroundImage: `url(${bg.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: "#ffffff" };
}

export default function SinglePage({
  page,
  format,
  orientation,
  className,
}: SinglePageProps) {
  const { width, height } = getPageDimensions(
    format,
    orientation
  );
  const style: React.CSSProperties = {
    width,
    height,
    ...getPageBackgroundStyle(page),
  };
  const grid = getPageGrid(page);

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-sm border border-neutral-300 shadow-md",
        className
      )}
      style={style}
      data-page-id={page.id}
    >
      {grid && (
        <div
          className="pointer-events-none absolute inset-0 grid p-0"
          style={{
            gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
            gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
            gap: `${grid.gap}px`,
          }}
          aria-hidden
        >
          {Array.from(
            { length: grid.columns * grid.rows },
            (_, i) => (
              <div
                key={`grid-cell-${grid.columns}-${grid.rows}-${i}`}
                className="bg-black/20"
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
