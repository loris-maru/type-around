import type { SectionTitleProps } from "@/types/components";

export default function SectionTitle({
  title,
  count,
  countLabel,
}: SectionTitleProps) {
  return (
    <h2 className="swiss-rule mb-6 flex items-baseline gap-4 pt-3">
      <span className="swiss-h2">{title}</span>
      {count !== undefined && countLabel && (
        <span className="swiss-label text-neutral-500">
          {count} {countLabel}
        </span>
      )}
    </h2>
  );
}
