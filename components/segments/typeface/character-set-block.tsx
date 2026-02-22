"use client";

import type { CharacterSetBlockData } from "@/types/layout-typeface";

export default function TypefaceCharacterSetBlock({
  data,
  displayFontFamily,
}: {
  data?: CharacterSetBlockData;
  displayFontFamily?: string;
}) {
  if (!data?.sampleText?.trim()) return null;

  const sectionStyle: React.CSSProperties = {};
  if (data.backgroundColor)
    sectionStyle.backgroundColor = data.backgroundColor;
  if (data.fontColor) sectionStyle.color = data.fontColor;
  if (displayFontFamily)
    sectionStyle.fontFamily = displayFontFamily;

  return (
    <section
      className="relative my-20 flex w-full flex-col px-24 py-12"
      id="character-set"
      style={sectionStyle}
    >
      <h3 className="mb-6 font-black font-ortank text-2xl text-black">
        Character set
      </h3>
      <p className="whitespace-pre-wrap font-whisper text-2xl leading-relaxed">
        {data.sampleText}
      </p>
    </section>
  );
}
