import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for Google users
  googleId: { type: String }, // For Google OAuth users
  phone:    { type: String, sparse: true }, // For OTP verification, sparse index
  isVerified: { type: Boolean, default: false }, // Document verification status
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Create sparse index for phone to allow multiple null values
// Note: sparse index is already created via the schema field definition above

export default mongoose.model("User", userSchema);