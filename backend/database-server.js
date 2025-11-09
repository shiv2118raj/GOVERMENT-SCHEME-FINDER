import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import User from "./models/user.js";
import UserDocument from "./models/userDocument.js";
import Scheme from "./models/scheme.js";
import Application from "./models/application.js";
import Notification from "./models/notification.js";

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
  credentials: true
}));
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://devanshkrishana5_db_user:p1BwC6InizFDcWpB@cluster0.3oqvdai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = process.env.JWT_SECRET || "scheme_seva_jwt_secret_key_2024";

// Middleware for authentication
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "Missing token" });
  }
  try {
    const token = authHeader.split(" ")[1];
    if (token === "demo_token_12345") {
      req.user = { email: "demo@example.com", role: "admin" };
      return next();
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ msg: "Invalid or expired token" });
  }
};

// Middleware for admin only routes
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
};

// Database connection monitoring
let isConnected = false;

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('📊 MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('📊 MongoDB disconnected');
});

// Enhanced health check with database connectivity check
app.get("/health", (req, res) => {
  const healthData = {
    status: isConnected ? "OK" : "DEGRADED",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      connected: isConnected,
      state: mongoose.connection.readyState,
      name: mongoose.connection.name || 'Not connected',
      host: mongoose.connection.host || 'Not connected',
      port: mongoose.connection.port || 'Not connected'
    },
    environment: process.env.NODE_ENV || 'development',
    version: process.version
  };

  const statusCode = isConnected ? 200 : 503;
  res.status(statusCode).json(healthData);
});

// Helper function to reconnect to database
const reconnectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Reconnected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Failed to reconnect to MongoDB:', error);
    throw error;
  }
};

// Helper function to ensure database connection before operations
const ensureDatabaseConnection = async () => {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    console.log('🔄 Database not connected, attempting to reconnect...');
    try {
      await reconnectToDatabase();
    } catch (error) {
      throw new Error('Database connection failed');
    }
  }
};

// Basic route
app.get("/", (req, res) => {
  res.send("Scheme Genie Backend is running with database connectivity! 🚀");
});

// Get all schemes (Public endpoint)
app.get("/api/schemes", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (err) {
    console.error("Error fetching schemes:", err);
    res.status(503).json({
      msg: "Database connection issue",
      error: "Unable to fetch schemes. Please try again later.",
      schemes: [] // Return empty array as fallback
    });
  }
});

// Get scheme by ID (Public endpoint)
app.get("/api/schemes/:id", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ msg: "Scheme not found" });
    }
    res.json(scheme);
  } catch (err) {
    console.error("Error fetching scheme:", err);
    res.status(503).json({
      msg: "Database connection issue",
      error: "Unable to fetch scheme details. Please try again later."
    });
  }
});

// Get schemes by category (Public endpoint)
app.get("/api/schemes/category/:category", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const schemes = await Scheme.find({
      category: { $regex: req.params.category, $options: 'i' },
      isActive: true
    }).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (err) {
    console.error("Error fetching schemes by category:", err);
    res.status(503).json({
      msg: "Database connection issue",
      error: "Unable to fetch schemes. Please try again later.",
      schemes: []
    });
  }
});

// Search schemes (Public endpoint)
app.get("/api/schemes/search/:query", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const query = req.params.query;
    const schemes = await Scheme.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (err) {
    console.error("Error searching schemes:", err);
    res.status(503).json({
      msg: "Database connection issue",
      error: "Unable to search schemes. Please try again later.",
      schemes: []
    });
  }
});

// Get user's applications (Protected endpoint)
app.get("/api/applications", authMiddleware, async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const currentUser = await User.findOne({ email: req.user.email });
    if (!currentUser) return res.status(404).json({ msg: "User not found" });

    const applications = await Application.find({ userId: currentUser._id })
      .populate('schemeId', 'name category')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(503).json({
      msg: "Database connection issue",
      error: "Unable to fetch your applications. Please try again later.",
      applications: [] // Return empty array as fallback
    });
  }
});

// Get user's documents (Protected endpoint)
app.get("/api/documents", authMiddleware, async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const currentUser = await User.findOne({ email: req.user.email });
    if (!currentUser) return res.status(404).json({ msg: "User not found" });

    const documents = await UserDocument.find({ userId: currentUser._id }).sort({ uploadDate: -1 });
    res.json(documents);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(503).json({
      msg: "Database connection issue",
      error: "Unable to fetch your documents. Please try again later.",
      documents: [] // Return empty array as fallback
    });
  }
});

