"use client";

import AccountPageHeader from "../page-header";

export default function AccountReviewerRequest() {
  return (
    <div className="relative flex w-full flex-col gap-y-12 pb-20">
      <AccountPageHeader
        eyebrow="Reviewer"
        title="Requests"
        description="View and manage incoming feedback requests."
      />

      <div className="swiss-rule-light py-10">
        <p className="swiss-label text-neutral-500">
          No feedback requests yet.
        </p>
      </div>
    </div>
  );
}
