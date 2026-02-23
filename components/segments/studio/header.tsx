"use client";

import { useStudioFonts } from "@/contexts/studio-fonts-context";

export default function StudioHeader({
  gradient,
  studioName,
}: {
  gradient: string[];
  studioName: string;
}) {
  const { displayFontFamily } = useStudioFonts();

  const gradientStyle = {
    background: `linear-gradient(180deg, ${gradient[0]} 29.33%, ${gradient[1]} 100%)`,
  };

  return (
    <div
      className="relative flex h-screen w-full items-center justify-center"
      style={gradientStyle}
    >
      <div className="flex flex-col items-center">
        <h2
          className="text-base text-medium uppercase tracking-[4px] lg:text-xl"
          style={{ fontFamily: displayFontFamily }}
        >
          Studio
        </h2>
        <h1
          className="text-center font-black text-[60px] text-black leading-[1.3] lg:text-[270px]"
          style={{ fontFamily: displayFontFamily }}
        >
          {studioName}
        </h1>
      </div>
    </div>
  );
}
