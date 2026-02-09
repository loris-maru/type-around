import { RiAddLine } from "react-icons/ri";
import type { BlocksListProps } from "@/types/components";

export default function BlocksList({
  availableBlocks,
  handleAdd,
}: BlocksListProps) {
  return (
    <div className="col-span-1">
      <h3 className="mb-3 font-normal font-whisper text-neutral-500 text-sm">
        Available blocks
      </h3>
      <div className="flex flex-col gap-2">
        {availableBlocks.length === 0 ? (
          <p className="font-whisper text-neutral-400 text-sm">
            All blocks have been added
          </p>
        ) : (
          availableBlocks.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() => handleAdd(block.id)}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-left transition-colors hover:border-black hover:bg-neutral-50"
            >
              <RiAddLine className="h-4 w-4 shrink-0 text-neutral-500" />
              <span className="font-medium font-whisper text-sm">
                {block.label}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
