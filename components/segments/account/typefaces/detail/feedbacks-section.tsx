"use client";

import { NylasScheduling } from "@nylas/react";
import { motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import FileDropZone from "@/components/global/file-drop-zone";
import {
  FEEDBACK_REVIEWERS,
  getDefaultNylasConfigId,
  getReviewerNylasConfigId,
} from "@/constant/FEEDBACK_REVIEWERS";
import type { FeedbackReviewer } from "@/constant/FEEDBACK_REVIEWERS";

type FeedbacksSectionProps = {
  studioId: string;
};

const NYLAS_SCHEDULER_API_URL =
  process.env.NEXT_PUBLIC_NYLAS_SCHEDULER_API_URL ??
  "https://api.us.nylas.com";

const MOCK_DAYS = [
  { date: "2025-02-15", label: "Mon, Feb 15" },
  { date: "2025-02-16", label: "Tue, Feb 16" },
  { date: "2025-02-17", label: "Wed, Feb 17" },
];

const MOCK_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
];

function ReviewerCard({
  reviewer,
  onSelect,
}: {
  reviewer: FeedbackReviewer;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 text-left transition-colors hover:border-neutral-400 hover:bg-neutral-50"
    >
      <div
        className="h-12 w-12 shrink-0 rounded-full"
        style={{ background: reviewer.gradient }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="font-medium font-whisper text-neutral-800 text-sm">
          {reviewer.firstName} {reviewer.lastName}
        </div>
      </div>
    </button>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <title>Success</title>
      <motion.path
        d="M20 6L9 17l-5-5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      />
    </svg>
  );
}

type NylasBookedEvent = {
  start_time?: string | number;
  end_time?: string | number;
  title?: string;
  selectedTimeslot?: {
    start_time?: string | number;
    end_time?: string | number;
  };
  [key: string]: unknown;
};

export default function FeedbacksSection({
  studioId,
}: FeedbacksSectionProps) {
  const [step, setStep] = useState(1);
  const [selectedReviewer, setSelectedReviewer] =
    useState<FeedbackReviewer | null>(null);
  const [selectedDay, setSelectedDay] = useState<
    string | null
  >(null);
  const [selectedSlot, setSelectedSlot] = useState<
    string | null
  >(null);
  const [comment, setComment] = useState("");
  const [typographicProof, setTypographicProof] =
    useState("");
  const [glyphsFile, setGlyphsFile] = useState("");
  const nylasContainerRef = useRef<HTMLDivElement>(null);

  const nylasConfigId = selectedReviewer
    ? (getReviewerNylasConfigId(selectedReviewer.id) ??
      getDefaultNylasConfigId())
    : undefined;
  const useNylas = Boolean(nylasConfigId);

  useEffect(() => {
    if (!useNylas || !nylasContainerRef.current) return;
    const el = nylasContainerRef.current;
    const handler = (e: Event) => {
      const ev = e as CustomEvent<
        NylasBookedEvent | undefined
      >;
      const detail = ev.detail;
      const startTime =
        detail?.start_time ??
        detail?.selectedTimeslot?.start_time;
      if (startTime != null) {
        const start = new Date(startTime);
        setSelectedDay(start.toISOString().slice(0, 10));
        setSelectedSlot(
          start.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setStep(3);
      }
    };
    el.addEventListener("bookedEventInfo", handler);
    return () =>
      el.removeEventListener("bookedEventInfo", handler);
  }, [useNylas]);

  const handleSelectReviewer = useCallback(
    (reviewer: FeedbackReviewer) => {
      setSelectedReviewer(reviewer);
      setStep(2);
    },
    []
  );

  const handleSelectSlot = useCallback(
    (day: string, slot: string) => {
      setSelectedDay(day);
      setSelectedSlot(slot);
      setStep(3);
    },
    []
  );

  const handleBack = useCallback(() => {
    if (step === 2) {
      setSelectedReviewer(null);
      setStep(1);
    } else if (step === 3) {
      setSelectedDay(null);
      setSelectedSlot(null);
      setStep(2);
    }
  }, [step]);

  const handleCancel = useCallback(() => {
    setStep(1);
    setSelectedReviewer(null);
    setSelectedDay(null);
    setSelectedSlot(null);
    setComment("");
    setTypographicProof("");
    setGlyphsFile("");
  }, []);

  const handleSendRequest = useCallback(() => {
    // TODO: Submit feedback request
    setStep(4);
  }, []);

  const handleCloseConfirmation = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  return (
    <CollapsibleSection
      id="feedbacks"
      title="Feedbacks"
    >
      <div className="flex flex-col gap-8">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <p className="font-whisper text-neutral-600 text-sm">
              Select the designer you want feedback from
            </p>
            <div className="grid grid-cols-3 gap-5">
              {FEEDBACK_REVIEWERS.map((reviewer) => (
                <ReviewerCard
                  key={reviewer.id}
                  reviewer={reviewer}
                  onSelect={() =>
                    handleSelectReviewer(reviewer)
                  }
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && selectedReviewer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <button
              type="button"
              onClick={handleBack}
              className="flex w-fit items-center gap-2 font-whisper text-neutral-600 text-sm transition-colors hover:text-black"
            >
              <RiArrowLeftLine className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3">
              <div
                className="h-10 w-10 shrink-0 rounded-full"
                style={{
                  background: selectedReviewer.gradient,
                }}
                aria-hidden
              />
              <span className="font-whisper text-neutral-800 text-sm">
                {selectedReviewer.firstName}{" "}
                {selectedReviewer.lastName}
              </span>
            </div>
            <p className="font-whisper text-neutral-600 text-sm">
              Select an available date and time
            </p>
            {useNylas && nylasConfigId ? (
              <div
                ref={nylasContainerRef}
                className="min-h-[400px] rounded-lg border border-neutral-200 bg-white p-4"
              >
                <NylasScheduling
                  configurationId={nylasConfigId}
                  schedulerApiUrl={NYLAS_SCHEDULER_API_URL}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {MOCK_DAYS.map((day) => (
                  <div key={day.date}>
                    <div className="mb-2 font-whisper text-neutral-600 text-xs">
                      {day.label}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() =>
                            handleSelectSlot(day.date, slot)
                          }
                          className="rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-neutral-700 text-sm transition-colors hover:border-black hover:bg-neutral-50"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && selectedReviewer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <button
              type="button"
              onClick={handleBack}
              className="flex w-fit items-center gap-2 font-whisper text-neutral-600 text-sm transition-colors hover:text-black"
            >
              <RiArrowLeftLine className="h-4 w-4" />
              Back
            </button>

            <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4">
              <div
                className="h-12 w-12 shrink-0 rounded-full"
                style={{
                  background: selectedReviewer.gradient,
                }}
                aria-hidden
              />
              <div>
                <div className="font-medium font-whisper text-neutral-800 text-sm">
                  {selectedReviewer.firstName}{" "}
                  {selectedReviewer.lastName}
                </div>
                <div className="font-whisper text-neutral-500 text-xs">
                  {selectedDay} · {selectedSlot}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="feedback-comment"
                className="mb-2 block font-whisper text-neutral-600 text-sm"
              >
                Comment
              </label>
              <textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-neutral-800 text-sm outline-none focus:border-black"
                placeholder="Add your comment..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="mb-2 block font-whisper text-neutral-600 text-sm">
                  Upload your typographic proof
                </span>
                <FileDropZone
                  label="Typographic proof"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  value={typographicProof}
                  onChange={setTypographicProof}
                  instruction=""
                  description="PDF, PNG, JPG"
                  studioId={studioId}
                  folder="feedback"
                />
              </div>
              <div>
                <span className="mb-2 block font-whisper text-neutral-600 text-sm">
                  Upload your glyphs or ufo file{" "}
                  <span className="text-neutral-400">
                    (not mandatory)
                  </span>
                </span>
                <FileDropZone
                  label="Glyphs or UFO file"
                  accept=".glyphs,.ufo,.zip"
                  value={glyphsFile}
                  onChange={setGlyphsFile}
                  instruction=""
                  description=".glyphs, .ufo, .zip"
                  studioId={studioId}
                  folder="feedback"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-neutral-300 px-4 py-2 font-whisper text-neutral-600 text-sm transition-colors hover:border-black hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendRequest}
                className="rounded-lg border border-black bg-black px-4 py-2 font-whisper text-sm text-white transition-colors hover:bg-neutral-800"
              >
                Send request
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6 py-8"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-bold font-ortank text-lg text-neutral-800">
                Request sent successfully
              </h3>
              <p className="mt-2 font-whisper text-neutral-600 text-sm">
                Your feedback request has been submitted.
                The designer will get back to you soon.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseConfirmation}
              className="rounded-lg border border-neutral-300 px-4 py-2 font-whisper text-neutral-600 text-sm transition-colors hover:border-black hover:bg-neutral-50"
            >
              Close
            </button>
          </motion.div>
        )}
      </div>
    </CollapsibleSection>
  );
}
