import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db/mongodb';
import User from '../../../../lib/models/User';

// This endpoint is used to set up the admin user
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Find the user with the specified email
    const adminEmail = 'lukafartenadze2004@gmail.com';
    const user = await User.findOne({ email: adminEmail });

    if (!user) {
      return NextResponse.json(
        { message: `User with email ${adminEmail} not found` },
        { status: 404 }
      );
    }

    // Set the user's role to admin
    user.role = 'admin';
    await user.save();

    return NextResponse.json({
      message: `User ${adminEmail} has been granted admin privileges`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error setting up admin user:', error);
    return NextResponse.json(
      { message: `Error setting up admin user: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
