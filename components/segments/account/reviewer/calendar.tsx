"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useMemo, useState } from "react";
import { InputDropdown } from "@/components/global/inputs";
import AddAvailabilityModal from "@/components/modals/modal-add-availability";
import { ButtonAddAvailabilityDay } from "@/components/molecules/buttons";
import { CALENDAR_MONTHS } from "@/constant/CALENDAR_MONTHS";
import { useStudio } from "@/hooks/use-studio";
import { formatDateKey } from "@/utils/format-date-key";

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
        <h1 className="font-bold font-ortank text-2xl text-neutral-800">
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
            <InputDropdown
              value={String(month)}
              options={CALENDAR_MONTHS.map((m, i) => ({
                value: String(i),
                label: m,
              }))}
              onChange={(v) => setMonth(Number(v))}
            />
          </div>
          <div>
            <label
              htmlFor="calendar-year"
              className="mb-1 block font-whisper text-neutral-600 text-xs"
            >
              Year
            </label>
            <InputDropdown
              value={String(year)}
              options={years.map((y) => ({
                value: String(y),
                label: String(y),
              }))}
              onChange={(v) => setYear(Number(v))}
            />
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
          {Array.from(
            { length: firstDayOffset },
            (_, i) => {
              const emptyDate = new Date(
                year,
                month,
                i - firstDayOffset + 1
              );
              return (
                <div
                  key={`empty-${emptyDate.toISOString().slice(0, 10)}`}
                  aria-hidden
                />
              );
            }
          )}
          {days.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const slots =
              studio?.reviewerAvailability?.[
                user?.id ?? ""
              ]?.[dateStr] ?? [];
            return (
              <ButtonAddAvailabilityDay
                key={dateStr}
                day={day}
                slotCount={slots.length}
                onClick={() => handleCellClick(day)}
              />
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
