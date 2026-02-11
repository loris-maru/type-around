import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
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

// Debug: Check if config is loaded
console.log("Firebase Config:");
console.log(
  "  Project ID:",
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "NOT SET"
);
console.log(
  "  Auth Domain:",
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "NOT SET"
);

const app = initializeApp(firebaseConfig);
// Use named database "studios"
const db = getFirestore(app, "studios");

async function seedStudio() {
  const studioData = {
    ownerEmail: "test@example.com",
    name: "Test Studio",
    location: "Seoul, South Korea",
    foundedIn: "2020",
    contactEmail: "contact@teststudio.com",
    designers: [
      { firstName: "Min", lastName: "Kim" },
      { firstName: "Jae", lastName: "Park" },
    ],
    website: "https://teststudio.com",
    socialMedia: [
      {
        name: "instagram",
        url: "https://instagram.com/teststudio",
      },
      {
        name: "twitter",
        url: "https://twitter.com/teststudio",
      },
    ],
    headerFont: "",
    textFont: "",
    gradient: {
      from: "#FFF8E8",
      to: "#F2F2F2",
    },
    typefaces: [],
  };

  try {
    await setDoc(doc(db, "studios", "123456"), studioData);
    console.log(
      "Studio created successfully with ID: 123456"
    );
  } catch (error) {
    console.error("Error creating studio:", error);
  }
}

seedStudio();
