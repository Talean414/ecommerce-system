import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { writeFile } from "fs/promises";
import path from "path";

// ✅ Update Product (PUT)
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    // ✅ Extract product ID from URL
    const url = new URL(request.url);
    const id = Number(url.pathname.split("/").pop()); // Get last part of the URL as ID
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const name = formData.get("name") as string;
    const price = Number.parseFloat(formData.get("price") as string);
    const stock = Number.parseInt(formData.get("stock") as string);
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    let imagePath = null;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${image.name}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        stock,
        description,
        image: imagePath || undefined, // Keep old image if no new one provided
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// ✅ Delete Product (DELETE)
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ Extract product ID from URL
    const url = new URL(request.url);
    const id = Number(url.pathname.split("/").pop()); // Get last part of the URL as ID
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
