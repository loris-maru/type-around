"use client";

import Image from "next/image";
import DesignerCard from "@/components/molecules/cards/designers";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import type { Designer } from "@/types/studio";

export default function StudioProfile({
  image,
  families,
  fonts,
  description,
  designers = [],
}: {
  image: string;
  families: number;
  fonts: number;
  description: string;
  designers?: Designer[];
}) {
  const { displayFontFamily, textFontFamily } =
    useStudioFonts();

  return (
    <section
      className="relative my-32 flex w-full flex-col gap-y-10 px-56"
      id="about"
    >
      <div className="relative flex w-full items-stretch gap-x-12">
        <div className="relative w-1/3 shrink-0 overflow-hidden rounded-lg border border-black shadow-button">
          <Image
            src={image}
            alt="Studio Profile"
            width={900}
            height={900}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="relative w-2/3">
          <header
            className="relative flex flex-row items-center justify-between gap-2"
            style={{ fontFamily: displayFontFamily }}
          >
            <div>About our studio</div>
            <div>{families} familes</div>
            <div>{fonts} fonts</div>
          </header>
          <div className="relative my-4 h-px w-full bg-neutral-300" />
          <p
            className="relative font-normal text-xl leading-relaxed"
            style={{ fontFamily: textFontFamily }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Designers */}
      {designers.length > 0 && (
        <div className="relative mb-32 grid w-full grid-cols-2 gap-6">
          {designers.map((designer) => (
            <DesignerCard
              key={
                designer.id ||
                `${designer.firstName}-${designer.lastName}`
              }
              designer={designer}
            />
          ))}
        </div>
      )}
    </section>
  );
}
