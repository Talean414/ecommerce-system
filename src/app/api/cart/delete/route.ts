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
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = await getUserId(session);
    if (!userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const payload = await request.json().catch(() => ({}));
    if (!payload || Object.keys(payload).length === 0)
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });

    const { productId } = payload;
    if (!productId)
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    const cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart)
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const cartItem = await prisma.cartitem.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (!cartItem)
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });

    await prisma.cartitem.delete({ where: { id: cartItem.id } });
    return NextResponse.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item:", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
