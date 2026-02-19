"use client";

import { NylasSchedulerEditor } from "@nylas/react";
import { useParams } from "next/navigation";

const NYLAS_CLIENT_ID =
  process.env.NEXT_PUBLIC_NYLAS_CLIENT_ID ?? "";
const NYLAS_DOMAIN =
  process.env.NEXT_PUBLIC_NYLAS_SCHEDULER_API_URL ??
  "https://api.us.nylas.com";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000");

export default function SchedulerSetupPage() {
  const params = useParams();
  const accountId = params?.id as string;

  const redirectUri = `${APP_URL}/account/${accountId}/scheduler-setup`;
  const previewBaseUrl = `${APP_URL}/account/${accountId}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold font-ortank text-2xl text-neutral-800">
          Feedback scheduler setup
        </h1>
        <p className="mt-2 font-whisper text-neutral-600 text-sm">
          Connect your calendar and create your scheduling
          configuration. After saving, copy the
          configuration ID and add it to your .env.local:
        </p>
        <ul className="mt-2 list-inside list-disc font-whisper text-neutral-600 text-sm">
          <li>
            <code className="rounded bg-neutral-100 px-1">
              NEXT_PUBLIC_NYLAS_CONFIG_EUNYOU_NOH
            </code>{" "}
            for Eunyou Noh
          </li>
          <li>
            <code className="rounded bg-neutral-100 px-1">
              NEXT_PUBLIC_NYLAS_CONFIG_NOHEUL_LEE
            </code>{" "}
            for Noheul Lee
          </li>
          <li>
            <code className="rounded bg-neutral-100 px-1">
              NEXT_PUBLIC_NYLAS_CONFIG_LORIS_OLIVIER
            </code>{" "}
            for Loris Olivier
          </li>
        </ul>
      </div>

      {NYLAS_CLIENT_ID ? (
        <div className="min-h-[600px] rounded-lg border border-neutral-200 bg-white p-6">
          <NylasSchedulerEditor
            schedulerPreviewLink={`${previewBaseUrl}?config_id={config_id}`}
            nylasSessionsConfig={{
              clientId: NYLAS_CLIENT_ID,
              redirectUri,
              domain: `${NYLAS_DOMAIN.replace(/\/$/, "")}/v3`,
              hosted: true,
              accessType: "offline",
            }}
            defaultSchedulerConfigState={{
              selectedConfiguration: {
                requires_session_auth: false,
                scheduler: {
                  rescheduling_url: `${previewBaseUrl}/reschedule/:booking_ref`,
                  cancellation_url: `${previewBaseUrl}/cancel/:booking_ref`,
                },
              },
            }}
          />
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <p className="font-whisper text-amber-800 text-sm">
            Add{" "}
            <code className="rounded bg-amber-100 px-1">
              NEXT_PUBLIC_NYLAS_CLIENT_ID
            </code>{" "}
            to your .env.local to use the scheduler editor.
          </p>
        </div>
      )}
    </div>
  );
}
