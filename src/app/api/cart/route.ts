import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"
import { Session } from "next-auth"; // ✅ Import Session type

// Helper function to get the authenticated user's ID
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

// GET: Fetch the user's cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = await getUserId(session);
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { cartitem: { include: { product: true } } },
    });

    return NextResponse.json({ items: cart?.cartitem || [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// ✅ POST: Add item to cart
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = await getUserId(session);
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { productId, quantity = 1 } = await request.json();
    if (!productId) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Find or create the cart
    let cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item is already in the cart
    const existingCartItem = await prisma.cartitem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      await prisma.cartitem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Add new item to cart
      await prisma.cartitem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return NextResponse.json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}
