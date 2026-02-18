"use client";

import { RiCheckLine } from "react-icons/ri";
import { EULA_STEPS } from "@/types/eula";
import { cn } from "@/utils/class-names";

type StepIndicatorProps = {
  currentStep: number;
};

export default function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="flex w-full items-center justify-between">
      {EULA_STEPS.map((step, index) => (
        <div
          key={step.id}
          className="flex flex-1 items-center justify-between"
        >
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-medium font-whisper text-xs transition-colors duration-200",
              step.id === currentStep
                ? "bg-black text-white"
                : step.id < currentStep
                  ? "bg-black/10 text-black"
                  : "bg-neutral-200 text-neutral-400"
            )}
          >
            {step.id < currentStep ? (
              <RiCheckLine className="h-3.5 w-3.5" />
            ) : (
              step.id
            )}
          </div>
          {index < EULA_STEPS.length - 1 && (
            <div
              className={cn(
                "mx-1 h-px min-w-2 flex-1 transition-colors duration-200",
                step.id < currentStep
                  ? "bg-black/20"
                  : "bg-neutral-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
