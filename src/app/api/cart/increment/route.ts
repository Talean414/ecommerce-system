import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Session } from "next-auth"; // ✅ Import Session type

async function getUserId(session: Session | null): Promise<number | null> { // ✅ Use explicit type
  if (session?.user?.id) return Number(session.user.id); // Ensure it's a number
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    return user?.id || null;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body: { productId?: number } = await request.json().catch(() => ({})); // ✅ Typed `body`
    if (!body.productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Find the user's cart
    const cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find the cart item; if it doesn't exist, create one with quantity 1
    let cartItem = await prisma.cartitem.findFirst({
      where: { cartId: cart.id, productId: body.productId },
    });

    if (!cartItem) {
      cartItem = await prisma.cartitem.create({
        data: { cartId: cart.id, productId: body.productId, quantity: 1 },
      });
    } else {
      cartItem = await prisma.cartitem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + 1 },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Quantity incremented",
      cartItem,
    });
  } catch (error) {
    console.error("Error incrementing quantity:", error);
    return NextResponse.json({ error: "Failed to increment quantity" }, { status: 500 });
  }
}
