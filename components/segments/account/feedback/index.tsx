"use client";

import { useCallback, useMemo, useState } from "react";
import {
  FEEDBACK_DEFAULT_GRADIENT,
  FEEDBACK_STEPS,
} from "@/constant/FEEDBACK";
import type { FeedbackReviewer } from "@/constant/FEEDBACK_REVIEWERS";
import { FEEDBACK_REVIEWERS } from "@/constant/FEEDBACK_REVIEWERS";
import { useStudio } from "@/hooks/use-studio";
import type { StudioMember } from "@/types/studio";
import { cn } from "@/utils/class-names";
import FeedbackForm from "./feedback-form";
import AccountPageHeader from "../page-header";

function membersToReviewers(
  members: StudioMember[]
): FeedbackReviewer[] {
  return members
    .filter((m) => m.isReviewer === true)
    .map((m, i) => ({
      id: m.id,
      firstName: m.firstName || "",
      lastName: m.lastName || "",
      gradient:
        FEEDBACK_REVIEWERS[i % FEEDBACK_REVIEWERS.length]
          ?.gradient ?? FEEDBACK_DEFAULT_GRADIENT,
    }));
}

export default function AccountFeedback() {
  const { studio } = useStudio();
  const [step, setStep] = useState(1);

  const typefaces = useMemo(
    () => studio?.typefaces ?? [],
    [studio?.typefaces]
  );

  const reviewers = useMemo(
    () => membersToReviewers(studio?.members ?? []),
    [studio?.members]
  );

  const onStepChange = useCallback((s: number) => {
    setStep(s);
  }, []);

  return (
    <div className="relative flex w-full flex-col gap-y-12 pb-20">
      <div>
        <AccountPageHeader
          eyebrow="07 Feedback"
          title="Feedback"
          description="Request feedback on your typeface from a designer."
        />

        {typefaces.length > 0 && (
          <ol className="swiss-rule grid w-full grid-cols-12 gap-x-6 pt-3">
            {FEEDBACK_STEPS.map((s) => (
              <li
                key={s.num}
                className={cn(
                  "col-span-3 flex items-baseline gap-3 py-1",
                  step === s.num
                    ? "text-black"
                    : step > s.num
                      ? "text-neutral-500"
                      : "text-neutral-400"
                )}
              >
                <span
                  className={cn(
                    "swiss-num text-xs",
                    step === s.num && "text-swiss-red"
                  )}
                >
                  {String(s.num).padStart(2, "0")}
                </span>
                <span className="swiss-label">
                  {s.label}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <FeedbackForm
        studioId={studio?.id ?? ""}
        studioName={studio?.name ?? ""}
        typefaces={typefaces}
        reviewers={reviewers}
        step={step}
        onStepChange={onStepChange}
      />
    </div>
  );
}
