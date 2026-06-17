import { DesignerCardProfile } from "@/components/molecules/cards";
import type { Designer } from "@/types/studio";
import { cn } from "@/utils/class-names";
import Image from "next/image";

export default function StudioAboutDesignerProfilesBlock({
  designersList,
  textFontFamily,
  designerTextClass,
}: {
  designersList: Designer[];
  textFontFamily: string;
  designerTextClass: string;
}) {
  return (
    <div
      className="grid grid-cols-2 mt-32"
      style={{ fontFamily: textFontFamily }}
    >
      {/* Bilingual header */}
      <div
        className="flex h-full justify-center items-center col-span-1"
        style={{ fontFamily: textFontFamily }}
      >
        {/* Left: English */}
        <div className={designerTextClass}>
          <div>The</div>
          <div>Designers</div>
        </div>

        {/* Centre: diagonal divider */}
        <Image
          src="/svg/diagonal_divider.svg"
          className="scale-75 origin-center"
          alt=""
          width={46}
          height={46}
          aria-hidden="true"
        />

        {/* Right: Korean */}
        <div className={cn(designerTextClass, "text-left")}>
          <div>그</div>
          <div>디자이너들</div>
        </div>
      </div>

      {/* Designer cards */}
      <div className="col-span-1 flex flex-col py-20 gap-5">
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
    </div>
  );
}
