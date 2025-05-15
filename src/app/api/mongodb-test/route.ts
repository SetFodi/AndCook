import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    // Get the connection string directly from the environment
    const connectionString = process.env.MONGODB_URI || '';
    
    // Log information about the connection string
    console.log('Connection string length:', connectionString.length);
    console.log('Connection string starts with mongodb+srv://', connectionString.startsWith('mongodb+srv://'));
    console.log('Connection string first 20 chars:', connectionString.substring(0, 20));
    
    // Try different connection string formats
    const formats = [
      // Original
      connectionString,
      // Without query parameters
      connectionString.split('?')[0],
      // With explicit options
      `${connectionString.split('?')[0]}?retryWrites=true&w=majority`,
      // With srv protocol explicitly
      connectionString.startsWith('mongodb+srv://') ? connectionString : `mongodb+srv://${connectionString.replace('mongodb://', '')}`,
      // Hardcoded connection string
      'mongodb+srv://setfodimaro:kakilo123@andcook.annqlf9.mongodb.net/?retryWrites=true&w=majority'
    ];
    
    // Try each format
    const results = [];
    
    for (let i = 0; i < formats.length; i++) {
      const format = formats[i];
      try {
        // Close any existing connection
        if (mongoose.connection.readyState !== 0) {
          await mongoose.connection.close();
        }
        
        // Try to connect
        console.log(`Trying format ${i}:`, format.substring(0, 20) + '...');
        await mongoose.connect(format);
        
        results.push({
          format: i,
          success: true,
          readyState: mongoose.connection.readyState,
          message: 'Connected successfully'
        });
        
        // If we get here, we've successfully connected
        break;
      } catch (error) {
        results.push({
          format: i,
          success: false,
          message: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // Return the results
    return NextResponse.json({
      status: 'completed',
      results,
      connectionInfo: {
        readyState: mongoose.connection.readyState,
        readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
      }
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error in MongoDB test',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
