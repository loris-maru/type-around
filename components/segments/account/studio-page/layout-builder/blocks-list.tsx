import type { BlocksListProps } from "@/types/components";
import type { LayoutBlockId } from "@/types/layout";

function BlockButton({
  block,
  onAdd,
}: {
  block: { id: LayoutBlockId; label: string };
  onAdd: (id: LayoutBlockId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onAdd(block.id)}
      className="flex aspect-square cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-center font-medium font-whisper text-sm transition-colors hover:border-black hover:bg-neutral-50"
    >
      {block.label}
    </button>
  );
}

export default function BlocksList({
  availableBlocks,
  handleAdd,
}: BlocksListProps) {
  const uniqueBlocks = availableBlocks.filter(
    (b) => b.unique
  );
  const repeatableBlocks = availableBlocks.filter(
    (b) => !b.unique
  );

  return (
    <div className="col-span-1 flex flex-col gap-6">
      <div>
        <h3 className="mb-3 font-normal font-whisper text-neutral-500 text-sm">
          Available blocks
        </h3>
        {availableBlocks.length === 0 ? (
          <p className="font-whisper text-neutral-400 text-sm">
            All blocks have been added
          </p>
        ) : (
          <>
            {uniqueBlocks.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 font-medium font-whisper text-neutral-600 text-xs uppercase tracking-wide">
                  Unique
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {uniqueBlocks.map((block) => (
                    <BlockButton
                      key={block.id}
                      block={block}
                      onAdd={handleAdd}
                    />
                  ))}
                </div>
              </div>
            )}
            {repeatableBlocks.length > 0 && (
              <div>
                <h4 className="mb-2 font-medium font-whisper text-neutral-600 text-xs uppercase tracking-wide">
                  Repeatable
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {repeatableBlocks.map((block) => (
                    <BlockButton
                      key={block.id}
                      block={block}
                      onAdd={handleAdd}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
