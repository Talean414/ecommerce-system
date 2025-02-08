import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const image = formData.get("image") as File | null

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    let imagePath = null
    if (image) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const filename = `${Date.now()}-${image.name}`
      const filepath = path.join(process.cwd(), "public", "uploads", filename)
      await writeFile(filepath, buffer)
      imagePath = `/uploads/${filename}`
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        ...(imagePath && { image: imagePath }),
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile", details: error.message }, { status: 500 })
  }
}