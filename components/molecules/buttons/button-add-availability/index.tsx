"use client";

type ButtonAddAvailabilityProps = {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function ButtonAddAvailability({
  onClick,
  disabled = false,
  children = "Add",
}: ButtonAddAvailabilityProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 cursor-pointer rounded-lg border border-black bg-black px-4 py-2 font-whisper text-sm text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}
