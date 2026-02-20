const formatDate = (timestamp: { _seconds: number }) => {
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default formatDate;

/**
 * Formats ISO date string to readable format (e.g., "Jan 15, 2024").
 */
export function formatSpecimenDate(
  isoString: string
): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
