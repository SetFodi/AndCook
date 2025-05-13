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

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Check favorites - Session:', session);

    const url = new URL(req.url);
    const recipeId = url.searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json(
        { message: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get user by email since the ID might not be in the session
    console.log('Looking for user with email:', session.user?.email);

    if (!session.user?.email) {
      return NextResponse.json(
        { message: 'Invalid user session - missing email' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    console.log('Found user:', user ? user._id.toString() : 'not found');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if recipe is in favorites
    const isFavorite = user.favorites && user.favorites.length > 0
      ? user.favorites.some(
          (favId: mongoose.Types.ObjectId) => favId && favId.toString && favId.toString() === recipeId
        )
      : false;

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
