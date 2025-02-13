import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { cartItems, total, ...shippingDetails } = body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's cart ID
    const userCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!userCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Create new order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        total,
        updatedAt: new Date(),
        shipping: {
          create: {
            ...shippingDetails,
            status: 'PENDING',
            updatedAt: new Date(),
          },
        },
        orderitem: {
          create: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Update product stock
    await Promise.all(
      cartItems.map(async (item) => {
        await prisma.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      })
    );

    // Delete cart items using cartId
    await prisma.cartitem.deleteMany({
      where: { cartId: userCart.id }, // Correctly reference cartId
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    const take = limit ? parseInt(limit) : undefined;

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderitem: {
          include: { product: true },
        },
        shipping: true,
      },
      orderBy: { createdAt: 'desc' },
      take,
    });

    return NextResponse.json(orders ?? []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
