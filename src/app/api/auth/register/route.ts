// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, email, password } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Trim the email
    const trimmedEmail = email.trim();

    // Check if a user already exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with verified set to false
    await prisma.user.create({
      data: {
        name,
        email: trimmedEmail,
        password: hashedPassword,
        verified: false,
        updatedAt: new Date(), // In case you need to manually set updatedAt
      },
    });

    // Return a success response with a redirect to the dashboard.
    return NextResponse.json(
      {
        message:
          "Registration successful. Please verify your email from your dashboard.",
        redirect: "/dashboard",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
