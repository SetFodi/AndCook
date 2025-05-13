import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/User';
import Recipe from '../../../../lib/models/Recipe';
import { handler as authOptions } from '../../auth/[...nextauth]/route';
import mongoose from 'mongoose';

// Add a recipe to favorites
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { recipeId } = await req.json();

    if (!recipeId) {
      return NextResponse.json(
        { message: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Add recipe to user's favorites if not already there
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if recipe is already in favorites
    const isAlreadyFavorite = user.favorites.some(
      (favId: mongoose.Types.ObjectId) => favId.toString() === recipeId
    );

    if (isAlreadyFavorite) {
      // Remove from favorites (toggle behavior)
      await User.findByIdAndUpdate(
        session.user.id,
        { $pull: { favorites: recipeId } },
        { new: true }
      );
      return NextResponse.json({
        message: 'Recipe removed from favorites',
        isFavorite: false
      });
    } else {
      // Add to favorites
      await User.findByIdAndUpdate(
        session.user.id,
        { $addToSet: { favorites: recipeId } },
        { new: true }
      );
      return NextResponse.json({
        message: 'Recipe added to favorites',
        isFavorite: true
      });
    }
  } catch (error) {
    console.error('Error updating favorites:', error);
    return NextResponse.json(
      { message: 'Error updating favorites' },
      { status: 500 }
    );
  }
}

// Get user's favorites
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id).populate('favorites');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favorites: user.favorites || []
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { message: 'Error fetching favorites' },
      { status: 500 }
    );
  }
}
