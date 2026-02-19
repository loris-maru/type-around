"use client";

import { RiFocus2Line } from "react-icons/ri";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import { useStudio } from "@/hooks/use-studio";
import type { CenterOnPageButtonProps } from "@/types/specimen";

export default function CenterOnPageButton({
  specimenId,
}: CenterOnPageButtonProps) {
  const { selectedPageId, requestCenterOnPage } =
    useSpecimenPage();
  const { studio } = useStudio();

  const specimen = studio?.specimens?.find(
    (s) => s.id === specimenId
  );
  const selectedPage = specimen?.pages?.find(
    (p) => p.id === selectedPageId
  );

  return (
    <button
      type="button"
      onClick={() =>
        selectedPageId &&
        selectedPageId !== "placeholder" &&
        requestCenterOnPage(selectedPageId)
      }
      disabled={
        !selectedPageId ||
        selectedPageId === "placeholder" ||
        !selectedPage
      }
      aria-label="Center workspace on selected page"
      className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-300 bg-white transition-colors hover:border-black hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RiFocus2Line className="h-5 w-5 text-neutral-600" />
    </button>
  );
}
