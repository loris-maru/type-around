"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useMemo, useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { useStudio } from "@/hooks/use-studio";
import AddAvailabilityModal from "./add-availability-modal";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AccountReviewerCalendar() {
  const { user } = useUser();
  const { studio, updateStudio } = useStudio();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(
    new Date().getFullYear()
  );
  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from(
      { length: 5 },
      (_, i) => current - 2 + i
    );
  }, []);

  const { days, firstDayOffset } = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const firstDay = first.getDay();
    return {
      days: Array.from(
        { length: daysInMonth },
        (_, i) => i + 1
      ),
      firstDayOffset: firstDay,
    };
  }, [month, year]);

  const handleCellClick = useCallback(
    (day: number) => {
      setSelectedDate(new Date(year, month, day));
      setIsModalOpen(true);
    },
    [year, month]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
  }, []);

  const handleSaveAvailability = useCallback(
    async (startTime: string, endTime: string) => {
      if (!studio || !user?.id || !selectedDate) return;
      setIsSaving(true);
      try {
        const dateStr = formatDateKey(selectedDate);
        const existing = studio.reviewerAvailability ?? {};
        const userSlots = existing[user.id] ?? {};
        const dateSlots = userSlots[dateStr] ?? [];
        const updated = {
          ...existing,
          [user.id]: {
            ...userSlots,
            [dateStr]: [
              ...dateSlots,
              { startTime, endTime },
            ],
          },
        };
        await updateStudio({
          reviewerAvailability: updated,
        });
        handleCloseModal();
      } finally {
        setIsSaving(false);
      }
    },
    [
      studio,
      user?.id,
      selectedDate,
      updateStudio,
      handleCloseModal,
    ]
  );

  return (
    <div className="relative flex w-full flex-col gap-y-28 pb-20">
      <div>
        <h1 className="font-ortank font-bold text-2xl text-neutral-800">
          Calendar
        </h1>
        <p className="mt-2 font-whisper text-neutral-600 text-sm">
          Manage your availability for feedback sessions.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div>
            <label
              htmlFor="calendar-month"
              className="mb-1 block font-whisper text-neutral-600 text-xs"
            >
              Month
            </label>
            <select
              id="calendar-month"
              value={month}
              onChange={(e) =>
                setMonth(Number(e.target.value))
              }
              className="rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-neutral-800 text-sm outline-none focus:border-black"
            >
              {MONTHS.map((m, i) => (
                <option
                  key={m}
                  value={i}
                >
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="calendar-year"
              className="mb-1 block font-whisper text-neutral-600 text-xs"
            >
              Year
            </label>
            <select
              id="calendar-year"
              value={year}
              onChange={(e) =>
                setYear(Number(e.target.value))
              }
              className="rounded-lg border border-neutral-300 px-3 py-2 font-whisper text-neutral-800 text-sm outline-none focus:border-black"
            >
              {years.map((y) => (
                <option
                  key={y}
                  value={y}
                >
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day) => (
            <div
              key={day}
              className="py-2 text-center font-whisper text-neutral-500 text-xs"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOffset }).map(
            (_, i) => (
              <div
                key={`empty-${year}-${month}-${i}`}
                aria-hidden
              />
            )
          )}
          {days.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const slots =
              studio?.reviewerAvailability?.[
                user?.id ?? ""
              ]?.[dateStr] ?? [];
            const hasSlots = slots.length > 0;
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleCellClick(day)}
                className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg border border-neutral-200 bg-white font-whisper text-neutral-800 text-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50"
              >
                <span>{day}</span>
                {hasSlots ? (
                  <span className="rounded-full bg-black px-1.5 py-0.5 text-[10px] text-white">
                    {slots.length}
                  </span>
                ) : (
                  <RiAddLine className="h-3 w-3 text-neutral-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AddAvailabilityModal
        isOpen={isModalOpen}
        date={selectedDate}
        onClose={handleCloseModal}
        onSave={handleSaveAvailability}
        isSaving={isSaving}
      />
    </div>
  );
}
