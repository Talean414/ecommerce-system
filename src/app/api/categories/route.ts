import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching categories...');
    const categories = await prisma.category.findMany();
    console.log('Categories fetched successfully:', categories);
    return NextResponse.json({ categories });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching categories:', error.message, error.stack);
    } else {
      console.error('Unknown error fetching categories:', error);
    }
    return NextResponse.json({ error: 'Internal Server Error', categories: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);

    if (!body.name) {
      console.error('Validation Error: "name" is required');
      return NextResponse.json({ error: '"name" is required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        updatedAt: new Date(), // ✅ Fix: Prisma requires updatedAt
      },
    });

    console.log('Category created successfully:', category);
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating category:', error.message, error.stack);
    } else {
      console.error('Unknown error creating category:', error);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
