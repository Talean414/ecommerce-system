// src/lib/api.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getProducts = async () => {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany()
    return products
  } catch (error) {
    console.error("Error fetching products from database:", error)
    return []
  } finally {
    await prisma.$disconnect() // Disconnect Prisma client after query
  }
}
