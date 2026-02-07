import { RiAddLine } from "react-icons/ri";
import type { BlocksListProps } from "@/types/components";

export default function BlocksList({
  availableBlocks,
  handleAdd,
}: BlocksListProps) {
  return (
    <div className="col-span-1">
      <h3 className="text-sm font-whisper font-normal text-neutral-500 mb-3">
        Available blocks
      </h3>
      <div className="flex flex-col gap-2">
        {availableBlocks.length === 0 ? (
          <p className="text-sm text-neutral-400 font-whisper">
            All blocks have been added
          </p>
        ) : (
          availableBlocks.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() => handleAdd(block.id)}
              className="flex items-center gap-2 px-4 py-3 border border-neutral-300 rounded-lg hover:border-black hover:bg-neutral-50 transition-colors cursor-pointer text-left"
            >
              <RiAddLine className="w-4 h-4 text-neutral-500 shrink-0" />
              <span className="text-sm font-whisper font-medium">
                {block.label}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
