"use client";

import { NylasScheduling } from "@nylas/react";
import { motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FileDropZone from "@/components/global/file-drop-zone";
import { InputDropdown } from "@/components/global/inputs";
import {
  ButtonCancelForm,
  ButtonCloseModal,
  ButtonGoBack,
  ButtonSelectReviewer,
  ButtonSelectSlot,
  ButtonSendRequest,
} from "@/components/molecules/buttons";
import {
  FEEDBACK_MOCK_DAYS,
  FEEDBACK_MOCK_SLOTS,
  NYLAS_SCHEDULER_API_URL,
} from "@/constant/FEEDBACK";
import type { FeedbackReviewer } from "@/constant/FEEDBACK_REVIEWERS";
import {
  getDefaultNylasConfigId,
  getReviewerNylasConfigId,
} from "@/constant/FEEDBACK_REVIEWERS";
import type {
  FeedbackFormProps,
  NylasBookedEvent,
} from "@/types/components";
import type { StudioTypeface } from "@/types/studio";

function ReviewerCard({
  reviewer,
  studioName,
  onSelect,
}: {
  reviewer: FeedbackReviewer;
  studioName: string;
  onSelect: () => void;
}) {
  return (
    <ButtonSelectReviewer onSelect={onSelect}>
      <div
        className="h-12 w-12 shrink-0"
        style={{ background: reviewer.gradient }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="swiss-h3 text-swiss-ink">
          {reviewer.firstName} {reviewer.lastName}
        </div>
        {studioName && (
          <div className="swiss-label mt-1 text-neutral-500">
            {studioName}
          </div>
        )}
      </div>
    </ButtonSelectReviewer>
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
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function FeedbackForm({
  studioId,
  studioName,
  typefaces,
  reviewers,
  step,
  onStepChange,
}: FeedbackFormProps) {
  const [selectedTypeface, setSelectedTypeface] =
    useState<StudioTypeface | null>(null);
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

  const typefaceOptions = useMemo(
    () => [
      { value: "", label: "Select a typeface..." },
      ...typefaces.map((tf) => ({
        value: tf.id,
        label: tf.name,
      })),
    ],
    [typefaces]
  );

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
        onStepChange(3);
      }
    };
    el.addEventListener("bookedEventInfo", handler);
    return () =>
      el.removeEventListener("bookedEventInfo", handler);
  }, [useNylas, onStepChange]);

  const handleSelectReviewer = useCallback(
    (reviewer: FeedbackReviewer) => {
      setSelectedReviewer(reviewer);
      onStepChange(2);
    },
    [onStepChange]
  );

  const handleSelectSlot = useCallback(
    (day: string, slot: string) => {
      setSelectedDay(day);
      setSelectedSlot(slot);
      onStepChange(3);
    },
    [onStepChange]
  );

  const handleBack = useCallback(() => {
    if (step === 2) {
      setSelectedReviewer(null);
      onStepChange(1);
    } else if (step === 3) {
      setSelectedDay(null);
      setSelectedSlot(null);
      onStepChange(2);
    }
  }, [step, onStepChange]);

  const handleCancel = useCallback(() => {
    onStepChange(1);
    setSelectedTypeface(null);
    setSelectedReviewer(null);
    setSelectedDay(null);
    setSelectedSlot(null);
    setComment("");
    setTypographicProof("");
    setGlyphsFile("");
  }, [onStepChange]);

  const handleSendRequest = useCallback(() => {
    onStepChange(4);
  }, [onStepChange]);

  const handleCloseConfirmation = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  if (typefaces.length === 0) {
    return (
      <div className="swiss-rule py-6">
        <p className="swiss-body text-swiss-ink">
          Add at least one typeface to your studio to
          request feedback.
        </p>
      </div>
    );
  }

  if (reviewers.length === 0) {
    return (
      <div className="swiss-rule py-6">
        <p className="swiss-body text-swiss-ink">
          No reviewers available. Add reviewers in Settings
          → Team Members by enabling the
          &quot;Reviewer&quot; checkbox for members.
        </p>
      </div>
    );
  }

  return (
    <div className="swiss-rule flex flex-col gap-10 pt-8">
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-10"
        >
          <div className="max-w-md">
            <label
              className="swiss-label mb-2 block text-neutral-500"
              htmlFor="feedback-typeface"
            >
              Typeface to give feedback on
            </label>
            <InputDropdown
              value={selectedTypeface?.id ?? ""}
              options={typefaceOptions}
              onChange={(value) => {
                const tf = typefaces.find(
                  (t) => t.id === value
                );
                setSelectedTypeface(tf ?? null);
              }}
              className="w-full"
            />
          </div>

          <div>
            <p className="swiss-label mb-2 block text-neutral-500 mb-4">
              Select the designer you want feedback from
            </p>
            <div className="grid grid-cols-3 gap-x-6">
              {reviewers.map((reviewer) => (
                <ReviewerCard
                  key={reviewer.id}
                  reviewer={reviewer}
                  studioName={studioName}
                  onSelect={() =>
                    handleSelectReviewer(reviewer)
                  }
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {step === 2 && selectedReviewer && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <ButtonGoBack onClick={handleBack} />
          <div className="swiss-rule-light flex items-center gap-4 py-4">
            <div
              className="h-10 w-10 shrink-0"
              style={{
                background: selectedReviewer.gradient,
              }}
              aria-hidden
            />
            <span className="swiss-h3 text-swiss-ink">
              {selectedReviewer.firstName}{" "}
              {selectedReviewer.lastName}
            </span>
          </div>
          <p className="swiss-label mb-2 block text-neutral-500">
            Select an available date and time
          </p>
          {useNylas && nylasConfigId ? (
            <div
              ref={nylasContainerRef}
              className="min-h-[400px] border border-swiss-ink bg-white p-4"
            >
              <NylasScheduling
                configurationId={nylasConfigId}
                schedulerApiUrl={NYLAS_SCHEDULER_API_URL}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {FEEDBACK_MOCK_DAYS.map((day) => (
                <div key={day.date}>
                  <div className="swiss-label mb-3 text-swiss-ink">
                    {day.label}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {FEEDBACK_MOCK_SLOTS.map((slot) => (
                      <ButtonSelectSlot
                        key={slot}
                        slot={slot}
                        onClick={() =>
                          handleSelectSlot(day.date, slot)
                        }
                      />
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
          className="flex flex-col gap-8"
        >
          <ButtonGoBack onClick={handleBack} />

          <div className="swiss-rule-light flex items-center gap-5 py-4">
            <div
              className="h-12 w-12 shrink-0"
              style={{
                background: selectedReviewer.gradient,
              }}
              aria-hidden
            />
            <div>
              <div className="swiss-h3 text-swiss-ink">
                {selectedReviewer.firstName}{" "}
                {selectedReviewer.lastName}
              </div>
              {selectedTypeface && (
                <div className="swiss-label mt-1 text-neutral-500">
                  {selectedTypeface.name}
                </div>
              )}
              <div className="swiss-num mt-1 text-neutral-500 text-sm">
                {selectedDay} · {selectedSlot}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="feedback-comment"
              className="swiss-label mb-2 block text-neutral-500"
            >
              Comment
            </label>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="swiss-field resize-none"
              placeholder="Add your comment..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
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

          <div className="swiss-rule-light flex gap-4 pt-6">
            <ButtonCancelForm onClick={handleCancel} />
            <ButtonSendRequest
              onClick={handleSendRequest}
            />
          </div>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-start gap-8 py-8"
        >
          <div className="flex h-16 w-16 items-center justify-center bg-swiss-red">
            <CheckIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="swiss-h2">
              Request sent successfully
            </h3>
            <p className="swiss-body mt-3 text-neutral-600">
              Your feedback request has been submitted. The
              designer will get back to you soon.
            </p>
          </div>
          <ButtonCloseModal
            onClick={handleCloseConfirmation}
          >
            Close
          </ButtonCloseModal>
        </motion.div>
      )}
    </div>
  );
}
