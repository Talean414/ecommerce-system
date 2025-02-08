// src/utils/otpUtils.ts

import crypto from "crypto";

/**
 * Generate a 6-digit numeric OTP.
 */
export const generateOTP = (): string => {
  // Generate a random integer between 100000 and 999999
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Hash the OTP using SHA-256 before storing in the database.
 * @param otp - The plain OTP string.
 * @returns The hashed OTP.
 */
export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

/**
 * Verify if the input OTP matches the hashed OTP from the database.
 * @param inputOtp - The OTP entered by the user.
 * @param hashedOtp - The hashed OTP stored in the database.
 * @returns A boolean indicating whether the OTPs match.
 */
export const verifyOtp = (inputOtp: string, hashedOtp: string): boolean => {
  const hashedInputOtp = hashOTP(inputOtp);
  return hashedInputOtp === hashedOtp;
};
