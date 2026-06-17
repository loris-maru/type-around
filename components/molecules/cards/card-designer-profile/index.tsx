"use client";

import Image from "next/image";
import { useState } from "react";
import { RiArrowRightUpLongFill } from "react-icons/ri";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import type { Designer } from "@/types/studio";
import Link from "next/link";

export type DesignerCardProfileProps = {
  designer: Designer;
};

export default function DesignerCardProfile({
  designer,
}: DesignerCardProfileProps) {
  const { textFontFamily } = useStudioFonts();
  const [imgError, setImgError] = useState(false);

  if (!designer || typeof designer !== "object")
    return null;

  const fullName =
    `${designer.firstName ?? ""} ${designer.lastName ?? ""}`.trim();

  const avatarSrc =
    designer.avatar &&
    typeof designer.avatar === "string" &&
    designer.avatar.trim()
      ? designer.avatar.trim()
      : null;

  const showImage = avatarSrc !== null && !imgError;

  // Collect all links: website first, then social media
  const links: { name: string; url: string }[] = [
    ...(designer.website
      ? [{ name: "Website", url: designer.website }]
      : []),
    ...(Array.isArray(designer.socialMedia)
      ? designer.socialMedia.filter(
          (sm) =>
            sm != null && typeof sm === "object" && sm.url
        )
      : []),
  ];

  return (
    <div
      className="grid grid-cols-3 gap-0"
      style={{ fontFamily: textFontFamily }}
    >
      {/* ── Col 1: square avatar ── */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
        {showImage ? (
          <Image
            src={avatarSrc}
            alt={fullName}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-bold text-2xl text-neutral-400">
            {(designer.firstName ?? "").charAt(0)}
            {(designer.lastName ?? "").charAt(0)}
          </div>
        )}
      </div>

      {/* ── Cols 2–3: name, bio, links ── */}
      <div className="col-span-2 flex flex-col justify-between rounded-xl border border-neutral-200 p-5">
        {/* Top: name + biography */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-2xl text-black leading-tight">
            {fullName}
          </h3>
          {designer.biography && (
            <p className="text-base text-neutral-700 leading-relaxed">
              {designer.biography}
            </p>
          )}
        </div>

        {/* Bottom: social links */}
        {links.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${fullName} on ${link.name}`}
                  className="flex items-center justify-between text-neutral-500 transition-colors hover:text-black pb-5 border-b border-neutral-200"
                >
                  <span
                    className="text-sm uppercase"
                    style={{ letterSpacing: "2px" }}
                  >
                    {link.name}
                  </span>
                  <RiArrowRightUpLongFill className="h-3.5 w-3.5 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
