import Link from "next/link";

export default function LinksList({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <div className="relative flex flex-col gap-y-2 p-5 rounded-lg border border-neutral-300">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="font-whisper text-black text-base whitespace-nowrap"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