// Get user's scheme tracking data (Protected endpoint)
app.get("/api/schemes/tracking", authMiddleware, async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const currentUser = await User.findOne({ email: req.user.email });
    if (!currentUser) return res.status(404).json({ msg: "User not found" });

    // Get user's applications with scheme details
    const applications = await Application.find({ userId: currentUser._id })
      .populate('schemeId', 'name category description benefits eligibility')
      .sort({ createdAt: -1 });

    // Get all schemes to check eligibility
    const allSchemes = await Scheme.find({});
    const userDocuments = await UserDocument.find({ userId: currentUser._id });

    // Categorize schemes
    const appliedSchemes = applications.map(app => ({
      ...app.toObject(),
      status: app.status,
      appliedAt: app.createdAt,
      trackingId: app.trackingId
    }));

    const approvedSchemes = appliedSchemes.filter(scheme => scheme.status === 'approved');
    const pendingSchemes = appliedSchemes.filter(scheme => ['submitted', 'under_review'].includes(scheme.status));

    res.json({
      applied: appliedSchemes,
      approved: approvedSchemes,
      pending: pendingSchemes,
      totalApplied: appliedSchemes.length,
      totalApproved: approvedSchemes.length,
      totalPending: pendingSchemes.length
    });
  } catch (err) {
    console.error("Error fetching scheme tracking data:", err);
    res.status(503).json({
      msg: "Database connection issue",
      error: "Unable to fetch scheme tracking data. Please try again later.",
      applied: [],
      approved: [],
      pending: []
    });
  }
});

// Admin dashboard data
app.get("/api/admin/dashboard", authMiddleware, isAdmin, async (req, res) => {
  try {
    await ensureDatabaseConnection();
    console.log("Admin dashboard request from:", req.user.email);

    // Get counts for dashboard
    const totalUsers = await User.countDocuments({});
    const totalApplications = await Application.countDocuments({});
    const pendingApplications = await Application.countDocuments({ status: 'submitted' });
    const approvedApplications = await Application.countDocuments({ status: 'approved' });
    const totalSchemes = await Scheme.countDocuments({});
    const totalDocuments = await UserDocument.countDocuments({});

    // Get recent applications (last 10)
    const recentApplications = await Application.find({})
      .populate('userId', 'name email')
      .populate('schemeId', 'name category')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user registration stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    res.json({
      stats: {
        totalUsers,
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalSchemes,
        totalDocuments,
        recentUsers
      },
      recentApplications,
      message: "Admin dashboard data retrieved successfully"
    });
  } catch (err) {
    console.error("Error fetching admin dashboard:", err);
    res.status(503).json({
      msg: "Database connection issue",
      error: "Unable to fetch dashboard data. Please try again later."
    });
  }
});

// Get all applications (Admin only)
app.get("/api/admin/applications", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("Admin applications request from:", req.user.email);

    const applications = await Application.find({})
      .populate('userId', 'name email')
      .populate('schemeId', 'name category')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error("Error fetching admin applications:", err);
    res.status(500).json({ msg: "Server error fetching applications" });
  }
});

// Get all users (Admin only)
app.get("/api/admin/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("Admin users request from:", req.user.email);

    const users = await User.find({})
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

    // For each user, get their documents and applications count
    const usersWithDetails = await Promise.all(users.map(async (user) => {
      const documents = await UserDocument.find({ userId: user._id }).countDocuments();
      const applications = await Application.find({ userId: user._id }).countDocuments();

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        documentsCount: documents,
        applicationsCount: applications
      };
    }));

    res.json(usersWithDetails);
  } catch (err) {
    console.error("Error fetching admin users:", err);
    res.status(500).json({ msg: "Server error fetching users" });
  }
});

// Get all documents (Admin only)
app.get("/api/admin/documents", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("Admin documents request from:", req.user.email);

    const documents = await UserDocument.find({})
      .populate('userId', 'name email')
      .sort({ uploadDate: -1 });
    res.json(documents);
  } catch (err) {
    console.error("Error fetching admin documents:", err);
    res.status(500).json({ msg: "Server error fetching documents" });
  }
});

// Get individual document details (Admin only)
app.get("/api/admin/documents/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("Admin requesting document details for ID:", req.params.id);

    const document = await UserDocument.findById(req.params.id)
      .populate('userId', 'name email');

    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }

    res.json(document);
  } catch (err) {
    console.error("Error fetching document details:", err);
    res.status(500).json({ msg: "Server error fetching document details" });
  }
});

// Verify document (Admin only)
app.put("/api/admin/documents/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: "Invalid verification status" });
    }

    console.log(`Admin ${req.user.email} updating document ${req.params.id} to status: ${status}`);

    const document = await UserDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ msg: "Document not found" });
    }

    document.verificationStatus = status;
    document.isVerified = status === 'verified';
    document.verifiedAt = new Date();

    // Handle verifiedBy - only set if we have a valid user ObjectId
    if (req.user.email !== 'demo@example.com') {
      const adminUser = await User.findOne({ email: req.user.email });
      if (adminUser) {
        document.verifiedBy = adminUser._id;
      }
    }
    // For demo token, leave verifiedBy undefined (it will remain as existing value or null)

    await document.save();

    res.json({
      msg: `Document ${status} successfully`,
      document: document
    });
  } catch (err) {
    console.error("Error updating document verification:", err);
    res.status(500).json({ msg: "Server error updating document verification" });
  }
});

