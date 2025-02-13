import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistitem.findMany({
      where: { userId: Number(session.user.id) },
      include: { product: true },
    });
    

    return NextResponse.json(wishlistItems.map((item) => item.product));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId || typeof productId !== "number") {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const existingItem = await prisma.wishlistitem.findFirst({
      where: {
        userId: Number(session.user.id), // ✅ Convert to number
        productId,
      },
    });
    

    if (existingItem) {
      return NextResponse.json({ message: "Item already in wishlist" });
    }

    await prisma.wishlistitem.create({
      data: {
        userId: Number(session.user.id), // ✅ Convert to number
        productId,
      },
    });
    

    return NextResponse.json({
      success: true,
      message: "Item added to wishlist successfully",
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add item to wishlist" },
      { status: 500 }
    );
  }
}
