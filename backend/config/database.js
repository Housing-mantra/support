const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Allow Mongoose to buffer commands until connected
    };


    // CHECK IF URI IS DEFINED
    if (!process.env.MONGODB_URI) {
      console.error('❌ FATAL ERROR: MONGODB_URI environment variable is not defined.');
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('Connecting to MongoDB...');
    // Log masked URI for debugging (show first 15 chars)
    console.log(`Debug URI: ${process.env.MONGODB_URI.substring(0, 15)}...`);

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB Connection Error:', e);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
