import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase-config";

let recaptchaVerifier: RecaptchaVerifier | null = null;
let currentConfirmation: any = null;

function getRecaptchaVerifier(): RecaptchaVerifier {
  if (recaptchaVerifier) return recaptchaVerifier;
  recaptchaVerifier = new RecaptchaVerifier(auth!, "recaptcha-container", { size: "invisible" });
  return recaptchaVerifier;
}

export async function sendOtp(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  if (!isFirebaseConfigured || !auth) {
    return { success: false, error: "Firebase is not configured. Add your API key to .env.local" };
  }

  const formatted = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+91${phoneNumber.replace(/\D/g, "")}`;

  try {
    const verifier = getRecaptchaVerifier();
    currentConfirmation = await signInWithPhoneNumber(auth, formatted, verifier);
    return { success: true };
  } catch (err: any) {
    console.error("sendOtp failed:", err);
    resetRecaptcha();

    if (err.code === "auth/invalid-phone-number") {
      return { success: false, error: "Invalid phone number format." };
    }
    if (err.code === "auth/too-many-requests") {
      return { success: false, error: "Too many attempts. Wait a few minutes." };
    }
    if (err.code === "auth/quota-exceeded") {
      return { success: false, error: "SMS quota exceeded. Try again later." };
    }
    if (err.code === "auth/captcha-check-failed") {
      return { success: false, error: "Security check failed. Try again." };
    }
    return { success: false, error: "Failed to send OTP. Check Firebase config." };
  }
}

export async function verifyOtp(
  otpCode: string
): Promise<{ success: boolean; error?: string; user?: any }> {
  if (!currentConfirmation) {
    return { success: false, error: "No OTP was sent. Please request a new code." };
  }

  try {
    const result = await currentConfirmation.confirm(otpCode);
    currentConfirmation = null;
    return { success: true, user: result.user };
  } catch (err: any) {
    console.error("verifyOtp failed:", err);
    if (err.code === "auth/invalid-verification-code") {
      return { success: false, error: "Incorrect OTP. Please try again." };
    }
    if (err.code === "auth/code-expired") {
      resetRecaptcha();
      return { success: false, error: "OTP expired. Please request a new code." };
    }
    return { success: false, error: "Verification failed." };
  }
}

export function resetRecaptcha() {
  recaptchaVerifier = null;
  currentConfirmation = null;
}
