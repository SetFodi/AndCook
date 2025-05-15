import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    // Get the MongoDB URI
    let mongodbUri = process.env.MONGODB_URI || '';
    
    // Trim any whitespace
    mongodbUri = mongodbUri.trim();
    
    // Check if it has the correct format
    const hasValidPrefix = mongodbUri.startsWith('mongodb://') || mongodbUri.startsWith('mongodb+srv://');
    
    // Try to connect directly without using the connectToDatabase function
    let connectionResult = 'Not attempted';
    let error = null;
    
    if (hasValidPrefix) {
      try {
        // Close any existing connections
        if (mongoose.connection.readyState) {
          await mongoose.connection.close();
        }
        
        // Try to connect
        await mongoose.connect(mongodbUri, { bufferCommands: false });
        connectionResult = 'Success';
      } catch (err) {
        connectionResult = 'Failed';
        error = err instanceof Error ? err.message : String(err);
      }
    }
    
    // Return diagnostic information
    return NextResponse.json({
      status: 'success',
      environment: process.env.NODE_ENV,
      mongodb: {
        uriLength: mongodbUri.length,
        hasValidPrefix,
        uriFirstChars: mongodbUri.substring(0, Math.min(20, mongodbUri.length)) + '...',
        connectionResult,
        error,
        readyState: mongoose.connection.readyState,
        // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
      }
    });
  } catch (error) {
    console.error('Test DB API error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Error in test-db API',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
