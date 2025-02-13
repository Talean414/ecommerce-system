import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { order_status } from "@prisma/client"; // Import the order_status enum

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test database connection
    await prisma.$connect();

    // Fetch admin dashboard metrics
    const [totalRevenue, totalOrders, totalProducts, lowStockProducts, recentOrders, userCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: order_status.COMPLETED }, // Use the correct enum value
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
  } catch (error: unknown) {
    // Narrow down the type of 'error' to ensure it is an instance of Error
    if (error instanceof Error) {
      console.error("Error in admin dashboard GET route:", error.message);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error in admin dashboard GET route:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}