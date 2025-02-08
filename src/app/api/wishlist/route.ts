import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistitem.findMany({
      where: { userId: session.user.id },
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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    const existingItem = await prisma.wishlistitem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existingItem) {
      return NextResponse.json({ message: "Item already in wishlist" });
    }

    await prisma.wishlistitem.create({
      data: {
        userId: session.user.id,
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
