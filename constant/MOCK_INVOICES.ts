import type { Invoice } from "@/types/my-account";

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2025-0042",
    date: "2025-12-15",
    amount: 49,
    downloadUrl: "#",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2025-0038",
    date: "2025-11-28",
    amount: 35,
    downloadUrl: "#",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2025-0031",
    date: "2025-11-10",
    amount: 24,
    downloadUrl: "#",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2025-0025",
    date: "2025-10-22",
    amount: 59,
    downloadUrl: "#",
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2025-0014",
    date: "2025-09-05",
    amount: 12,
    downloadUrl: "#",
  },
];
