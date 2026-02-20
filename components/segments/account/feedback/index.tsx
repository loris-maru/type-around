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
        <h1 className="font-bold font-ortank text-2xl text-neutral-800">
          Feedback
        </h1>
        <p className="mt-2 font-whisper text-neutral-600 text-sm">
          Request feedback on your typeface from a designer.
        </p>

        {typefaces.length > 0 && (
          <div className="mt-6 w-full rounded-lg border border-neutral-200 px-4 py-3">
            <div className="flex w-full flex-row justify-between">
              {FEEDBACK_STEPS.map((s) => (
                <div
                  key={s.num}
                  className={cn(
                    "flex items-center gap-2 font-whisper text-sm",
                    step === s.num
                      ? "font-semibold text-black"
                      : step > s.num
                        ? "text-neutral-500"
                        : "text-neutral-400"
                  )}
                >
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
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
