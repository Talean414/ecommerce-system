// src/app/api/auth/send-otp/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP, hashOTP } from "@/utils/otpUtils";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim();

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { message: "Your account is already verified." },
        { status: 200 }
      );
    }

    // Generate OTP and hash it
    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);

    // Create or update the OTP record for this email
    const existingOtp = await prisma.otp.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingOtp) {
      await prisma.otp.update({
        where: { email: trimmedEmail },
        data: {
          otp: hashedOtp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
        },
      });
    } else {
      await prisma.otp.create({
        data: {
          email: trimmedEmail,
          otp: hashedOtp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
    }

    // Send OTP email using Elastic Email's API
    const subject = "Your OTP for Account Verification";
    const text = `Hello ${user.name},\n\nHere is your OTP for account verification: ${otp}\n\nThis OTP will expire in 10 minutes.`;

    await sendEmail(trimmedEmail, subject, text);

    return NextResponse.json(
      { message: "OTP sent to your email. Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error sending OTP:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
