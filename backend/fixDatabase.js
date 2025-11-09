import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://devanshkrishana5_db_user:p1BwC6InizFDcWpB@cluster0.3oqvdai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function fixDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Drop the problematic phone index if it exists
    try {
      await collection.dropIndex('phone_1');
      console.log("🗑️ Dropped existing phone index");
    } catch (error) {
      console.log("ℹ️ Phone index doesn't exist or already dropped");
    }

    // Create sparse index for phone
    await collection.createIndex({ phone: 1 }, { sparse: true });
    console.log("✅ Created sparse phone index");

    console.log("🎉 Database fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing database:", error);
    process.exit(1);
  }
}

fixDatabase();
