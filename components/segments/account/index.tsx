"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import { Suspense } from "react";
import { DEFAULT_ACCOUNT_NAV } from "@/constant/UI_LAYOUT";
import AccountDesigners from "./designers";
import AccountFontsInUse from "./fonts-in-use";
import AccountInformation from "./information";
import AccountSettings from "./settings";
import AccountStripe from "./stripe";
import AccountStudioPage from "./studio-page";
import AccountTypefaces from "./typefaces";
import TypefaceDetail from "./typefaces/typeface-detail";

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
    <div className="relative min-h-screen w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <AccountContent />
      </Suspense>
    </div>
  );
}
