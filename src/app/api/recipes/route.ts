import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../lib/db/mongodb';
import Recipe from '../../../lib/models/Recipe';
import User from '../../../lib/models/User';
import { handler as authOptions } from '../auth/[...nextauth]/route';

// Get all recipes
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const categories = url.searchParams.getAll('categories');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    await connectToDatabase();

    let query: any = {};

    if (categories && categories.length > 0) {
      try {
        // Convert string IDs to ObjectId if they are valid MongoDB ObjectIds
        const mongoose = require('mongoose');
        const validObjectIds = categories.filter(id => {
          try {
            return mongoose.Types.ObjectId.isValid(id);
          } catch (e) {
            return false;
          }
        });

        if (validObjectIds.length > 0) {
          // Use $in operator to match any category in the array
          query.categories = { $in: validObjectIds };
          console.log('Filtering by categories:', validObjectIds);
        }
      } catch (error) {
        console.error('Error processing category filters:', error);
      }
    } else {
      console.log('No category filters applied');
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

    console.log("POST /api/recipes - Session:", JSON.stringify(session, null, 2));

    const data = await req.json();

    // Validate required fields
    if (!data.title || !data.description || !data.mainImage) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by email since the ID might not be in the session
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found. Please complete your profile first.' },
        { status: 400 }
      );
    }

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
      author: user._id, // Use the user's MongoDB _id
    });

    await newRecipe.save();

    return NextResponse.json(
      { message: 'Recipe created successfully', recipe: newRecipe },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { message: `Error creating recipe: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
