import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

export async function PUT(request: Request) {
  try {
    // 🔹 Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    
    // 🔹 Extract form data
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const image = formData.get("image") as File | null;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    let imagePath: string | null = null;
    
    if (image) {
      try {
        // 🔹 Convert image to Buffer
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 🔹 Ensure the uploads directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // 🔹 Generate file path & save the image
        const filename = `${Date.now()}-${image.name.replace(/\s+/g, "_")}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        imagePath = `/uploads/${filename}`;
      } catch (fileError) {
        console.error("Error saving image:", fileError);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }
    }

    // 🔹 Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { id: Number(session.user.id) }, // Ensure ID is a number
      data: {
        name,
        email,
        ...(imagePath && { image: imagePath }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}
