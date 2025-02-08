import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { writeFile } from "fs/promises"
import path from "path"

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany()
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const stock = Number.parseInt(formData.get("stock") as string)
    const description = formData.get("description") as string
    const image = formData.get("image") as File

    let imagePath = null
    if (image) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const filename = `${Date.now()}-${image.name}`
      const filepath = path.join(process.cwd(), "public", "uploads", filename)
      await writeFile(filepath, buffer)
      imagePath = `/uploads/${filename}`
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
        stock,
        description,
        image: imagePath,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

