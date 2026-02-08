"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import AccountInformation from "./information";
import AccountStudioPage from "./studio-page";
import AccountDesigners from "./designers";
import AccountTypefaces from "./typefaces";
import AccountFontsInUse from "./fonts-in-use";
import AccountStripe from "./stripe";
import AccountSettings from "./settings";
import TypefaceDetail from "./typefaces/typeface-detail";
import { DEFAULT_ACCOUNT_NAV } from "@/constant/UI_LAYOUT";

const NAV_COMPONENTS: Record<string, ComponentType> = {
  about: AccountInformation,
  "studio-page": AccountStudioPage,
  designers: AccountDesigners,
  typefaces: AccountTypefaces,
  "fonts-in-use": AccountFontsInUse,
  stripe: AccountStripe,
  settings: AccountSettings,
};

function AccountContent() {
  const searchParams = useSearchParams();
  const nav =
    searchParams.get("nav") || DEFAULT_ACCOUNT_NAV;
  const typefaceSlug = searchParams.get("typeface");

  if (nav === "typefaces" && typefaceSlug) {
    return <TypefaceDetail typefaceSlug={typefaceSlug} />;
  }

  const Component =
    NAV_COMPONENTS[nav] ??
    NAV_COMPONENTS[DEFAULT_ACCOUNT_NAV];

  return <Component />;
}

export default function Account() {
  return (
    <div className="relative w-full min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <AccountContent />
      </Suspense>
    </div>
  );
}