// Serve document files
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ msg: "File not found" });
  }
});

// Get individual application details (Admin only)
app.get("/api/applications/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    console.log("Admin requesting application details for ID:", req.params.id);

    const application = await Application.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('schemeId', 'name category description benefits eligibility');

    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    res.json(application);
  } catch (err) {
    console.error("Error fetching application details:", err);
    res.status(500).json({ msg: "Server error fetching application details" });
  }
});

// Update application status (Admin only) - Enhanced with scheme approval
app.patch("/api/applications/verify/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status, rejectionReason, adminRemarks, finalApprovalRemarks } = req.body;

    if (!['submitted', 'under_review', 'approved', 'rejected', 'requires_resubmission', 'final_approved', 'final_rejected'].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate('schemeId');
    if (!application) {
      return res.status(404).json({ msg: "Application not found" });
    }

    // Get user for notification
    const user = await User.findById(application.userId);

    application.status = status;
    if (rejectionReason) {
      application.rejectionReason = rejectionReason;
    }
    if (adminRemarks) {
      application.adminRemarks = adminRemarks;
    }
    if (finalApprovalRemarks) {
      application.finalApprovalRemarks = finalApprovalRemarks;
    }
    application.reviewedBy = req.user.email;

    // Set timestamps based on status
    if (status === 'under_review') application.reviewedAt = new Date();
    if (status === 'approved') application.completedAt = new Date();
    if (status === 'final_approved') {
      application.finalApprovedAt = new Date();
      application.finalApprovedBy = req.user.email;
    }
    if (status === 'final_rejected') {
      application.finalRejectedAt = new Date();
      application.finalRejectedBy = req.user.email;
    }

    const updatedApplication = await application.save();

    // Create notifications based on status change
    if (status === 'under_review') {
      await createNotification(
        application.userId,
        'application_under_review',
        'Application Under Review',
        `Your application for ${application.schemeId.name} is now being reviewed by our team.`,
        {
          applicationId: application._id,
          schemeId: application.schemeId._id,
          trackingId: application.trackingId
        }
      );
    } else if (status === 'approved') {
      await createNotification(
        application.userId,
        'application_approved',
        'Application Approved!',
        `Congratulations! Your application for ${application.schemeId.name} has been approved.`,
        {
          applicationId: application._id,
          schemeId: application.schemeId._id,
          trackingId: application.trackingId
        }
      );
    } else if (status === 'rejected') {
      await createNotification(
        application.userId,
        'application_rejected',
        'Application Rejected',
        `Unfortunately, your application for ${application.schemeId.name} has been rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
        {
          applicationId: application._id,
          schemeId: application.schemeId._id,
          trackingId: application.trackingId,
          rejectionReason: rejectionReason
        }
      );
    } else if (status === 'final_approved') {
      await createNotification(
        application.userId,
        'scheme_benefits_granted',
        '🎉 Scheme Benefits Granted!',
        `Congratulations! You have been granted benefits for ${application.schemeId.name}. Please check your application for disbursement details.`,
        {
          applicationId: application._id,
          schemeId: application.schemeId._id,
          trackingId: application.trackingId,
          finalApproval: true
        }
      );
    } else if (status === 'final_rejected') {
      await createNotification(
        application.userId,
        'scheme_benefits_denied',
        'Scheme Benefits Not Granted',
        `Unfortunately, scheme benefits for ${application.schemeId.name} have been denied.${finalApprovalRemarks ? ` Reason: ${finalApprovalRemarks}` : ''}`,
        {
          applicationId: application._id,
          schemeId: application.schemeId._id,
          trackingId: application.trackingId,
          finalRejection: true
        }
      );
    }

    res.json(updatedApplication);
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ msg: "Server error updating application status" });
  }
});

// Login endpoint for demo
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ msg: "Invalid password" });

    // Set role for admin user
    if (email === 'kishu@gmail.com' && password === '123') {
      user.role = 'admin';
      await user.save();
    }

    const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ msg: "Login success ✅", token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: err.message || "Server error during login" });
  }
});

// Connect to MongoDB with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("✅ Connected to MongoDB Atlas");
      return;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, err.message);

      if (i < retries - 1) {
        console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error("❌ Failed to connect to MongoDB after all retry attempts");
  process.exit(1);
};

// Connect to MongoDB and start server
connectWithRetry()
  .then(() => {
    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Scheme Genie Backend with Database running on port ${PORT}`);
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`🔗 Frontend URL: http://localhost:3000`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('✅ MongoDB connection closed');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT received, shutting down gracefully');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('✅ MongoDB connection closed');
          process.exit(0);
        });
      });
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });
