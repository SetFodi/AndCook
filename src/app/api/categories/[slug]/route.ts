import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db/mongodb';
import Category from '../../../../lib/models/Category';

// Get a category by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    await connectToDatabase();

    const category = await Category.findOne({ slug });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { message: 'Error fetching category' },
      { status: 500 }
    );
  }
}
