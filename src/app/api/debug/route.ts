import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/db/mongodb';
import Recipe from '../../../lib/models/Recipe';
import Category from '../../../lib/models/Category';
import User from '../../../lib/models/User';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get counts
    const recipeCount = await Recipe.countDocuments();
    const categoryCount = await Category.countDocuments();
    const userCount = await User.countDocuments();

    // Get a sample of recent recipes
    const recentRecipes = await Recipe.find()
      .sort({ _id: -1 })
      .limit(5)
      .select('title slug createdAt')
      .lean();

    // Get a sample of categories
    const categories = await Category.find()
      .limit(10)
      .select('name slug')
      .lean();

    // Return the diagnostic information
    return NextResponse.json({
      status: 'success',
      environment: process.env.NODE_ENV,
      mongodb: {
        uri: process.env.MONGODB_URI ?
          `${process.env.MONGODB_URI.split('@')[0].split('://')[0]}://*****@${process.env.MONGODB_URI.split('@')[1]}` :
          'Not configured',
        uriFirstChars: process.env.MONGODB_URI ?
          process.env.MONGODB_URI.substring(0, 20) + '...' :
          'Not available',
        uriLength: process.env.MONGODB_URI ?
          process.env.MONGODB_URI.length :
          0,
        uriStartsWith: process.env.MONGODB_URI ?
          process.env.MONGODB_URI.startsWith('mongodb+srv://') :
          false,
      },
      counts: {
        recipes: recipeCount,
        categories: categoryCount,
        users: userCount,
      },
      samples: {
        recentRecipes,
        categories,
      },
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error connecting to database',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
