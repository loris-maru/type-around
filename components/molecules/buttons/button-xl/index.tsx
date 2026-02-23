import Link from "next/link";

export default function ButtonXL({
  href,
  label,
  width = "100%",
}: {
  href: string;
  label: string;
  width?: string;
}) {
  return (
    <Link
      href={href}
      className="button-shadow relative rounded-lg border border-black bg-light-gray px-12 py-6 text-center text-black text-xl transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1"
      style={{ width }}
    >
      {label}
    </Link>
  );
}
