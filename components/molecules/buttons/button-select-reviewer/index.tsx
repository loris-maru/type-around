"use client";

type ButtonSelectReviewerProps = {
  children: React.ReactNode;
  onSelect: () => void;
};

export default function ButtonSelectReviewer({
  children,
  onSelect,
}: ButtonSelectReviewerProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full cursor-pointer items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 text-left transition-colors hover:border-neutral-400 hover:bg-neutral-50"
    >
      {children}
    </button>
  );
}
