#!/usr/bin/env node
/**
 * Create Nylas Scheduler configurations for Eunyou, Noheul, and Loris.
 *
 * Prerequisites:
 * 1. Each designer must connect their calendar via Nylas Connect first.
 * 2. Get their grant IDs from the Nylas Dashboard (Applications > Connectors).
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-nylas-configs.mjs
 *
 * Required env vars:
 *   NYLAS_API_KEY - Your Nylas API key (from Dashboard)
 *   NYLAS_GRANT_EUNYOU - Grant ID for Eunyou Noh's calendar
 *   NYLAS_GRANT_NOHEUL - Grant ID for Noheul Lee's calendar
 *   NYLAS_GRANT_LORIS - Grant ID for Loris Olivier's calendar
 *
 * Alternative: Use the Scheduler Editor UI at /account/[id]/scheduler-setup
 * to create configs visually. Each designer connects their calendar there
 * and creates their config. Copy the config IDs to .env.local.
 */

const API_URL =
  process.env.NEXT_PUBLIC_NYLAS_SCHEDULER_API_URL ??
  "https://api.us.nylas.com";
const API_KEY = process.env.NYLAS_API_KEY;

const REVIEWERS = [
  {
    name: "Eunyou Noh",
    envKey: "NEXT_PUBLIC_NYLAS_CONFIG_EUNYOU_NOH",
    grantKey: "NYLAS_GRANT_EUNYOU",
  },
  {
    name: "Noheul Lee",
    envKey: "NEXT_PUBLIC_NYLAS_CONFIG_NOHEUL_LEE",
    grantKey: "NYLAS_GRANT_NOHEUL",
  },
  {
    name: "Loris Olivier",
    envKey: "NEXT_PUBLIC_NYLAS_CONFIG_LORIS_OLIVIER",
    grantKey: "NYLAS_GRANT_LORIS",
  },
];

const createConfig = async (grantId, designerName) => {
  const res = await fetch(
    `${API_URL}/v3/grants/${grantId}/scheduling/configurations`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Feedback session - ${designerName}`,
        slug: `feedback-${designerName.toLowerCase().replace(/\s+/g, "-")}`,
        participants: [{ email: "" }],
        availability: {
          duration_minutes: 30,
        },
        event_booking: {
          booking_type: "round_robin",
          title: `Feedback with ${designerName}`,
        },
        scheduler: {
          requires_session_auth: false,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.data?.id ?? data.id;
};

async function main() {
  if (!API_KEY) {
    console.error(
      "Missing NYLAS_API_KEY. Add it to .env.local"
    );
    console.error(
      "\nTo create configs via UI instead, visit:"
    );
    console.error("  /account/[your-id]/scheduler-setup");
    process.exit(1);
  }

  console.log(
    "Creating Nylas Scheduler configurations...\n"
  );

  for (const reviewer of REVIEWERS) {
    const grantId = process.env[reviewer.grantKey];
    if (!grantId) {
      console.log(
        `⏭️  ${reviewer.name}: Skipped (no ${reviewer.grantKey})`
      );
      continue;
    }

    try {
      const configId = await createConfig(
        grantId,
        reviewer.name
      );
      console.log(`✅ ${reviewer.name}:`);
      console.log(`   ${reviewer.envKey}=${configId}`);
      console.log("");
    } catch (err) {
      console.error(
        `❌ ${reviewer.name}: ${err.message}\n`
      );
    }
  }

  console.log(
    "Add the config IDs above to your .env.local and restart the dev server."
  );
}

main();
