/**
 * Demo OTP authentication — no Firebase dependency.
 *
 * How it works:
 *  1. sendOtp() "sends" a 6-digit code and stores it in memory.
 *     In production you'd replace this with an SMS provider.
 *  2. verifyOtp() checks the entered code against the stored one.
 *
 * For demo purposes, "123456" always works as a universal OTP.
 */

let storedOtp: string | null = null;
let otpPhone: string | null = null;
let otpExpiresAt: number = 0;

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEMO_OTP = "123456"; // universal demo OTP

export async function sendOtp(phoneNumber: string): Promise<{ success: boolean; error?: string; devOtp?: string }> {
  if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
    return { success: false, error: "Please enter a valid 10-digit mobile number." };
  }

  // Generate a random 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  storedOtp = otp;
  otpPhone = phoneNumber;
  otpExpiresAt = Date.now() + OTP_TTL_MS;

  // In production, send SMS here via Twilio / MSG91 / etc.
  // For demo, log to console so developers can see it.
  console.log(`\n📱 Demo OTP for ${phoneNumber}: ${otp}\n   (also try universal demo OTP: ${DEMO_OTP})\n`);

  // Return devOtp so the UI can optionally show it during development
  return { success: true, devOtp: otp };
}

export async function verifyOtp(
  otpCode: string
): Promise<{ success: boolean; error?: string; user?: any }> {
  if (!storedOtp || !otpPhone) {
    return { success: false, error: "No OTP was sent. Please request a new code." };
  }

  if (Date.now() > otpExpiresAt) {
    storedOtp = null;
    otpPhone = null;
    return { success: false, error: "OTP expired. Please request a new code." };
  }

  // Accept the stored OTP OR the universal demo OTP
  if (otpCode === storedOtp || otpCode === DEMO_OTP) {
    const phone = otpPhone;
    storedOtp = null;
    otpPhone = null;
    // Return a mock user object matching what the auth context expects
    return {
      success: true,
      user: {
        uid: `demo-${phone?.replace(/\D/g, "").slice(-10) || Date.now()}`,
        displayName: null,
        email: null,
        phoneNumber: phone,
      },
    };
  }

  return { success: false, error: "Incorrect OTP. Please try again. (Hint: try 123456)" };
}

export function resetRecaptcha() {
  storedOtp = null;
  otpPhone = null;
}
