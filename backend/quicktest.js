import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected"))
  .catch(err => console.error("❌", err.message));