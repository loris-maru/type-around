#!/usr/bin/env node

/**
 * Script to create a new studio with an owner
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-studio.mjs \
 *     --name "Studio Name" \
 *     --firstName "John" \
 *     --lastName "Doe" \
 *     --email "john@example.com"
 *
 * Or interactively:
 *   node --env-file=.env.local scripts/create-studio.mjs
 */

import { createClerkClient } from "@clerk/backend";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import * as readline from "readline";

// Firebase configuration from environment
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "studios");

// Initialize Clerk
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Default studio values
const DEFAULT_STUDIO = {
  name: "",
  hangeulName: "",
  location: "",
  foundedIn: "",
  contactEmail: "",
  designers: [],
  website: "",
  thumbnail: "",
  avatar: "",
  socialMedia: [],
  headerFont: "",
  textFont: "",
  heroCharacter: "",
  gradient: {
    from: "#FFF8E8",
    to: "#F2F2F2",
  },
  typefaces: [],
  fontsInUse: [],
  stripeAccountId: "",
  members: [],
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace("--", "");
    const value = args[i + 1];
    if (key && value) {
      result[key] = value;
    }
  }

  return result;
}

// Prompt for input
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Generate a slug from studio name
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log("\n🏢 Create New Studio\n");
  console.log("=".repeat(40));

  // Get arguments or prompt for them
  let args = parseArgs();

  const studioName =
    args.name || (await prompt("Studio name: "));
  const firstName =
    args.firstName || (await prompt("Owner first name: "));
  const lastName =
    args.lastName || (await prompt("Owner last name: "));
  const email =
    args.email || (await prompt("Owner email: "));

  if (!studioName || !firstName || !lastName || !email) {
    console.error("\n❌ Error: All fields are required");
    process.exit(1);
  }

  console.log("\n📋 Studio Details:");
  console.log(`   Name: ${studioName}`);
  console.log(`   Owner: ${firstName} ${lastName}`);
  console.log(`   Email: ${email}`);
  console.log("");

  try {
    // Step 1: Look up user in Clerk
    console.log("🔍 Looking up user in Clerk...");
    const users = await clerk.users.getUserList({
      emailAddress: [email],
    });

    let clerkUserId;

    if (users.data.length === 0) {
      console.log(
        "⚠️  User not found in Clerk. Creating studio with email as ID."
      );
      clerkUserId = slugify(studioName);
    } else {
      const user = users.data[0];
      clerkUserId = user.id;
      console.log(`✅ Found Clerk user: ${clerkUserId}`);
    }

    // Step 2: Check if studio already exists
    const studioRef = doc(db, "studios", clerkUserId);
    const existingStudio = await getDoc(studioRef);

    if (existingStudio.exists()) {
      console.log(
        `\n⚠️  A studio with ID "${clerkUserId}" already exists.`
      );
      const overwrite = await prompt(
        "Do you want to overwrite it? (yes/no): "
      );
      if (overwrite.toLowerCase() !== "yes") {
        console.log("❌ Cancelled.");
        process.exit(0);
      }
    }

    // Step 3: Create the studio
    console.log("\n📝 Creating studio in Firestore...");

    const studioData = {
      ...DEFAULT_STUDIO,
      id: clerkUserId,
      ownerEmail: email,
      name: studioName,
      contactEmail: email,
      designers: [
        {
          id: clerkUserId,
          firstName: firstName,
          lastName: lastName,
        },
      ],
    };

    await setDoc(studioRef, studioData);

    console.log("\n✅ Studio created successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Studio ID: ${clerkUserId}`);
    console.log(`   Studio Name: ${studioName}`);
    console.log(`   Owner Email: ${email}`);
    console.log(`   Owner Name: ${firstName} ${lastName}`);
    console.log(`\n🔗 Access URL: /account/${clerkUserId}`);
    console.log("");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }

  process.exit(0);
}

main();
