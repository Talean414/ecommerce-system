import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// Helper function to get the authenticated user's ID
async function getUserId(session: any): Promise<number | null> {
  if (session?.user?.id) return session.user.id;
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
