"use client";

type ButtonCancelFormProps = {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
};

export default function ButtonCancelForm({
  onClick,
  children = "Cancel",
  className = "",
}: ButtonCancelFormProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 font-whisper text-neutral-600 text-sm transition-colors hover:border-black hover:bg-neutral-50 ${className}`}
    >
      {children}
    </button>
  );
}
