"use client";

type ButtonSelectSlotProps = {
  slot: string;
  onClick: () => void;
};

export default function ButtonSelectSlot({
  slot,
  onClick,
}: ButtonSelectSlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-neutral-700 text-sm transition-colors hover:border-black hover:bg-neutral-50"
    >
      {slot}
    </button>
  );
}
