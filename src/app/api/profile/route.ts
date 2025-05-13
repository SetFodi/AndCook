import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../lib/db/mongodb';
import User from '../../../lib/models/User';
import Recipe from '../../../lib/models/Recipe';
import { handler as authOptions } from '../auth/[...nextauth]/route';

// Get current user profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log("GET /api/profile - Session:", JSON.stringify(session, null, 2));

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized - No session' },
        { status: 401 }
      );
    }

    if (!session.user) {
      return NextResponse.json(
        { message: 'Unauthorized - No user in session' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find user by email since the ID might not be in the session
    const user = await User.findOne({ email: session.user.email }).select('-password');

    if (!user) {
      console.log("User not found for email:", session.user.email);

      // Create a new user if one doesn't exist
      const newUser = new User({
        name: session.user.name || 'User',
        email: session.user.email,
        image: session.user.image || '',
        bio: '',
      });

      await newUser.save();
      console.log("Created new user:", newUser);

      return NextResponse.json({
        profile: newUser,
        recipes: []
      });
    }

    // Populate favorites with full recipe data
    await user.populate('favorites');

    // Get user recipes
    const recipes = await Recipe.find({ author: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      profile: user,
      recipes: recipes || []
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: `Error fetching user profile: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Update current user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log("PUT /api/profile - Session:", JSON.stringify(session, null, 2));

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized - No session' },
        { status: 401 }
      );
    }

    if (!session.user) {
      return NextResponse.json(
        { message: 'Unauthorized - No user in session' },
        { status: 401 }
      );
    }

    const data = await req.json();
    console.log("Update data received:", data);

    // Validate input
    if (!data.name) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by email since the ID might not be in the session
    let user = await User.findOne({ email: session.user.email });

    if (!user) {
      console.log("User not found for email in PUT:", session.user.email);

      // Create a new user if one doesn't exist
      user = new User({
        name: data.name,
        email: session.user.email,
        image: data.image || '',
        bio: data.bio || '',
      });

      await user.save();
      console.log("Created new user in PUT:", user);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name: data.name,
        bio: data.bio,
        image: data.image,
      },
      { new: true }
    ).select('-password');

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: `Error updating user profile: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
