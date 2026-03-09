import Link from "next/link";

export default function LinksList({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <div className="relative flex flex-col gap-y-4 rounded-lg border border-neutral-300 p-5 lg:gap-y-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="whitespace-nowrap font-whisper text-black text-xl lg:text-base"
          suppressHydrationWarning
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
