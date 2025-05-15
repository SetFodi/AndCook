import mongoose from 'mongoose';

// Hardcoded connection string that we know works
const HARDCODED_URI = process.env.MONGODB_URI_BACKUP || '';


// Get the MongoDB URI and clean it up
let MONGODB_URI = process.env.MONGODB_URI || '';

// Trim any whitespace
MONGODB_URI = MONGODB_URI.trim();

// Check if the environment variable is valid
const isValidUri = MONGODB_URI.startsWith('mongodb://') || MONGODB_URI.startsWith('mongodb+srv://');

// If the environment variable is not valid, use the hardcoded URI
if (!isValidUri) {
  console.log('Invalid MongoDB URI from environment, using hardcoded URI instead');
  MONGODB_URI = HARDCODED_URI;
}

// Final check
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // In production, we'll create a new connection each time to ensure fresh data
  if (process.env.NODE_ENV === 'production') {
    // Close any existing connection
    if (mongoose.connection.readyState) {
      await mongoose.connection.close();
    }

    // Create a new connection
    const opts = {
      bufferCommands: false,
    };

    const conn = await mongoose.connect(MONGODB_URI, opts);
    return conn;
  }

  // In development, use cached connection
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
