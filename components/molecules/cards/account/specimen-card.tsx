"use client";

import Link from "next/link";
import { RiFileCopy2Line } from "react-icons/ri";
import type { SpecimenCardProps } from "@/types/components";

function formatSpecimenDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SpecimenCard({
  specimen,
  studioId,
}: SpecimenCardProps) {
  const pageCount = specimen.pages?.length ?? 0;
  const lastUpdate = formatSpecimenDate(specimen.createdAt);

  const gradientBoxStyle = {
    background: `linear-gradient(39deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)`,
  };

  return (
    <Link
      href={`/account/${studioId}/specimen/${specimen.id}`}
      className="hover-card-lift flex h-[200px] flex-col justify-between rounded-lg border border-neutral-300 bg-transparent p-4"
    >
      <header className="flex w-full flex-col gap-y-2">
        <div className="font-bold font-ortank text-black text-lg">
          {specimen.name}
        </div>
        <div
          className="h-24 w-full rounded-md"
          style={gradientBoxStyle}
        />
      </header>
      <div className="flex flex-row items-center justify-between font-whisper text-neutral-600 text-xs">
        <div className="flex flex-row gap-x-1">
          <RiFileCopy2Line className="h-4 w-4 text-neutral-600" />{" "}
          {pageCount} page
          {pageCount !== 1 ? "s" : ""}
        </div>
        <div>Updated {lastUpdate}</div>
      </div>
    </Link>
  );
}
