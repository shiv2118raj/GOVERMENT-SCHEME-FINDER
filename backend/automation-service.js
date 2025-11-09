#!/usr/bin/env node

/**
 * Backend Automation Service
 * Handles automatic processing of applications, notifications, and system maintenance
 */

import mongoose from 'mongoose';
import "dotenv/config";
import User from './models/user.js';
import UserDocument from './models/userDocument.js';
import Scheme from './models/scheme.js';
import Application from './models/application.js';
import Notification from './models/notification.js';

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://devanshkrishana5_db_user:p1BwC6InizFDcWpB@cluster0.3oqvdai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Automation intervals (in milliseconds)
const AUTOMATION_INTERVALS = {
  APPLICATION_PROCESSING: 5 * 60 * 1000, // 5 minutes
  ELIGIBILITY_CHECK: 10 * 60 * 1000, // 10 minutes
  DOCUMENT_VERIFICATION: 15 * 60 * 1000, // 15 minutes
  NOTIFICATION_CLEANUP: 60 * 60 * 1000, // 1 hour
  HEALTH_CHECK: 30 * 1000, // 30 seconds
};

class AutomationService {
  constructor() {
    this.intervals = new Map();
    this.isRunning = false;
    this.stats = {
      applicationsProcessed: 0,
      eligibilityChecks: 0,
      documentsVerified: 0,
      notificationsSent: 0,
      errors: 0
    };
  }

  async start() {
    if (this.isRunning) {
      console.log('🔄 Automation service is already running');
      return;
    }

    try {
      await mongoose.connect(MONGO_URI);
      console.log('✅ Automation service connected to MongoDB');

      this.isRunning = true;
      this.startAllAutomations();

      console.log('🚀 Backend automation service started successfully');
      console.log('📊 Automation intervals:');
      Object.entries(AUTOMATION_INTERVALS).forEach(([key, value]) => {
        console.log(`   - ${key}: ${value / 1000}s`);
      });

    } catch (error) {
      console.error('❌ Failed to start automation service:', error);
      throw error;
    }
  }

  startAllAutomations() {
    // Application Processing Automation
    this.startAutomation('application-processing', AUTOMATION_INTERVALS.APPLICATION_PROCESSING, () =>
      this.processApplicationsAutomatically()
    );

    // Eligibility Check Automation
    this.startAutomation('eligibility-check', AUTOMATION_INTERVALS.ELIGIBILITY_CHECK, () =>
      this.checkEligibilityAutomatically()
    );

    // Document Verification Automation
    this.startAutomation('document-verification', AUTOMATION_INTERVALS.DOCUMENT_VERIFICATION, () =>
      this.verifyDocumentsAutomatically()
    );

    // Notification Cleanup Automation
    this.startAutomation('notification-cleanup', AUTOMATION_INTERVALS.NOTIFICATION_CLEANUP, () =>
      this.cleanupNotifications()
    );

    // Health Check Automation
    this.startAutomation('health-check', AUTOMATION_INTERVALS.HEALTH_CHECK, () =>
      this.performHealthCheck()
    );
  }

  startAutomation(name, interval, callback) {
    if (this.intervals.has(name)) {
      clearInterval(this.intervals.get(name));
    }

    const intervalId = setInterval(async () => {
      try {
        await callback();
      } catch (error) {
        console.error(`❌ Error in ${name} automation:`, error);
        this.stats.errors++;
      }
    }, interval);

    this.intervals.set(name, intervalId);
    console.log(`✅ Started ${name} automation (${interval / 1000}s interval)`);
  }

  async stop() {
    if (!this.isRunning) return;

    this.intervals.forEach((intervalId, name) => {
      clearInterval(intervalId);
      console.log(`🛑 Stopped ${name} automation`);
    });

    this.intervals.clear();
    this.isRunning = false;

    await mongoose.disconnect();
    console.log('✅ Automation service stopped');
  }

  // ===== AUTOMATION METHODS =====

