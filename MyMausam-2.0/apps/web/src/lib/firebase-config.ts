/**
 * Firebase config — disabled.
 *
 * Phone authentication now uses a built-in demo OTP system (see phone-auth.ts).
 * This file exists only for backwards compatibility; it does NOT import or
 * initialize any Firebase SDK, so it can never throw auth/invalid-api-key.
 */

export const auth = null;
export const isFirebaseConfigured = false;
