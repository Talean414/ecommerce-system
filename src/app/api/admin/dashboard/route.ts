import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() { // ✅ Fixed: Removed unused request
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Test database connection
    await prisma.$connect()

    const [totalRevenue, totalOrders, totalProducts, lowStockProducts, recentOrders, userCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: 'COMPLETED' },
      }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        select: { id: true, name: true, stock: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      }),
      prisma.user.count(),
    ])

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalProducts,
      lowStockProducts,
      recentOrders,
      userCount,
    })
  } catch (error) {
    console.error('Error in admin dashboard GET route:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
