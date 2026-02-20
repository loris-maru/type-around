#!/usr/bin/env node

/**
 * Script to set users as reviewers in their studio(s)
 *
 * Usage:
 *   node --env-file=.env.local scripts/add-reviewers.mjs
 *
 * Edit REVIEWER_IDS below to add/change user IDs.
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const REVIEWER_IDS = [
  "user_38hVDFh825jFXrRjheoSa8Oiwze",
  "user_39qUlPbgBNL2VB1cIr2hWGFMzzR",
];

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "studios");

async function main() {
  console.log("\n👥 Add users as reviewers\n");
  console.log("Target user IDs:", REVIEWER_IDS.join(", "));
  console.log("");

  const reviewerIdSet = new Set(REVIEWER_IDS);
  const studiosRef = collection(db, "studios");
  const snapshot = await getDocs(studiosRef);

  let updatedCount = 0;

  for (const docSnap of snapshot.docs) {
    const studioId = docSnap.id;
    const data = docSnap.data();
    const members = data.members ?? [];

    const updatedMembers = members.map((m) => {
      if (reviewerIdSet.has(m.id)) {
        return { ...m, isReviewer: true };
      }
      return m;
    });

    const hasChanges = members.some(
      (m) =>
        reviewerIdSet.has(m.id) && m.isReviewer !== true
    );

    if (hasChanges) {
      await updateDoc(doc(db, "studios", studioId), {
        members: updatedMembers,
      });
      const studioName = data.name || studioId;
      const updatedNames = members
        .filter((m) => reviewerIdSet.has(m.id))
        .map(
          (m) =>
            `${m.firstName || ""} ${m.lastName || ""}`.trim() ||
            m.email
        )
        .filter(Boolean);
      console.log(
        `✅ ${studioName} (${studioId}): set as reviewers: ${updatedNames.join(", ")}`
      );
      updatedCount++;
    }
  }

  if (updatedCount === 0) {
    console.log(
      "⚠️  No studios found with these users as members. Make sure they are added as studio members first (Settings → Add member)."
    );
  } else {
    console.log(
      `\n✅ Done. Updated ${updatedCount} studio(s).`
    );
  }

  console.log("");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
