import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { order_status } from "@prisma/client"; // Correct enum name

export async function GET() {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure userId is correctly typed (convert to number if required)
    const userId = parseInt(session.user.id); // Convert userId to number
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Fetch user metrics
    const [totalOrders, totalSpentData, wishlistCount] = await Promise.all([
      prisma.order.count({
        where: { userId }, // Use the converted userId
      }),
      prisma.order.aggregate({
        where: {
          userId,
          status: order_status.DELIVERED, // Use the correct enum value (or add COMPLETED to the schema)
        },
        _sum: { total: true },
      }),
      prisma.wishlistitem.count({
        where: { userId },
      }),
    ]);

    // Ensure totalSpent is not undefined
    const totalSpent = totalSpentData._sum?.total ?? 0;

    return NextResponse.json({ totalOrders, totalSpent, wishlistCount });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching user metrics:", error.message);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
    console.error("Unknown error fetching user metrics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}