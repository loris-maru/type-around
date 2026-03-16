"use client";

import Image from "next/image";
import { DesignerCardProfile } from "@/components/molecules/cards";
import RichTextContent from "@/components/global/rich-text/rich-text-content";
import { useStudioFonts } from "@/contexts/studio-fonts-context";
import type { Designer } from "@/types/studio";
import { cn } from "@/utils/class-names";

export default function StudioProfile({
  image,
  families,
  fonts,
  description,
  designers = [],
  sectionStyle,
  textSizeClass,
  textAlignClass,
  defaultMargin = true,
}: {
  image: string;
  families: number;
  fonts: number;
  description: string;
  designers?: Designer[];
  sectionStyle?: React.CSSProperties;
  textSizeClass?: string;
  textAlignClass?: string;
  defaultMargin?: boolean;
}) {
  const { displayFontFamily, textFontFamily } =
    useStudioFonts();
  const designersList: Designer[] = (() => {
    const d = designers ?? [];
    return Array.isArray(d)
      ? d.filter(
          (x): x is Designer =>
            x != null && typeof x === "object"
        )
      : [];
  })();

  return (
    <section
      className={cn(
        "relative flex w-full flex-col gap-y-10 px-8 lg:px-56",
        defaultMargin ? "my-12 lg:my-32" : ""
      )}
      id="about"
      style={sectionStyle}
    >
      <div className="relative flex w-full flex-col items-stretch gap-x-12 gap-y-10 lg:flex-row lg:gap-x-12">
        <div className="relative h-[50vh] w-full shrink-0 overflow-hidden rounded-lg border border-black shadow-button lg:h-auto lg:w-1/3">
          {image?.trim() ? (
            <Image
              src={image.trim()}
              alt="Studio Profile"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-200">
              <span className="font-black font-ortank text-4xl text-neutral-400">
                Studio
              </span>
            </div>
          )}
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
          <RichTextContent
            content={description}
            className={cn(
              "relative font-normal leading-relaxed",
              textSizeClass || "text-xl",
              textAlignClass
            )}
            style={{ fontFamily: textFontFamily }}
          />
        </div>
      </div>

      {/* Designers */}
      {designersList.length > 0 && (
        <div className="relative mb-32 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          {designersList.map((designer) =>
            designer ? (
              <DesignerCardProfile
                key={
                  designer.id ??
                  `${designer.firstName ?? ""}-${designer.lastName ?? ""}`
                }
                designer={designer}
              />
            ) : null
          )}
        </div>
      )}
    </section>
  );
}
