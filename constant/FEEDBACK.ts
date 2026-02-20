export const NYLAS_SCHEDULER_API_URL =
  process.env.NEXT_PUBLIC_NYLAS_SCHEDULER_API_URL ??
  "https://api.us.nylas.com";

export const FEEDBACK_MOCK_DAYS = [
  { date: "2025-02-15", label: "Mon, Feb 15" },
  { date: "2025-02-16", label: "Tue, Feb 16" },
  { date: "2025-02-17", label: "Wed, Feb 17" },
] as const;

export const FEEDBACK_MOCK_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
] as const;

export const FEEDBACK_STEPS = [
  { num: 1, label: "Typeface & reviewer" },
  { num: 2, label: "Date & time" },
  { num: 3, label: "Comment & files" },
  { num: 4, label: "Confirmation" },
] as const;

export const FEEDBACK_DEFAULT_GRADIENT =
  "linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 100%)";