  async processApplicationsAutomatically() {
    try {
      console.log('🔄 Processing applications automatically...');

      // Get all submitted applications that haven't been processed
      const submittedApps = await Application.find({
        status: 'submitted',
        submittedAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes ago
      }).populate('userId schemeId');

      for (const application of submittedApps) {
        try {
          // Auto-approve if all documents are verified and eligibility criteria met
          const isEligible = await this.checkApplicationEligibility(application);

          if (isEligible) {
            await this.approveApplication(application, 'AUTO_APPROVED');
            this.stats.applicationsProcessed++;
          } else {
            // Move to under_review for manual processing
            await this.moveToUnderReview(application);
          }
        } catch (error) {
          console.error(`❌ Error processing application ${application._id}:`, error);
          this.stats.errors++;
        }
      }

      console.log(`✅ Processed ${submittedApps.length} applications`);
    } catch (error) {
      console.error('❌ Error in application processing:', error);
      this.stats.errors++;
    }
  }

  async checkEligibilityAutomatically() {
    try {
      console.log('🔍 Checking eligibility for all users...');

      const users = await User.find({ role: 'user' });

      for (const user of users) {
        try {
          const eligibleSchemes = await this.getEligibleSchemesForUser(user);

          if (eligibleSchemes.length > 0) {
            await this.sendEligibilityNotification(user, eligibleSchemes);
            this.stats.eligibilityChecks++;
          }
        } catch (error) {
          console.error(`❌ Error checking eligibility for user ${user._id}:`, error);
          this.stats.errors++;
        }
      }

      console.log(`✅ Checked eligibility for ${users.length} users`);
    } catch (error) {
      console.error('❌ Error in eligibility check:', error);
      this.stats.errors++;
    }
  }

  async verifyDocumentsAutomatically() {
    try {
      console.log('📄 Verifying documents automatically...');

      const pendingDocuments = await UserDocument.find({
        verificationStatus: 'pending'
      }).populate('userId');

      for (const document of pendingDocuments) {
        try {
          // Auto-verify based on simple criteria (can be enhanced with AI/ML)
          const isVerified = await this.autoVerifyDocument(document);

          if (isVerified) {
            await this.verifyDocument(document, 'AUTO_VERIFIED');
            this.stats.documentsVerified++;
          }
        } catch (error) {
          console.error(`❌ Error verifying document ${document._id}:`, error);
          this.stats.errors++;
        }
      }

      console.log(`✅ Processed ${pendingDocuments.length} documents`);
    } catch (error) {
      console.error('❌ Error in document verification:', error);
      this.stats.errors++;
    }
  }

