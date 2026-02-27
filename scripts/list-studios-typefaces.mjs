#!/usr/bin/env node

/**
 * Script to list all studios and their typefaces from Firebase
 *
 * Usage:
 *   node --env-file=.env.local scripts/list-studios-typefaces.mjs
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

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
  console.log("\n📋 Studios & Typefaces\n");
  console.log("=".repeat(60));

  const snapshot = await getDocs(collection(db, "studios"));

  if (snapshot.empty) {
    console.log("No studios found.");
    process.exit(0);
  }

  let totalTypefaces = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const studioName = data.name || "Unknown Studio";
    const typefaces = data.typefaces ?? [];

    console.log(`\n🏢 ${studioName}`);
    console.log(`   ID: ${doc.id}`);
    console.log(`   Typefaces: ${typefaces.length}`);

    if (typefaces.length === 0) {
      console.log("   (none)");
    } else {
      for (const t of typefaces) {
        const published = t.published ? "✓" : " ";
        const name = t.name || "(no name)";
        const slug = t.slug || "(no slug)";
        const id = t.id || "(no id)";
        console.log(`   [${published}] ${name}`);
        console.log(`       id: ${id} | slug: ${slug}`);
        totalTypefaces++;
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(
    `Total: ${snapshot.size} studios, ${totalTypefaces} typefaces`
  );
  console.log("");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
