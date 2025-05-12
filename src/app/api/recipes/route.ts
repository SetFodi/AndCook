import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongodb';
import Recipe from '@/lib/models/Recipe';
import { handler as authOptions } from '../auth/[...nextauth]/route';

// Get all recipes
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    await connectToDatabase();

    let query: any = {};

    if (category) {
      query.categories = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const recipes = await Recipe.find(query)
      .populate('author', 'name image')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments(query);

    return NextResponse.json({
      recipes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { message: 'Error fetching recipes' },
      { status: 500 }
    );
  }
}

// Create a new recipe
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.mainImage) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    // Check if slug already exists
    const existingRecipe = await Recipe.findOne({ slug });
    let finalSlug = slug;
    
    if (existingRecipe) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const newRecipe = new Recipe({
      ...data,
      slug: finalSlug,
      author: session.user.id,
    });

    await newRecipe.save();

    return NextResponse.json(
      { message: 'Recipe created successfully', recipe: newRecipe },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { message: 'Error creating recipe' },
      { status: 500 }
    );
  }
}
