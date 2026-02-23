"use client";

import Image from "next/image";
import { DesignerCardProfile } from "@/components/molecules/cards";
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
      className="relative my-12 flex w-full flex-col gap-y-10 px-8 lg:my-32 lg:px-56"
      id="about"
    >
      <div className="relative flex w-full flex-col items-stretch gap-x-12 gap-y-10 lg:flex-row lg:gap-x-12">
        <div className="relative h-[50vh] w-full shrink-0 overflow-hidden rounded-lg border border-black shadow-button lg:h-auto lg:w-1/3">
          <Image
            src={image}
            alt="Studio Profile"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </div>
        <div className="relative w-full lg:w-2/3">
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
        <div className="relative mb-32 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          {designers.map((designer) => (
            <DesignerCardProfile
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
