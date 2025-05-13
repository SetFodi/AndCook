import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/User';
import { handler as authOptions } from '../../auth/[...nextauth]/route';

// Get user profile
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    // Access params safely
    const id = context.params.id;

    console.log("GET /api/users/[id] - Request for user ID:", id);
    console.log("Session user:", session?.user);

    if (!session) {
      console.log("No session found, returning 401");
      return NextResponse.json(
        { message: 'Unauthorized - No session' },
        { status: 401 }
      );
    }

    // For debugging purposes, log the entire session
    console.log("Full session object:", JSON.stringify(session, null, 2));

    if (!session.user) {
      console.log("Session missing user object, returning 401");
      return NextResponse.json(
        { message: 'Unauthorized - No user in session' },
        { status: 401 }
      );
    }

    // Add the ID from the token if it's missing in the user object
    if (!session.user.id && session.user.email) {
      console.log("Session user missing ID but has email, attempting to find user by email");

      await connectToDatabase();
      const userByEmail = await User.findOne({ email: session.user.email }).select('_id');

      if (userByEmail) {
        console.log("Found user by email, using ID:", userByEmail._id.toString());
        session.user.id = userByEmail._id.toString();
      } else {
        console.log("Could not find user by email");
        return NextResponse.json(
          { message: 'Unauthorized - User not found' },
          { status: 401 }
        );
      }
    } else if (!session.user.id) {
      console.log("Session missing user ID and email, returning 401");
      return NextResponse.json(
        { message: 'Unauthorized - Invalid session (no ID or email)' },
        { status: 401 }
      );
    }

    // Validate that the ID is a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id);
      return NextResponse.json(
        { message: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      console.log("User not found for ID:", id);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Only allow users to view their own profile
    if (user._id.toString() !== session.user.id) {
      console.log("Authorization mismatch. User ID:", user._id.toString(), "Session user ID:", session.user.id);
      return NextResponse.json(
        { message: 'Not authorized to view this profile' },
        { status: 403 }
      );
    }

    console.log("Successfully fetched user profile for ID:", id);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: `Error fetching user profile: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    // Access params safely
    const id = context.params.id;

    console.log("PUT /api/users/[id] - Update request for user ID:", id);
    console.log("Session user:", session?.user);

    if (!session) {
      console.log("No session found, returning 401");
      return NextResponse.json(
        { message: 'Unauthorized - No session' },
        { status: 401 }
      );
    }

    // For debugging purposes, log the entire session
    console.log("Full session object (PUT):", JSON.stringify(session, null, 2));

    if (!session.user) {
      console.log("Session missing user object, returning 401");
      return NextResponse.json(
        { message: 'Unauthorized - No user in session' },
        { status: 401 }
      );
    }

    // Add the ID from the token if it's missing in the user object
    if (!session.user.id && session.user.email) {
      console.log("Session user missing ID but has email, attempting to find user by email");

      await connectToDatabase();
      const userByEmail = await User.findOne({ email: session.user.email }).select('_id');

      if (userByEmail) {
        console.log("Found user by email, using ID:", userByEmail._id.toString());
        session.user.id = userByEmail._id.toString();
      } else {
        console.log("Could not find user by email");
        return NextResponse.json(
          { message: 'Unauthorized - User not found' },
          { status: 401 }
        );
      }
    } else if (!session.user.id) {
      console.log("Session missing user ID and email, returning 401");
      return NextResponse.json(
        { message: 'Unauthorized - Invalid session (no ID or email)' },
        { status: 401 }
      );
    }

    // Only allow users to update their own profile
    if (id !== session.user.id) {
      console.log("Authorization mismatch. Request ID:", id, "Session user ID:", session.user.id);
      return NextResponse.json(
        { message: 'Not authorized to update this profile' },
        { status: 403 }
      );
    }

    const data = await req.json();
    console.log("Update data received:", data);

    // Validate input
    if (!data.name) {
      console.log("Missing required field: name");
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate that the ID is a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format:", id);
      return NextResponse.json(
        { message: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: data.name,
        bio: data.bio,
        image: data.image,
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      console.log("User not found for ID:", id);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log("Successfully updated user profile for ID:", id);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: `Error updating user profile: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
