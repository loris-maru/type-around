"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";
import { TypefaceCardAccount } from "@/components/molecules/cards";
import { DEFAULT_TYPEFACE_SUBSECTION } from "@/constant/TYPEFACE_SECTIONS";
import { useStudio } from "@/hooks/use-studio";
import AccountPageHeader from "../page-header";
import AddTypeface from "./add-typeface";

export default function AccountTypefaces() {
  const { studio, isLoading, addTypeface } = useStudio();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleTypefaceClick = useCallback(
    (typefaceSlug: string) => {
      const params = new URLSearchParams(
        searchParams.toString()
      );
      params.set("nav", "typefaces");
      params.set("typeface", typefaceSlug);
      params.set("subsection", DEFAULT_TYPEFACE_SUBSECTION);
      params.delete("section");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const typefaces = studio?.typefaces || [];

  if (isLoading) {
    return (
      <div className="relative w-full">
        <AccountPageHeader
          eyebrow="04 Typefaces"
          title="Typefaces"
        />
        <div className="swiss-label text-neutral-400">
          Loading
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <AccountPageHeader
        eyebrow="04 Typefaces"
        title="Typefaces"
        description="Every type family published by the studio. Open one to edit its fonts, packages, character set, EULA, specimen and page."
        actions={
          <div className="flex flex-col items-end">
            <span className="swiss-label text-neutral-500">
              Total
            </span>
            <span className="swiss-num text-5xl leading-none">
              {typefaces.length}
            </span>
          </div>
        }
      />
      <div className="relative grid w-full grid-cols-3 gap-6">
        {typefaces.map((typeface, typefaceIndex) => (
          <TypefaceCardAccount
            key={typeface.id}
            typeface={typeface}
            index={typefaceIndex + 1}
            onClick={() =>
              handleTypefaceClick(typeface.slug)
            }
          />
        ))}
        <AddTypeface
          studio={studio}
          onAddTypeface={addTypeface}
        />
      </div>
    </div>
  );
}
