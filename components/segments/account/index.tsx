"use client";

import { useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import { Suspense } from "react";
import { DEFAULT_ACCOUNT_NAV } from "@/constant/UI_LAYOUT";
import AccountDesigners from "./designers";
import AccountFeedback from "./feedback";
import AccountFontsInUse from "./fonts-in-use";
import AccountInformation from "./information";
import AccountReviewerCalendar from "./reviewer/calendar";
import AccountReviewerRequest from "./reviewer/request";
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
  feedback: AccountFeedback,
  "fonts-in-use": AccountFontsInUse,
  stripe: AccountStripe,
  settings: AccountSettings,
};

const REVIEWER_COMPONENTS: Record<string, ComponentType> = {
  calendar: AccountReviewerCalendar,
  request: AccountReviewerRequest,
};

function AccountContent() {
  const searchParams = useSearchParams();
  const nav =
    searchParams.get("nav") || DEFAULT_ACCOUNT_NAV;
  const typefaceSlug = searchParams.get("typeface");
  const reviewerSection = searchParams.get("reviewer");

  if (nav === "typefaces" && typefaceSlug) {
    return <TypefaceDetail typefaceSlug={typefaceSlug} />;
  }

  if (nav === "reviewer") {
    const ReviewerComponent =
      REVIEWER_COMPONENTS[reviewerSection ?? "calendar"] ??
      AccountReviewerCalendar;
    return <ReviewerComponent />;
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
