import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get the MongoDB URI
    const mongodbUri = process.env.MONGODB_URI || '';
    
    // Return information about the environment variables
    return NextResponse.json({
      status: 'success',
      environment: process.env.NODE_ENV,
      mongodb_uri: {
        value: mongodbUri,
        length: mongodbUri.length,
        firstChars: mongodbUri.substring(0, 20) + (mongodbUri.length > 20 ? '...' : ''),
        lastChars: mongodbUri.length > 20 ? '...' + mongodbUri.substring(mongodbUri.length - 20) : '',
        containsEquals: mongodbUri.includes('='),
        startsWithProtocol: mongodbUri.startsWith('mongodb://') || mongodbUri.startsWith('mongodb+srv://')
      },
      // Check if the value might be the variable name itself
      possibleIssues: {
        isVariableName: mongodbUri === 'MONGODB_URI',
        isNameEqualsValue: mongodbUri.startsWith('MONGODB_URI='),
        isEmpty: mongodbUri === '',
        hasSpaces: mongodbUri.includes(' ') && !mongodbUri.includes('mongodb+srv://'),
      }
    });
  } catch (error) {
    console.error('Raw env API error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Error in raw-env API',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
