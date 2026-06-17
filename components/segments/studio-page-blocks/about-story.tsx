import RichTextContent from "@/components/global/rich-text/rich-text-content";
import { cn } from "@/utils/class-names";
import Image from "next/image";

export default function StudioAboutStoryBlock({
  image,
  description,
  textFontFamily,
  textSizeClass,
  textAlignClass,
  name,
}: {
  image: string;
  description: string;
  textFontFamily: string;
  textSizeClass?: string;
  textAlignClass?: string;
  marginValue?: string;
  name: string;
}) {
  return (
    <div className="grid w-full grid-cols-2">
      {/* Left: image 5:4 */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "5/4" }}
      >
        {image?.trim() ? (
          <Image
            src={image.trim()}
            alt={`${name} studio`}
            fill
            className="object-cover"
            sizes="50vw"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-neutral-200"
            style={{ fontFamily: textFontFamily }}
          >
            <span className="font-black text-4xl text-neutral-400">
              Studio
            </span>
          </div>
        )}
      </div>

      {/* Right: white bg, flex-col justify-between */}
      <div
        className="flex aspect-5/4 flex-col justify-between bg-white p-10 text-black"
        style={{ fontFamily: textFontFamily }}
      >
        <h2 className="font-bold text-sm uppercase tracking-wider">
          About {name}
        </h2>

        {description?.trim() ? (
          <RichTextContent
            content={description}
            className={cn(
              "leading-[1.6] text-black",
              textSizeClass || "text-2xl",
              textAlignClass
            )}
            style={{ fontFamily: textFontFamily }}
          />
        ) : null}
      </div>
    </div>
  );
}
