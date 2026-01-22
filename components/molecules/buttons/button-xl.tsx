import Link from "next/link";

export default function ButtonXL({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="relative border border-black rounded-lg text-black bg-foreground px-12 py-6"
      style={{ boxShadow: "var(--shadow-button)" }}
    >
      {label}
    </Link>
  );
}
