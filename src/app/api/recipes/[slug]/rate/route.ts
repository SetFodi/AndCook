import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../lib/db/mongodb';
import Recipe from '../../../../../lib/models/Recipe';
import { handler as authOptions } from '../../../auth/[...nextauth]/route';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = params;

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { rating, comment } = await req.json();

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const recipe = await Recipe.findOne({ slug });

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if user has already rated this recipe
    const existingRatingIndex = recipe.ratings.findIndex(
      (r: any) => r.user.toString() === session.user.id
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex] = {
        user: session.user.id,
        rating,
        comment: comment || '',
        date: new Date(),
      };
    } else {
      // Add new rating
      recipe.ratings.push({
        user: session.user.id,
        rating,
        comment: comment || '',
        date: new Date(),
      });
    }

    // Calculate average rating
    const totalRating = recipe.ratings.reduce(
      (sum: number, item: any) => sum + item.rating,
      0
    );
    recipe.averageRating = totalRating / recipe.ratings.length;

    await recipe.save();

    return NextResponse.json({
      message: 'Rating submitted successfully',
      averageRating: recipe.averageRating,
    });
  } catch (error) {
    console.error('Error rating recipe:', error);
    return NextResponse.json(
      { message: 'Error rating recipe' },
      { status: 500 }
    );
  }
}
