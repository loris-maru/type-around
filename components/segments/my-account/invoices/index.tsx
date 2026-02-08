"use client";

import { RiDownloadLine } from "react-icons/ri";
import { MOCK_INVOICES } from "@/constant/MOCK_INVOICES";

export default function MyAccountInvoices() {
  return (
    <div className="relative w-full">
      <h1 className="font-ortank text-3xl font-bold mb-8">
        Invoices
      </h1>

      {MOCK_INVOICES.length === 0 ? (
        <p className="text-neutral-500 font-whisper">
          No invoices yet.
        </p>
      ) : (
        <div className="w-full border border-neutral-300 rounded-xl overflow-hidden bg-white">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-4 px-5 py-3 bg-neutral-100 border-b border-neutral-300">
            <span className="text-xs uppercase tracking-wide font-whisper text-neutral-500">
              Invoice #
            </span>
            <span className="text-xs uppercase tracking-wide font-whisper text-neutral-500">
              Date
            </span>
            <span className="text-xs uppercase tracking-wide font-whisper text-neutral-500">
              Amount
            </span>
            <span className="text-xs uppercase tracking-wide font-whisper text-neutral-500 text-right">
              Download
            </span>
          </div>

          {/* Table rows */}
          {MOCK_INVOICES.map((invoice, index) => (
            <div
              key={invoice.id}
              className={`grid grid-cols-4 gap-4 px-5 py-4 items-center ${
                index < MOCK_INVOICES.length - 1
                  ? "border-b border-neutral-200"
                  : ""
              }`}
            >
              <span className="text-sm font-whisper font-medium text-black">
                {invoice.invoiceNumber}
              </span>
              <span className="text-sm font-whisper text-neutral-600">
                {new Date(invoice.date).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
              <span className="text-sm font-ortank font-bold">
                ${invoice.amount}
              </span>
              <div className="flex justify-end">
                <a
                  href={invoice.downloadUrl}
                  className="inline-flex items-center gap-1 text-sm font-whisper text-black hover:text-neutral-600 transition-colors"
                  download
                >
                  <RiDownloadLine className="w-4 h-4" />
                  PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
