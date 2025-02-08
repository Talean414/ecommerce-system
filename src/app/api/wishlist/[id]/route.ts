import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wishlistItem = await prisma.wishlistItem.deleteMany({
    where: {
      userId: session.user.id,
      productId: parseInt(params.id),
    },
  })

  return NextResponse.json(wishlistItem)
}

