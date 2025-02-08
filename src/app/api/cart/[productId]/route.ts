import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

// PUT Request Handler
export async function PUT(request: Request, { params }: { params: { productId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { quantity } = body;

    // Validate quantity
    if (typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Update cart item
    const productId = parseInt(params.productId); // Convert productId to number
    const updatedItem = await prisma.cartitem.updateMany({
      where: {
        cartId: cart.id,
        productId: productId, // Use the converted number
      },
      data: { quantity },
    });

    if (updatedItem.count === 0) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

// DELETE Request Handler
export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Delete cart item
    const productId = parseInt(params.productId); // Convert productId to number
    const deletedItem = await prisma.cartitem.deleteMany({
      where: {
        cartId: cart.id,
        productId: productId, // Use the converted number
      },
    });

    if (deletedItem.count === 0) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Cart item removed successfully" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}