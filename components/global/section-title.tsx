interface SectionTitleProps {
  title: string;
  count?: number;
  countLabel?: string;
}

export default function SectionTitle({
  title,
  count,
  countLabel,
}: SectionTitleProps) {
  return (
    <h2 className="text-xl font-ortank font-bold mb-4 pb-2 border-b border-neutral-200">
      {title}
      {count !== undefined &&
        countLabel &&
        ` (${count} ${countLabel})`}
    </h2>
  );
}
