import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../lib/db/mongodb';
import Recipe from '../../../../lib/models/Recipe';
import { handler as authOptions } from '../../auth/[...nextauth]/route';

// Get all recipes (admin only, no pagination)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow the specific admin user or users with admin role
    if (session.user?.email !== 'lukafartenadze2004@gmail.com' && session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    console.log('Admin recipes API: Connected to database');

    // Get all recipes with author and category information
    const recipes = await Recipe.find()
      .populate('author', 'name email')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 });

    console.log(`Admin recipes API: Found ${recipes.length} recipes`);

    // Log the first recipe for debugging
    if (recipes.length > 0) {
      console.log('Admin recipes API: First recipe:', JSON.stringify(recipes[0], null, 2));
    }

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { message: `Error fetching recipes: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}


