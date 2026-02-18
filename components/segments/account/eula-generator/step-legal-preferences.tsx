"use client";

import { useEulaStore } from "@/stores/eula-store";
import {
  DISPUTE_RESOLUTION_OPTIONS,
  OUTPUT_LANGUAGE_OPTIONS,
} from "@/types/eula";
import type { LegalPreferences } from "@/types/eula";

export default function StepLegalPreferences() {
  const { legalPreferences, updateLegalPreferences } =
    useEulaStore();

  return (
    <div className="flex w-full flex-col gap-y-6">
      <div>
        <h3 className="font-bold font-ortank text-lg">
          Legal & Output Preferences
        </h3>
        <p className="mt-1 font-whisper text-neutral-500 text-sm">
          Choose the legal framework and output format for
          your EULA.
        </p>
      </div>

      <div className="flex flex-col gap-y-8">
        {/* Governing Law */}
        <div className="flex flex-col gap-y-3">
          <span className="font-whisper text-sm font-medium">
            Governing law
          </span>
          <div className="flex gap-3">
            <label
              className={`flex cursor-pointer items-center gap-2 border px-5 py-3 font-whisper text-sm transition-all duration-200 ${
                legalPreferences.governingLaw === "korean"
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 bg-white hover:border-black"
              }`}
            >
              <input
                type="radio"
                name="governingLaw"
                value="korean"
                checked={
                  legalPreferences.governingLaw === "korean"
                }
                onChange={() =>
                  updateLegalPreferences({
                    governingLaw: "korean",
                  })
                }
                className="sr-only"
              />
              Korean law
              <span className="text-xs opacity-60">
                (대한민국법)
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-2 border px-5 py-3 font-whisper text-sm transition-all duration-200 ${
                legalPreferences.governingLaw === "other"
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 bg-white hover:border-black"
              }`}
            >
              <input
                type="radio"
                name="governingLaw"
                value="other"
                checked={
                  legalPreferences.governingLaw === "other"
                }
                onChange={() =>
                  updateLegalPreferences({
                    governingLaw: "other",
                  })
                }
                className="sr-only"
              />
              Other
            </label>
          </div>
          {legalPreferences.governingLaw === "other" && (
            <input
              type="text"
              value={
                legalPreferences.customGoverningLaw || ""
              }
              onChange={(e) =>
                updateLegalPreferences({
                  customGoverningLaw: e.target.value,
                })
              }
              placeholder="Specify governing law..."
              className="mt-2 max-w-md border border-neutral-300 px-5 py-4 font-whisper text-sm placeholder:text-neutral-400"
            />
          )}
        </div>

        {/* Dispute Resolution */}
        <div className="flex flex-col gap-y-3">
          <span className="font-whisper text-sm font-medium">
            Dispute resolution
          </span>
          <div className="flex gap-3">
            {DISPUTE_RESOLUTION_OPTIONS.map(
              ({ value, label, labelKo }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-2 border px-5 py-3 font-whisper text-sm transition-all duration-200 ${
                    legalPreferences.disputeResolution ===
                    value
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white hover:border-black"
                  }`}
                >
                  <input
                    type="radio"
                    name="disputeResolution"
                    value={value}
                    checked={
                      legalPreferences.disputeResolution ===
                      value
                    }
                    onChange={() =>
                      updateLegalPreferences({
                        disputeResolution:
                          value as LegalPreferences["disputeResolution"],
                      })
                    }
                    className="sr-only"
                  />
                  {label}
                  <span className="text-xs opacity-60">
                    ({labelKo})
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Output Language */}
        <div className="flex flex-col gap-y-3">
          <span className="font-whisper text-sm font-medium">
            Output language
          </span>
          <div className="flex gap-3">
            {OUTPUT_LANGUAGE_OPTIONS.map(
              ({ value, label, labelKo }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-2 border px-5 py-3 font-whisper text-sm transition-all duration-200 ${
                    legalPreferences.outputLanguage ===
                    value
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 bg-white hover:border-black"
                  }`}
                >
                  <input
                    type="radio"
                    name="outputLanguage"
                    value={value}
                    checked={
                      legalPreferences.outputLanguage ===
                      value
                    }
                    onChange={() =>
                      updateLegalPreferences({
                        outputLanguage:
                          value as LegalPreferences["outputLanguage"],
                      })
                    }
                    className="sr-only"
                  />
                  {label}
                  <span className="text-xs opacity-60">
                    ({labelKo})
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Korean Copyright Act */}
        <div className="flex flex-col gap-y-3">
          <button
            type="button"
            onClick={() =>
              updateLegalPreferences({
                includeKoreanCopyrightAct:
                  !legalPreferences.includeKoreanCopyrightAct,
              })
            }
            className={`flex w-full items-start gap-4 border p-5 text-left transition-all duration-200 ${
              legalPreferences.includeKoreanCopyrightAct
                ? "border-black bg-neutral-50"
                : "border-neutral-300 bg-white hover:border-neutral-400"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
                legalPreferences.includeKoreanCopyrightAct
                  ? "bg-black"
                  : "bg-neutral-300"
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                  legalPreferences.includeKoreanCopyrightAct
                    ? "translate-x-3.5"
                    : "translate-x-0"
                }`}
              />
            </span>
            <div className="flex flex-col gap-y-1">
              <span className="font-whisper text-sm font-medium">
                Include Korean Copyright Act reference
                <span className="ml-1 text-xs text-neutral-500">
                  (저작권법)
                </span>
              </span>
              <span className="font-whisper text-xs text-neutral-500">
                Reference the Korean Copyright Act
                (저작권법) provisions relevant to font
                software protection.
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
