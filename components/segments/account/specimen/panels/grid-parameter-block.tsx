"use client";

import type { GridParameterBlockProps } from "@/types/specimen";
import { getPageGrid } from "@/utils/specimen-utils";
import ParameterBlock from "./parameter-block";

export default function GridParameterBlock({
  page,
  onGridChange,
  expanded,
  onToggle,
}: GridParameterBlockProps) {
  const grid = getPageGrid(page);

  return (
    <ParameterBlock
      title="Grid"
      collapsible
      defaultExpanded={false}
      expanded={expanded}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-3">
        <div
          className="aspect-video w-full rounded border border-neutral-200 bg-neutral-100 p-2"
          aria-hidden
        >
          <div
            className="grid h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
              gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
              gap: `${Math.min(grid.gap, 16)}px`,
            }}
          >
            {Array.from(
              { length: grid.columns * grid.rows },
              (_, i) => (
                <div
                  key={`cell-${grid.columns}-${grid.rows}-${i}`}
                  className="rounded-sm bg-white shadow-sm"
                />
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <label
            htmlFor={`grid-columns-${page.id}`}
            className="flex flex-col gap-1"
          >
            <span className="text-neutral-500 text-xs">
              Column
            </span>
            <input
              id={`grid-columns-${page.id}`}
              type="number"
              min={1}
              value={grid.columns}
              onChange={(e) =>
                onGridChange({
                  ...grid,
                  columns: Math.max(
                    1,
                    Number(e.target.value) || 1
                  ),
                })
              }
              className="rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
            />
          </label>
          <label
            htmlFor={`grid-rows-${page.id}`}
            className="flex flex-col gap-1"
          >
            <span className="text-neutral-500 text-xs">
              Row
            </span>
            <input
              id={`grid-rows-${page.id}`}
              type="number"
              min={1}
              value={grid.rows}
              onChange={(e) =>
                onGridChange({
                  ...grid,
                  rows: Math.max(
                    1,
                    Number(e.target.value) || 1
                  ),
                })
              }
              className="rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
            />
          </label>
          <label
            htmlFor={`grid-gap-${page.id}`}
            className="flex flex-col gap-1"
          >
            <span className="text-neutral-500 text-xs">
              Gap
            </span>
            <input
              id={`grid-gap-${page.id}`}
              type="number"
              min={0}
              value={grid.gap}
              onChange={(e) =>
                onGridChange({
                  ...grid,
                  gap: Math.max(
                    0,
                    Number(e.target.value) || 0
                  ),
                })
              }
              className="rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
            />
          </label>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={grid.showGrid ?? false}
            onChange={(e) =>
              onGridChange({
                ...grid,
                showGrid: e.target.checked,
              })
            }
            className="h-4 w-4 rounded border-neutral-300"
          />
          <span className="font-whisper text-neutral-600 text-sm">
            Show grid
          </span>
        </label>
      </div>
    </ParameterBlock>
  );
}
