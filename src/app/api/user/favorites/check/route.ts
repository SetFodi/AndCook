import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../lib/db/mongodb';
import User from '../../../../../lib/models/User';
import { handler as authOptions } from '../../../auth/[...nextauth]/route';
import mongoose from 'mongoose';

// Check if a recipe is in user's favorites
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const recipeId = url.searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json(
        { message: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if recipe is in favorites
    const isFavorite = user.favorites.some(
      (favId: mongoose.Types.ObjectId) => favId.toString() === recipeId
    );

    return NextResponse.json({
      isFavorite
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { message: 'Error checking favorite status' },
      { status: 500 }
    );
  }
}
