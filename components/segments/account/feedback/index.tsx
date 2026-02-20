"use client";

import { useCallback, useMemo, useState } from "react";
import type { FeedbackReviewer } from "@/constant/FEEDBACK_REVIEWERS";
import { FEEDBACK_REVIEWERS } from "@/constant/FEEDBACK_REVIEWERS";
import { useStudio } from "@/hooks/use-studio";
import type { Designer } from "@/types/studio";
import { cn } from "@/utils/class-names";
import FeedbackForm from "./feedback-form";

const FEEDBACK_STEPS = [
  { num: 1, label: "Typeface & reviewer" },
  { num: 2, label: "Date & time" },
  { num: 3, label: "Comment & files" },
  { num: 4, label: "Confirmation" },
] as const;

function designersToReviewers(
  designers: Designer[]
): FeedbackReviewer[] {
  const reviewers = designers.filter((d) => d.isReviewer);
  if (reviewers.length === 0) return FEEDBACK_REVIEWERS;
  return reviewers.map((d, i) => ({
    id: d.id ?? `designer-${i}`,
    firstName: d.firstName,
    lastName: d.lastName,
    gradient:
      FEEDBACK_REVIEWERS[i % FEEDBACK_REVIEWERS.length]
        ?.gradient ??
      "linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 100%)",
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
    () => designersToReviewers(studio?.designers ?? []),
    [studio?.designers]
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
          <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="mb-3 font-whisper text-xs font-medium uppercase tracking-wider text-neutral-600">
              In progress
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
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
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                      step === s.num
                        ? "bg-black text-white"
                        : step > s.num
                          ? "bg-neutral-300 text-neutral-600"
                          : "border border-neutral-300 bg-white text-neutral-400"
                    )}
                  >
                    {s.num}
                  </span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FeedbackForm
        studioId={studio?.id ?? ""}
        typefaces={typefaces}
        reviewers={reviewers}
        step={step}
        onStepChange={onStepChange}
      />
    </div>
  );
}
