"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";
import { TypefaceCard } from "@/components/molecules/cards/account";
import { useStudio } from "@/hooks/use-studio";
import AddTypeface from "./typefaces/add-typeface";

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
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const typefaces = studio?.typefaces || [];

  if (isLoading) {
    return (
      <div className="relative w-full">
        <div className="mb-4 font-medium text-base text-neutral-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="mb-4 font-medium text-base text-neutral-500">
        Total typefaces: {typefaces.length}
      </div>
      <div className="relative grid w-full grid-cols-3 gap-6">
        {typefaces.map((typeface) => (
          <TypefaceCard
            key={typeface.id}
            typeface={typeface}
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
