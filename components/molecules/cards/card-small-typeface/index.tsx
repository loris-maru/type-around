"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SmallTypefaceCard({
  url,
  name,
  icon,
  category,
  weights,
  glyphs,
  titleFontUrl,
  textFontUrl,
}: {
  url: string;
  name: string;
  icon: string;
  category: string;
  weights: number;
  glyphs: number;
  titleFontUrl?: string;
  textFontUrl?: string;
}) {
  const [titleFontFamily, setTitleFontFamily] =
    useState("");
  const [textFontFamily, setTextFontFamily] = useState("");

  useEffect(() => {
    if (!titleFontUrl) return;
    let cancelled = false;
    const familyName = `stc-title-${name}`;
    const existing = Array.from(document.fonts).find(
      (f) => f.family === familyName
    );
    if (existing) {
      queueMicrotask(() => {
        if (!cancelled) setTitleFontFamily(familyName);
      });
      return () => {
        cancelled = true;
      };
    }
    const face = new FontFace(
      familyName,
      `url(${titleFontUrl})`,
      {
        weight: "100 900",
        style: "normal",
      }
    );
    face
      .load()
      .then((loaded) => {
        if (cancelled) return;
        document.fonts.add(loaded);
        setTitleFontFamily(familyName);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [titleFontUrl, name]);

  useEffect(() => {
    if (!textFontUrl) return;
    let cancelled = false;
    const familyName = `stc-text-${name}`;
    const existing = Array.from(document.fonts).find(
      (f) => f.family === familyName
    );
    if (existing) {
      queueMicrotask(() => {
        if (!cancelled) setTextFontFamily(familyName);
      });
      return () => {
        cancelled = true;
      };
    }
    const face = new FontFace(
      familyName,
      `url(${textFontUrl})`,
      {
        weight: "100 900",
        style: "normal",
      }
    );
    face
      .load()
      .then((loaded) => {
        if (cancelled) return;
        document.fonts.add(loaded);
        setTextFontFamily(familyName);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [textFontUrl, name]);

  return (
    <Link
      href={url}
      className="relative flex flex-col justify-between rounded-xl border border-neutral-300 p-5"
    >
      <div
        className="mb-8 text-base text-black"
        style={{
          fontFamily: titleFontFamily
            ? `"${titleFontFamily}", var(--font-whisper)`
            : "var(--font-whisper)",
        }}
      >
        Discover more
      </div>

      <div className="relative flex w-full flex-row flex-nowrap">
        <div className="w-[40%] overflow-hidden">
          {icon?.trim() ? (
            <Image
              src={icon.trim()}
              alt={name}
              width={100}
              height={100}
              className="h-auto w-full object-cover"
            />
          ) : (
            <div className="flex h-[100px] w-full items-center justify-center bg-neutral-200">
              <span className="font-black font-ortank text-2xl text-neutral-400">
                {name.charAt(0) || "?"}
              </span>
            </div>
          )}
        </div>
        <aside
          className="w-[60%] pl-5 text-black"
          style={{
            fontFamily: textFontFamily
              ? `"${textFontFamily}", var(--font-whisper)`
              : "var(--font-whisper)",
          }}
        >
          <div className="mb-3 font-black text-xl capitalize">
            {name}
          </div>
          <div className="flex flex-col gap-y-1 font-normal text-sm">
            <div>{category}</div>
            <div className="my-0.5 block h-px w-full bg-neutral-300" />
            <div>{weights} weights</div>
            <div className="my-0.5 block h-px w-full bg-neutral-300" />
            <div>{glyphs} glyphs</div>
          </div>
        </aside>
      </div>
    </Link>
  );
}
