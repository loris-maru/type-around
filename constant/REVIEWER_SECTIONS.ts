export interface ReviewerSection {
  id: string;
  label: string;
}

export const REVIEWER_SECTIONS: ReviewerSection[] = [
  { id: "calendar", label: "Calendar" },
  { id: "request", label: "Request" },
];
