"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ComponentType } from "react";
import AccountInformation from "./information";
import AccountStudioPage from "./studio-page";
import AccountTypefaces from "./typefaces";
import AccountFontsInUse from "./fonts-in-use";
import AccountStripe from "./stripe";
import AccountSettings from "./settings";

const DEFAULT_NAV = "about";

const NAV_COMPONENTS: Record<string, ComponentType> = {
  about: AccountInformation,
  "studio-page": AccountStudioPage,
  typefaces: AccountTypefaces,
  "fonts-in-use": AccountFontsInUse,
  stripe: AccountStripe,
  settings: AccountSettings,
};

function AccountContent() {
  const searchParams = useSearchParams();
  const nav = searchParams.get("nav") || DEFAULT_NAV;

  const Component =
    NAV_COMPONENTS[nav] ?? NAV_COMPONENTS[DEFAULT_NAV];

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
