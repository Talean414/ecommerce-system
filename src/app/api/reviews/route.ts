import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure prisma is correctly set up
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// GET: Fetch reviews
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: { select: { name: true } } }, // Include reviewer name
      orderBy: { createdAt: "desc" }, // Latest first
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Submit a new review (Requires authentication)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();
    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save review in database
    const review = await prisma.review.create({
      data: {
        productId,
        userId: Number(session.user.id),
        rating,
        comment,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
