"use client";

import { useCallback, useState } from "react";
import {
  ButtonCancelForm,
  ButtonCloseModal,
  ButtonModalSave,
} from "@/components/molecules/buttons";
import {
  DEFAULT_AVAILABILITY_END_TIME,
  DEFAULT_AVAILABILITY_START_TIME,
  LABEL_ADDING,
} from "@/constant/MODAL_CONSTANTS";
import { useModalOpen } from "@/hooks/use-modal-open";
import type { AddAvailabilityModalProps } from "@/types/components";

export default function AddAvailabilityModal({
  isOpen,
  date,
  onClose,
  onSave,
  isSaving = false,
}: AddAvailabilityModalProps) {
  useModalOpen(isOpen);

  const [startTime, setStartTime] = useState(
    DEFAULT_AVAILABILITY_START_TIME
  );
  const [endTime, setEndTime] = useState(
    DEFAULT_AVAILABILITY_END_TIME
  );

  const handleSave = useCallback(() => {
    onSave(startTime, endTime);
  }, [onSave, startTime, endTime]);

  if (!isOpen) return null;

  const dateLabel = date
    ? date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/30 p-4"
      data-modal
      data-lenis-prevent
    >
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold font-ortank text-lg text-neutral-800">
            Add availability
          </h2>
          <ButtonCloseModal
            onClick={onClose}
            variant="icon"
          />
        </div>

        {dateLabel && (
          <p className="mb-4 font-whisper text-neutral-600 text-sm">
            {dateLabel}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="availability-start"
              className="mb-2 block font-whisper text-neutral-600 text-sm"
            >
              Start time
            </label>
            <input
              id="availability-start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-neutral-800 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label
              htmlFor="availability-end"
              className="mb-2 block font-whisper text-neutral-600 text-sm"
            >
              End time
            </label>
            <input
              id="availability-end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-neutral-800 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <ButtonCancelForm
            onClick={onClose}
            className="flex-1"
          />
          <ButtonModalSave
            type="button"
            onClick={handleSave}
            label="Add"
            loadingLabel={LABEL_ADDING}
            disabled={isSaving}
            loading={isSaving}
            className="flex-1"
            aria-label="Add availability"
          />
        </div>
      </div>
    </div>
  );
}
