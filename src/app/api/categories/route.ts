import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongodb';
import Category from '@/lib/models/Category';
import { handler as authOptions } from '../auth/[...nextauth]/route';

// Get all categories
export async function GET() {
  try {
    await connectToDatabase();

    const categories = await Category.find().sort({ name: 1 });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

// Create a new category (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real app, you would check if the user is an admin
    // For now, we'll allow any authenticated user to create categories

    const { name, description, image } = await req.json();
    
    if (!name) {
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    // Check if category already exists
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Category already exists' },
        { status: 409 }
      );
    }

    const newCategory = new Category({
      name,
      description,
      image,
      slug,
    });

    await newCategory.save();

    return NextResponse.json(
      { message: 'Category created successfully', category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { message: 'Error creating category' },
      { status: 500 }
    );
  }
}
