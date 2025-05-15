import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(req: NextRequest) {
  // Hardcoded connection string as a fallback
  const hardcodedUri = 'mongodb+srv://setfodimaro:kakilo123@andcook.annqlf9.mongodb.net/?retryWrites=true&w=majority';
  
  // Get the connection string from environment or use hardcoded
  const uri = process.env.MONGODB_URI || hardcodedUri;
  
  let client;
  try {
    // Create a new MongoClient
    client = new MongoClient(uri);
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Ping the database to confirm connection
    await client.db('admin').command({ ping: 1 });
    
    // Get a list of databases
    const dbs = await client.db().admin().listDatabases();
    
    return NextResponse.json({
      status: 'success',
      message: 'Connected to MongoDB successfully',
      databases: dbs.databases.map(db => db.name),
      connectionString: {
        length: uri.length,
        firstChars: uri.substring(0, 20) + '...',
        isHardcoded: uri === hardcodedUri
      }
    });
  } catch (error) {
    console.error('Direct MongoDB connection error:', error);
    
    // Try with hardcoded string if it failed and we weren't already using it
    if (uri !== hardcodedUri) {
      try {
        client = new MongoClient(hardcodedUri);
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        
        return NextResponse.json({
          status: 'success with hardcoded string',
          message: 'Failed with environment variable but succeeded with hardcoded connection string',
          error: error instanceof Error ? error.message : String(error)
        });
      } catch (hardcodedError) {
        return NextResponse.json({
          status: 'error',
          message: 'Failed with both environment variable and hardcoded connection string',
          environmentError: error instanceof Error ? error.message : String(error),
          hardcodedError: hardcodedError instanceof Error ? hardcodedError.message : String(hardcodedError)
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Error connecting to MongoDB',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}
