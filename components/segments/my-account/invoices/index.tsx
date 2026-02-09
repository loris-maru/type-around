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
        <div className="flex flex-col divide-y divide-neutral-200">
          {MOCK_INVOICES.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-whisper font-medium uppercase tracking-wide text-neutral-500">
                  {invoice.invoiceNumber}
                </span>
                <span className="font-ortank font-bold">
                  ${invoice.amount}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-sm text-neutral-500 font-whisper">
                  {new Date(
                    invoice.date
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <a
                  href={invoice.downloadUrl}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="Download invoice"
                  download
                >
                  <RiDownloadLine className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
