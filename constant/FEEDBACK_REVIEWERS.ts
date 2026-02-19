export type FeedbackReviewer = {
  id: string;
  firstName: string;
  lastName: string;
  gradient: string;
};

const PLACEHOLDER_CONFIG_IDS = new Set([
  "",
  "config_id",
  "your_config_id",
  "<config_id>",
  "<config_id_from_editor>",
]);

function isValidNylasConfigId(
  id: string | undefined
): boolean {
  if (!id || typeof id !== "string") return false;
  const trimmed = id.trim();
  return (
    trimmed.length > 0 &&
    !PLACEHOLDER_CONFIG_IDS.has(trimmed)
  );
}

/** Resolve Nylas config ID from env. Use NEXT_PUBLIC_NYLAS_CONFIG_EUNYOU_NOH, etc. */
export function getReviewerNylasConfigId(
  reviewerId: string
): string | undefined {
  if (typeof window === "undefined") return undefined;
  const key = `NEXT_PUBLIC_NYLAS_CONFIG_${reviewerId
    .replace(/-/g, "_")
    .toUpperCase()}`;
  const id = process.env[key];
  return isValidNylasConfigId(id) ? id : undefined;
}

/** Fallback Nylas config ID when per-reviewer env is not set. */
export function getDefaultNylasConfigId():
  | string
  | undefined {
  const id =
    process.env.NEXT_PUBLIC_NYLAS_SCHEDULER_CONFIG_ID;
  return isValidNylasConfigId(id) ? id : undefined;
}

export const FEEDBACK_REVIEWERS: FeedbackReviewer[] = [
  {
    id: "eunyou-noh",
    firstName: "Eunyou",
    lastName: "Noh",
    gradient:
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)",
  },
  {
    id: "noheul-lee",
    firstName: "Noheul",
    lastName: "Lee",
    gradient:
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d4a5f3 100%)",
  },
  {
    id: "loris-olivier",
    firstName: "Loris",
    lastName: "Olivier",
    gradient:
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
];
