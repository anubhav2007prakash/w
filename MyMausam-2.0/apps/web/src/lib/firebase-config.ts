import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

/** Safely initialize Firebase — never let errors crash the app */
function initFirebase() {
  if (!apiKey || apiKey.length < 10) return;

  try {
    app =
      getApps().length === 0
        ? initializeApp({
            apiKey,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          })
        : getApps()[0];
  } catch (e: any) {
    console.warn("[Firebase] App init failed:", e?.message);
    app = null;
    return;
  }

  try {
    auth = getAuth(app);
  } catch (e: any) {
    console.warn("[Firebase] Auth init failed:", e?.message);
    auth = null;
  }
}

// Run init immediately but swallow any uncaught errors
try {
  initFirebase();
} catch (e: any) {
  console.warn("[Firebase] Init error:", e?.message);
}

// Safety net: if Firebase throws asynchronously during module eval, catch it
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    if (e.message?.includes("Firebase") || e.message?.includes("auth/")) {
      e.preventDefault();
      console.warn("[Firebase] Caught runtime error:", e.message);
    }
  });
}

export { auth };
export const isFirebaseConfigured = !!apiKey && !!app;
