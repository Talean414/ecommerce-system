// src/app/api/auth/verify-otp/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyOtp } from "@/utils/otpUtils";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { otp, email } = await request.json();

    if (!otp || !email) {
      return NextResponse.json(
        { error: "Missing OTP or email" },
        { status: 400 }
      );
    }

    // Normalize the email to ensure consistency
    const normalizedEmail = email.trim().toLowerCase();

    // Find the OTP record for the provided email
    const otpRecord = await prisma.otp.findUnique({
      where: { email: normalizedEmail },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "No OTP found for this email" },
        { status: 400 }
      );
    }

    // Check if the OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    // Verify the provided OTP with the stored hashed OTP
    const isOtpValid = verifyOtp(otp, otpRecord.otp);

    if (!isOtpValid) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP is valid. Permanently update the user's record to mark them as verified.
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { verified: true },
    });

    // Delete the OTP record after successful verification
    await prisma.otp.delete({
      where: { email: normalizedEmail },
    });

    return NextResponse.json(
      { message: "OTP verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