  async cleanupNotifications() {
    try {
      console.log('🧹 Cleaning up old notifications...');

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo }
      });

      console.log(`✅ Deleted ${result.deletedCount} old notifications`);
    } catch (error) {
      console.error('❌ Error in notification cleanup:', error);
      this.stats.errors++;
    }
  }

  async performHealthCheck() {
    try {
      // Check database connectivity
      const dbState = mongoose.connection.readyState;
      if (dbState !== 1) {
        console.error('❌ Database connection lost');
        return;
      }

      // Check collection counts
      const userCount = await User.countDocuments();
      const applicationCount = await Application.countDocuments();
      const schemeCount = await Scheme.countDocuments();

      console.log(`💚 Health check: Users(${userCount}), Apps(${applicationCount}), Schemes(${schemeCount})`);

      // Log stats periodically
      if (this.stats.applicationsProcessed > 0 || this.stats.documentsVerified > 0) {
        console.log('📊 Automation Stats:', this.stats);
      }
    } catch (error) {
      console.error('❌ Health check failed:', error);
      this.stats.errors++;
    }
  }

  // ===== HELPER METHODS =====

  async checkApplicationEligibility(application) {
    try {
      const user = application.userId;
      const scheme = application.schemeId;

      // Check if user has all required documents
      const userDocuments = await UserDocument.find({ userId: user._id });
      const requiredDocuments = scheme.documents || [];

      for (const reqDoc of requiredDocuments) {
        const hasDocument = userDocuments.some(doc =>
          doc.name.toLowerCase().includes(reqDoc.toLowerCase()) && doc.isVerified
        );

        if (!hasDocument) return false;
      }

      // Check basic eligibility criteria
      if (scheme.eligibility?.income && user.income) {
        const schemeIncome = parseInt(scheme.eligibility.income.replace(/[^0-9]/g, ''));
        const userIncome = parseInt(user.income.replace(/[^0-9]/g, ''));
        if (userIncome > schemeIncome) return false;
      }

      if (scheme.eligibility?.age && user.age) {
        const minAge = scheme.eligibility.age.min || 0;
        const maxAge = scheme.eligibility.age.max || 999;
        if (user.age < minAge || user.age > maxAge) return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error checking eligibility:', error);
      return false;
    }
  }

  async approveApplication(application, reason) {
    application.status = 'approved';
    application.completedAt = new Date();
    application.adminRemarks = `Automatically approved: ${reason}`;

    await application.save();

    // Send notification
    await this.createNotification(
      application.userId,
      'application_approved',
      'Application Approved!',
      `Congratulations! Your application for ${application.schemeId.name} has been automatically approved.`,
      { applicationId: application._id, schemeId: application.schemeId._id }
    );
  }

  async moveToUnderReview(application) {
    application.status = 'under_review';
    application.reviewedAt = new Date();

    await application.save();

    // Send notification
    await this.createNotification(
      application.userId,
      'application_under_review',
      'Application Under Review',
      `Your application for ${application.schemeId.name} is now under review by our team.`,
      { applicationId: application._id, schemeId: application.schemeId._id }
    );
  }

  async getEligibleSchemesForUser(user) {
    const schemes = await Scheme.find({ isActive: true });
    const userDocuments = await UserDocument.find({ userId: user._id });

    return schemes.filter(scheme => {
      // Check document requirements
      if (scheme.documents && scheme.documents.length > 0) {
        const hasRequiredDocs = scheme.documents.every(reqDoc =>
          userDocuments.some(doc =>
            doc.name.toLowerCase().includes(reqDoc.toLowerCase()) && doc.isVerified
          )
        );
        if (!hasRequiredDocs) return false;
      }

      // Check eligibility criteria
      if (scheme.eligibility?.income && user.income) {
        const schemeIncome = parseInt(scheme.eligibility.income.replace(/[^0-9]/g, ''));
        const userIncome = parseInt(user.income.replace(/[^0-9]/g, ''));
        if (userIncome > schemeIncome) return false;
      }

      return true;
    });
  }

  async sendEligibilityNotification(user, eligibleSchemes) {
    const schemeNames = eligibleSchemes.map(s => s.name).join(', ');

    await this.createNotification(
      user._id,
      'eligibility_match',
      'New Schemes Available!',
      `Great news! You are now eligible for: ${schemeNames}. Apply now!`,
      { eligibleSchemes: eligibleSchemes.map(s => s._id) }
    );
  }

  async autoVerifyDocument(document) {
    // Simple auto-verification logic (can be enhanced)
    // For demo purposes, approve documents that look legitimate

    if (document.name.toLowerCase().includes('aadhar') && document.fileSize > 10000) {
      return true; // Assume Aadhar cards over 10KB are valid
    }

    if (document.name.toLowerCase().includes('income') && document.fileSize > 5000) {
      return true; // Assume income certificates over 5KB are valid
    }

    return false;
  }

  async verifyDocument(document, reason) {
    document.verificationStatus = 'verified';
    document.isVerified = true;
    document.verifiedAt = new Date();

    await document.save();

    // Notify user
    await this.createNotification(
      document.userId,
      'document_verified',
      'Document Verified!',
      `Your ${document.name} has been automatically verified.`,
      { documentId: document._id }
    );
  }

  async createNotification(userId, type, title, message, data = {}) {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        message,
        data,
        read: false
      });
      await notification.save();
      this.stats.notificationsSent++;
      return notification;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      this.stats.errors++;
    }
  }

  getStats() {
    return { ...this.stats };
  }
}

// Export for use in other modules
export default AutomationService;

// If run directly, start the automation service
if (import.meta.url === `file://${process.argv[1]}`) {
  const automation = new AutomationService();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('🛑 Shutting down automation service...');
    await automation.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received, shutting down...');
    await automation.stop();
    process.exit(0);
  });

  automation.start().catch(console.error);
}
