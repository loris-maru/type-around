"use client";

type SaveErrorPillProps = {
  message: string;
  onRetry: () => void;
};

export default function SaveErrorPill({
  message,
  onRetry,
}: SaveErrorPillProps) {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-2xl bg-red-100 px-4 py-3 font-whisper text-red-800 text-sm">
      <span>{message}</span>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-red-200 px-3 py-1 font-medium hover:bg-red-300"
      >
        Retry
      </button>
    </div>
  );
}
