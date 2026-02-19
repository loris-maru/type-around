import Link from "next/link";
import type { BackToTypefaceLinkProps } from "@/types/specimen";

export default function BackToTypefaceLink({
  studioId,
  typefaceSlug,
}: BackToTypefaceLinkProps) {
  return (
    <Link
      href={`/account/${studioId}?nav=typefaces&typeface=${typefaceSlug}`}
      className="flex h-10 shrink-0 items-center rounded-lg border border-neutral-300 bg-white px-4 font-whisper text-sm transition-colors hover:border-black hover:bg-neutral-50"
    >
      ← Back to typeface
    </Link>
  );
}
