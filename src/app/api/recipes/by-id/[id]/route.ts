import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../../lib/db/mongodb';
import Recipe from '../../../../../lib/models/Recipe';
import User from '../../../../../lib/models/User';
import { handler as authOptions } from '../../../auth/[...nextauth]/route';

// Get a specific recipe by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const recipe = await Recipe.findById(params.id)
      .populate('author', 'name image')
      .populate('categories', 'name slug');

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { message: `Error fetching recipe: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Update a recipe
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Find the recipe
    const recipe = await Recipe.findById(params.id);

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to update this recipe
    // Allow if user is the author or has admin role
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const isAdmin = user.role === 'admin' || session.user.email === 'lukafartenadze2004@gmail.com';
    const isAuthor = recipe.author.toString() === user._id.toString();

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { message: 'You are not authorized to update this recipe' },
        { status: 403 }
      );
    }

    // Update slug if title has changed
    let slug = recipe.slug;
    if (data.title !== recipe.title) {
      slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      // Check if slug already exists
      const existingRecipe = await Recipe.findOne({ slug, _id: { $ne: params.id } });
      if (existingRecipe) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Update recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      params.id,
      {
        ...data,
        slug,
      },
      { new: true }
    ).populate('author', 'name image').populate('categories', 'name slug');

    return NextResponse.json({
      message: 'Recipe updated successfully',
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { message: `Error updating recipe: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Delete a recipe
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find the recipe
    const recipe = await Recipe.findById(params.id);

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete this recipe
    // Allow if user is the author or has admin role
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const isAdmin = user.role === 'admin' || session.user.email === 'lukafartenadze2004@gmail.com';
    const isAuthor = recipe.author.toString() === user._id.toString();

    if (!isAdmin && !isAuthor) {
      return NextResponse.json(
        { message: 'You are not authorized to delete this recipe' },
        { status: 403 }
      );
    }

    // Delete recipe
    await Recipe.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Recipe deleted successfully',
      deletedRecipe: {
        id: recipe._id,
        title: recipe.title,
        slug: recipe.slug
      }
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { message: `Error deleting recipe: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
