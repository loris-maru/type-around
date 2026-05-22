"use client";

import Image from "next/image";
import { useState } from "react";
import { RiEyeLine } from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import InputLanguageSelect from "@/components/global/inputs/input-language-select";
import InputNumber from "@/components/global/inputs/input-number";
import {
  RELEASE_YEAR_MAX,
  RELEASE_YEAR_MIN,
} from "@/constant/RELEASE_YEAR_BOUNDS";
import InputText from "@/components/global/inputs/input-text";
import TagInput from "@/components/global/tag-input";
import TiptapEditor from "@/components/TiptapEditor";
import type { BasicInformationSectionProps } from "@/types/components";
import FontSelector from "../font-selector";
import FontLineText from "./font-line-text";
import TypefaceVisionBlock from "./typeface-vision-block";

type ExamplePreviewTooltipProps = {
  imageSrc: string;
  imageAlt: string;
  ariaLabel: string;
};

function ExamplePreviewTooltip({
  imageSrc,
  imageAlt,
  ariaLabel,
}: ExamplePreviewTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: wrapper keeps tooltip visible when hovering image
    <span
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        className="flex cursor-pointer items-center justify-center rounded p-1 transition-colors hover:bg-neutral-100"
      >
        <RiEyeLine className="h-5 w-5 text-neutral-500" />
      </button>
      {isVisible && (
        <div
          className="absolute right-0 bottom-full z-100 mb-2 flex items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white p-2 shadow-xl"
          style={{
            width: 500,
            minWidth: 500,
            height: 400,
            minHeight: 400,
            aspectRatio: "5/4",
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={500}
            height={400}
            className="h-full w-auto rounded object-contain"
            unoptimized
          />
        </div>
      )}
    </span>
  );
}

export default function BasicInformationSection({
  name,
  hangeulName,
  categories,
  characters,
  releaseDate,
  description,
  supportedLanguages,
  typefaceVision,
  onInputChange,
  onCategoriesChange,
  onLanguagesChange,
  onTypefaceVisionChange,
  fonts,
  displayFontId,
  fontLineText,
  onDisplayFontChange,
  typefaceCardDisplayFontId,
  typefaceCardContent,
  onTypefaceCardDisplayFontChange,
}: BasicInformationSectionProps) {
  return (
    <CollapsibleSection title="Information">
      <div className="flex flex-col gap-y-8">
        <div className="grid grid-cols-2 gap-4">
          <InputText
            label="Latin Name"
            name="name"
            value={name}
            onChange={onInputChange}
            required
          />
          <InputText
            label="Hangeul Name"
            name="hangeulName"
            value={hangeulName}
            onChange={onInputChange}
          />
        </div>

        <TagInput
          label="Categories"
          value={categories}
          onChange={onCategoriesChange}
          placeholder="Type a category and press Enter..."
        />

        <div className="grid grid-cols-2 gap-4">
          <InputNumber
            label="Characters"
            name="characters"
            value={characters}
            onChange={onInputChange}
            min={0}
          />
          <InputNumber
            label="Release year"
            name="releaseDate"
            value={releaseDate}
            onChange={onInputChange}
            min={RELEASE_YEAR_MIN}
            max={RELEASE_YEAR_MAX}
            placeholder="e.g. 2024"
          />
        </div>

        <TiptapEditor
          label="Description"
          value={description}
          onChange={(value) =>
            onInputChange({
              target: {
                name: "description",
                value,
              },
            } as React.ChangeEvent<HTMLTextAreaElement>)
          }
        />

        <InputLanguageSelect
          label="Supported Languages"
          value={supportedLanguages}
          onChange={onLanguagesChange}
          placeholder="Type to search languages..."
          theme="light"
        />

        <TypefaceVisionBlock
          usage={typefaceVision.usage}
          contrast={typefaceVision.contrast}
          width={typefaceVision.width}
          playful={typefaceVision.playful}
          frame={typefaceVision.frame}
          serif={typefaceVision.serif}
          onUsageChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              usage: v.join(", "),
            })
          }
          onContrastChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              contrast: v.join(", "),
            })
          }
          onWidthChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              width: v.join(", "),
            })
          }
          onPlayfulChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              playful: v.join(", "),
            })
          }
          onFrameChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              frame: v.join(", "),
            })
          }
          onSerifChange={(v) =>
            onTypefaceVisionChange({
              ...typefaceVision,
              serif: v.join(", "),
            })
          }
        />

        {fonts.length > 0 && (
          <div className="grid grid-cols-2 gap-5">
            {/* Font line */}
            <div className="flex flex-col gap-4 rounded-lg border border-neutral-300 p-8">
              <div className="text-black">
                <header className="relative flex flex-row items-center justify-between">
                  <div className="font-bold font-ortank text-xl">
                    Font line
                  </div>
                  <ExamplePreviewTooltip
                    imageSrc="/images/example-font-line.png"
                    imageAlt="Font line example"
                    ariaLabel="Font line example preview"
                  />
                </header>
                <p className="font-whisper text-neutral-500 text-sm">
                  Setup the font line that will serve as a
                  presentation text for your typeface.
                </p>
              </div>
              <FontSelector
                fonts={fonts}
                displayFontId={displayFontId}
                onDisplayFontChange={onDisplayFontChange}
                selectedFont={
                  fonts.find(
                    (f) => f.id === displayFontId
                  ) ?? null
                }
              />
              <FontLineText
                fontLineText={fontLineText}
                onInputChange={onInputChange}
              />
            </div>

            {/* Typeface Card - displayed font and content for typeface card */}
            <div className="flex flex-col gap-4 rounded-lg border border-neutral-300 p-8">
              <div className="text-black">
                <header className="relative flex flex-row items-center justify-between">
                  <div className="font-bold font-ortank text-xl">
                    Typeface Card
                  </div>
                  <ExamplePreviewTooltip
                    imageSrc="/images/example-typeface-card.png"
                    imageAlt="Typeface card example"
                    ariaLabel="Typeface card example preview"
                  />
                </header>
                <p className="font-whisper text-neutral-500 text-sm">
                  Setup the displayed font and content for
                  the typeface card (e.g. on studio page).
                </p>
              </div>
              <FontSelector
                fonts={fonts}
                displayFontId={typefaceCardDisplayFontId}
                onDisplayFontChange={
                  onTypefaceCardDisplayFontChange
                }
                selectedFont={
                  fonts.find(
                    (f) =>
                      f.id === typefaceCardDisplayFontId
                  ) ?? null
                }
              />
              <div>
                <label
                  htmlFor="typefaceCardContent"
                  className="mb-1 block font-semibold font-whisper text-black text-sm"
                >
                  Content
                </label>
                <input
                  type="text"
                  id="typefaceCardContent"
                  name="typefaceCardContent"
                  value={typefaceCardContent}
                  onChange={onInputChange}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g., The quick brown fox jumps over the lazy dog"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}
