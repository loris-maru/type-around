"use client";

type SaveErrorPillProps = {
  message: string;
  onRetry: () => void;
  className?: string;
};

export default function SaveErrorPill({
  message,
  onRetry,
  className = "bottom-28",
}: SaveErrorPillProps) {
  return (
    <div
      role="alert"
      className={`fixed right-6 z-50 flex items-center gap-4 border border-swiss-red bg-white py-2 pr-2 pl-4 font-sotto text-sm text-swiss-red ${className}`}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onRetry}
        className="swiss-btn swiss-btn-red min-h-9 px-4"
      >
        Retry
      </button>
    </div>
  );
}
