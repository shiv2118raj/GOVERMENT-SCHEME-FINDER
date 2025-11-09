import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import User from "./models/user.js";
import Scheme from "./models/scheme.js";
import Application from "./models/application.js";

const app = express();
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://devanshkrishana5_db_user:p1BwC6InizFDcWpB@cluster0.3oqvdai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware setup
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001"
  ],
  credentials: true
}));
app.use(bodyParser.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ msg: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "SchemeSeva Backend Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    features: [
      "Authentication",
      "Scheme Management", 
      "Application Processing",
      "Admin Dashboard",
      "Document Upload",
      "Google OAuth"
    ]
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
});

// Get user profile
app.get("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get schemes
app.get("/api/schemes", async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, schemes });
  } catch (err) {
    console.error("Schemes error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get applications
app.get("/api/applications", authenticateToken, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    console.error("Applications error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Admin routes
app.get("/api/admin/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Admin access required" });
    }
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/api/admin/applications", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Admin access required" });
    }
    const applications = await Application.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    console.error("Admin applications error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      console.log(`🚀 SchemeSeva Backend Server running on port ${PORT}`);
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`🔗 Frontend URL: http://localhost:3000`);
      console.log(`🔐 Admin Login: kishu@gmail.com / 123`);
      console.log(`📝 Test login: POST http://localhost:${PORT}/api/auth/login`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
