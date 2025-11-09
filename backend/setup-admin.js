#!/usr/bin/env node

/**
 * Setup Admin User and Seed Database
 * Creates an admin user and seeds the database with sample schemes
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import User from "./models/user.js";
import Scheme from "./models/scheme.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://devanshkrishana5_db_user:p1BwC6InizFDcWpB@cluster0.3oqvdai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Admin user details
const adminUser = {
  name: "Admin User",
  email: "kishu@gmail.com",
  password: "123",
  role: "admin"
};

async function setupAdmin() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log("👤 Admin user already exists:", adminUser.email);
      
      // Update role to admin if not already set
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log("✅ Updated existing user to admin role");
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminUser.password, 10);
      const newAdmin = new User({
        name: adminUser.name,
        email: adminUser.email,
        password: hashedPassword,
        role: adminUser.role
      });
      
      await newAdmin.save();
      console.log("✅ Created new admin user:", adminUser.email);
    }

    // Check if schemes exist
    const schemeCount = await Scheme.countDocuments();
    
    if (schemeCount === 0) {
      console.log("📋 No schemes found, seeding database...");
      
      // Run the seed script
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      try {
        await execAsync('node seedSchemes.js');
        console.log("✅ Database seeded with schemes");
      } catch (error) {
        console.error("❌ Error seeding schemes:", error.message);
      }
    } else {
      console.log(`📋 Found ${schemeCount} existing schemes`);
    }

    // Display admin login credentials
    console.log("\n🎉 Setup completed successfully!");
    console.log("📧 Admin Login Credentials:");
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminUser.password}`);
    console.log("\n🌐 You can now login to the admin panel with these credentials");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
    process.exit(1);
  }
}

setupAdmin();
