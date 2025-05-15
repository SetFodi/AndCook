import mongoose from 'mongoose';

// Get the MongoDB URI and clean it up
let MONGODB_URI = process.env.MONGODB_URI || '';

// Trim any whitespace
MONGODB_URI = MONGODB_URI.trim();

// Ensure it starts with the correct protocol
if (MONGODB_URI && !MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  // If it doesn't have the protocol, try to fix it
  if (MONGODB_URI.includes('@') && MONGODB_URI.includes('.mongodb.net')) {
    // It looks like a MongoDB Atlas URI without the protocol
    MONGODB_URI = `mongodb+srv://${MONGODB_URI}`;
    console.log('Fixed MongoDB URI by adding mongodb+srv:// prefix');
  } else {
    console.error('Invalid MongoDB URI format:',
      MONGODB_URI.substring(0, 10) + '...' +
      ' (length: ' + MONGODB_URI.length + ')'
    );
  }
}

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
