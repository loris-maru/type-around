import type { StudioTypeface } from "./studio";

// ===========================================
// Font-in-Use Submission
// ===========================================

export type SubmissionStatus =
  | "pending"
  | "accepted"
  | "rejected";

export type FontInUseSubmission = {
  id: string;
  studioId: string;
  studioName: string;
  submittedBy: string;
  submittedByUserId: string;
  submittedAt: string;
  status: SubmissionStatus;
  images: string[];
  projectName: string;
  designerName: string;
  typefaceId: string;
  typefaceName: string;
  description: string;
};

// ===========================================
// Studio summary (for dropdown selection)
// ===========================================

export type StudioSummary = {
  id: string;
  name: string;
  typefaces: Pick<StudioTypeface, "id" | "name" | "slug">[];
};

// ===========================================
// Purchases (mock)
// ===========================================

export type PurchaseCategory = "fonts" | "goodies";

export type Purchase = {
  id: string;
  category: PurchaseCategory;
  title: string;
  date: string;
  cost: number;
};

// ===========================================
// Invoices (mock)
// ===========================================

export type Invoice = {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  downloadUrl: string;
};
