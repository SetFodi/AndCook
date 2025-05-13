import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectToDatabase from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/User';
import { handler as authOptions } from '../../auth/[...nextauth]/route';

// Get all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow the specific admin user or users with admin role
    if (session.user?.email !== 'lukafartenadze2004@gmail.com' && session.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    console.log('Admin users API: Connected to database');

    // Get all users, excluding password field
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    console.log(`Admin users API: Found ${users.length} users`);

    // Log the first user for debugging
    if (users.length > 0) {
      console.log('Admin users API: First user:', JSON.stringify(users[0], null, 2));
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: `Error fetching users: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
