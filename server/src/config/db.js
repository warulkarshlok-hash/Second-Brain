import mongoose from 'mongoose';

let isConnected = false;
let memoryStoreActive = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('\n⚠️  [DATABASE WARNING] MONGODB_URI is not set in server/.env.');
    console.warn('👉 Operating in In-Memory / Graceful Fallback Mode for immediate preview.');
    console.warn('👉 To connect a real database, add your MongoDB connection string in server/.env.\n');
    memoryStoreActive = true;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    memoryStoreActive = false;
    console.log(`✅ [MongoDB Connected] Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.warn('👉 Falling back to Memory Store so backend stays operational.');
    memoryStoreActive = true;
    return false;
  }
};

export const isDbConnected = () => isConnected;
export const isMemoryStoreActive = () => memoryStoreActive;
