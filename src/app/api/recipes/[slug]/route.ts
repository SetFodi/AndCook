import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '@/lib/db/mongodb';
import Recipe from '@/lib/models/Recipe';
import { handler as authOptions } from '../../auth/[...nextauth]/route';

// Get a recipe by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    await connectToDatabase();

    const recipe = await Recipe.findOne({ slug })
      .populate('author', 'name image')
      .populate('categories', 'name slug');

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { message: 'Error fetching recipe' },
      { status: 500 }
    );
  }
}

// Update a recipe
export async function PUT(
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

    await connectToDatabase();

    const recipe = await Recipe.findOne({ slug });

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (recipe.author.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Not authorized to update this recipe' },
        { status: 403 }
      );
    }

    const data = await req.json();
    
    // Update the recipe
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { slug },
      { ...data },
      { new: true }
    );

    return NextResponse.json({
      message: 'Recipe updated successfully',
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { message: 'Error updating recipe' },
      { status: 500 }
    );
  }
}

// Delete a recipe
export async function DELETE(
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

    await connectToDatabase();

    const recipe = await Recipe.findOne({ slug });

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (recipe.author.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Not authorized to delete this recipe' },
        { status: 403 }
      );
    }

    await Recipe.findOneAndDelete({ slug });

    return NextResponse.json({
      message: 'Recipe deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { message: 'Error deleting recipe' },
      { status: 500 }
    );
  }
}
