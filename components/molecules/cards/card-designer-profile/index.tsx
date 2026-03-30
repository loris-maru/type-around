"use client";

import Image from "next/image";
import { RiGlobalLine } from "react-icons/ri";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import type { Designer } from "@/types/studio";

export type DesignerCardProfileProps = {
  designer: Designer;
};

export default function DesignerCardProfile({
  designer,
}: DesignerCardProfileProps) {
  const { displayFontFamily, textFontFamily } =
    useStudioFonts();

  if (!designer || typeof designer !== "object")
    return null;

  const fullName =
    `${designer.firstName ?? ""} ${designer.lastName ?? ""}`.trim();

  return (
    <div className="flex items-start gap-5 rounded-lg border border-neutral-300 bg-transparent p-5">
      {/* Avatar */}
      <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-100 lg:block">
        {designer.avatar ? (
          <Image
            src={designer.avatar}
            alt={fullName}
            width={64}
            height={64}
            className="h-full w-full object-cover"
            unoptimized={
              designer.avatar.startsWith("data:") ||
              designer.avatar.includes("firebasestorage")
            }
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-bold text-neutral-400 text-xl lg:text-lg"
            style={{ fontFamily: displayFontFamily }}
          >
            {(designer.firstName ?? "").charAt(0)}
            {(designer.lastName ?? "").charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3
          className="font-bold text-2xl! text-black"
          style={{ fontFamily: displayFontFamily }}
        >
          {fullName}
        </h3>

        {designer.biography && (
          <p
            className="line-clamp-3 font-normal text-base text-black leading-relaxed lg:text-sm"
            style={{ fontFamily: textFontFamily }}
          >
            {designer.biography}
          </p>
        )}

        {/* Links */}
        <div
          className="mt-1 flex flex-wrap items-center gap-3"
          style={{ fontFamily: textFontFamily }}
        >
          {designer.website && (
            <a
              href={designer.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${fullName}'s website`}
              className="flex items-center gap-1 text-neutral-700 text-sm transition-colors hover:text-black lg:text-neutral-500 lg:text-xs"
            >
              <RiGlobalLine size={14} />
              <span>Website</span>
            </a>
          )}

          {(() => {
            const raw = designer?.socialMedia;
            const smList = Array.isArray(raw)
              ? Array.from(raw)
              : [];
            const safeList = Array.isArray(smList)
              ? smList
              : [];
            return safeList
              .filter(
                (sm) => sm != null && typeof sm === "object"
              )
              .map((sm) => (
                <a
                  key={sm.name}
                  href={sm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${fullName} on ${sm?.name ?? "social"}`}
                  className="text-neutral-500 text-xs capitalize transition-colors hover:text-black"
                >
                  {sm?.name ?? ""}
                </a>
              ));
          })()}
        </div>
      </div>
    </div>
  );
}
