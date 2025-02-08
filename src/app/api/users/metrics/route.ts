import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [totalOrders, totalSpent, wishlistCount] = await Promise.all([
      prisma.order.count({
        where: { userId },
      }),
      prisma.order.aggregate({
        where: { userId, status: "COMPLETED" },
        _sum: { total: true },
      }),
      prisma.wishlistItem.count({
        where: { userId },
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      totalSpent: totalSpent._sum.total || 0,
      wishlistCount,
    });
  } catch (error) {
    console.error("Error fetching user metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
