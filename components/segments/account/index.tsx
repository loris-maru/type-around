"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import { Suspense } from "react";
import { DEFAULT_ACCOUNT_NAV } from "@/constant/UI_LAYOUT";
import AccountFeedback from "./feedback";
import AccountFontsInUse from "./fonts-in-use";
import AccountInformation from "./information";
import AccountReviewerCalendar from "./reviewer/calendar";
import AccountReviewerRequest from "./reviewer/request";

const AccountPayments = dynamic(
  () => import("./payments"),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex w-full items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      </div>
    ),
  }
);

import AccountStudioPage from "./studio-page";
import AccountTypefaces from "./typefaces";
import TypefaceDetail from "./typefaces/typeface-detail";

const AccountMembers = dynamic(() => import("./settings"), {
  ssr: false,
  loading: () => (
    <div className="relative flex w-full items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
    </div>
  ),
});

const NAV_COMPONENTS: Record<string, ComponentType> = {
  about: AccountInformation,
  "studio-page": AccountStudioPage,
  members: AccountMembers,
  // Legacy: redirect to members, but map here so content shows correctly before redirect
  settings: AccountMembers,
  designers: AccountMembers,
  typefaces: AccountTypefaces,
  feedback: AccountFeedback,
  "fonts-in-use": AccountFontsInUse,
  payments: AccountPayments,
  stripe: AccountPayments,
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
