"use client";

import { useCallback, useState } from "react";
import { RiCloseLine } from "react-icons/ri";

type AddAvailabilityModalProps = {
  isOpen: boolean;
  date: Date | null;
  onClose: () => void;
  onSave: (startTime: string, endTime: string) => void;
  isSaving?: boolean;
};

export default function AddAvailabilityModal({
  isOpen,
  date,
  onClose,
  onSave,
  isSaving = false,
}: AddAvailabilityModalProps) {
  const [startTime, setStartTime] = useState("15:00");
  const [endTime, setEndTime] = useState("20:00");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-ortank font-bold text-lg text-neutral-800">
            Add availability
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 transition-colors hover:bg-neutral-100"
            aria-label="Close"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
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
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 font-whisper text-neutral-600 text-sm transition-colors hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-lg border border-black bg-black px-4 py-2 font-whisper text-sm text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Adding…" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
