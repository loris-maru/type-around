"use client";

type ButtonSendRequestProps = {
  onClick: () => void;
  className?: string;
};

export default function ButtonSendRequest({
  onClick,
  className = "",
}: ButtonSendRequestProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-lg border border-black bg-black px-4 py-2 font-whisper text-sm text-white transition-colors hover:bg-neutral-800 ${className}`}
    >
      Send request
    </button>
  );
}
