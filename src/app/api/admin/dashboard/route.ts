import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { order_status } from "@prisma/client"; // ✅ Ensure Prisma enums are properly generated

export async function GET() {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    if (!session || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch admin dashboard metrics
    const [totalRevenue, totalOrders, totalProducts, lowStockProducts, recentOrders, userCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: order_status?.COMPLETED }, // ✅ Make sure it's not undefined
      }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.product.findMany({
        where: { stock: { lte: 10 } }, // Products with stock <= 10
        select: { id: true, name: true, stock: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" }, // Recent orders
        include: { user: { select: { name: true } } },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum?.total ?? 0, // Default to 0 if no revenue
      totalOrders,
      totalProducts,
      lowStockProducts,
      recentOrders,
      userCount,
    });
  } catch (error) {
    console.error("Error in admin dashboard GET route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
