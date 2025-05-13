import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../lib/db/mongodb';
import Recipe from '../../../../../lib/models/Recipe';
import { handler as authOptions } from '../../../auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    // Properly await and destructure params to avoid Next.js warning
    const { slug } = context.params;

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
      (r: any) => r.user === session.user.id
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex] = {
        user: session.user.id,
        userName: session.user.name,
        userImage: session.user.image,
        rating,
        comment: comment || '',
        date: new Date(),
      };
    } else {
      // Add new rating
      recipe.ratings.push({
        user: session.user.id,
        userName: session.user.name,
        userImage: session.user.image,
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

// Delete a rating
export async function DELETE(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = context.params;

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
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

    // Check if this is an admin deletion
    const isAdmin = session.user.email === 'lukafartenadze2004@gmail.com' || session.user.role === 'admin';
    console.log('User role check:', session.user.email, isAdmin ? 'is admin' : 'is not admin');
    let ratingIndexToDelete = -1;

    // If admin is deleting a specific review
    if (isAdmin) {
      try {
        // Try to get the review index from the request body
        const body = await req.json();
        if (body && body.reviewIndex !== undefined) {
          ratingIndexToDelete = body.reviewIndex;
          console.log('Admin deleting review at index:', ratingIndexToDelete);
        }
      } catch (e) {
        // If no body, continue with normal deletion
        console.log('No request body, continuing with normal deletion');
      }
    }

    // If not admin or no specific review index provided, find the user's own review
    if (ratingIndexToDelete === -1) {
      // Find the user's rating by name (more reliable than ID)
      ratingIndexToDelete = recipe.ratings.findIndex((r: any) => {
        // Try to match by user ID first
        if (r.user === session.user.id) return true;

        // Then try to match by name
        if (r.userName && session.user.name && r.userName === session.user.name) return true;

        return false;
      });
    }

    if (ratingIndexToDelete === -1) {
      return NextResponse.json(
        { message: 'Rating not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to delete this review
    if (!isAdmin && recipe.ratings[ratingIndexToDelete].userName !== session.user.name) {
      console.log('Permission denied:', {
        isAdmin,
        reviewUserName: recipe.ratings[ratingIndexToDelete].userName,
        sessionUserName: session.user.name
      });
      return NextResponse.json(
        { message: 'You do not have permission to delete this review' },
        { status: 403 }
      );
    }

    console.log('Permission granted to delete review');

    // Remove the rating
    recipe.ratings.splice(ratingIndexToDelete, 1);

    // Recalculate average rating
    if (recipe.ratings.length > 0) {
      const totalRating = recipe.ratings.reduce(
        (sum: number, item: any) => sum + item.rating,
        0
      );
      recipe.averageRating = totalRating / recipe.ratings.length;
    } else {
      recipe.averageRating = 0;
    }

    await recipe.save();

    return NextResponse.json({
      message: isAdmin ? 'Rating deleted by admin' : 'Rating deleted successfully',
      averageRating: recipe.averageRating,
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    return NextResponse.json(
      { message: 'Error deleting rating' },
      { status: 500 }
    );
  }
}
