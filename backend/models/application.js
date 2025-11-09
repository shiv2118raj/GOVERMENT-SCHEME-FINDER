import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'requires_resubmission', 'final_approved', 'final_rejected'],
    default: 'draft'
  },
  statusHistory: [{
    status: { type: String, enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'requires_resubmission', 'final_approved', 'final_rejected'] },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String
  }],
  applicationData: {
    personalInfo: {
      fullName: String,
      aadhaar: String,
      phone: String,
      dateOfBirth: Date,
      gender: String,
      address: String,
      state: String,
      district: String,
      pincode: String
    },
    eligibilityInfo: {
      income: String,
      caste: String,
      education: String,
      employment: String
    },
    documents: [{
      type: String, // Document type (Aadhaar, Income Certificate, etc.)
      url: String,  // File URL or path
      submittedAt: Date,
      reviewedAt: Date,
      completedAt: Date,
      remarks: String,
      verified: { type: Boolean, default: false }
    }],
    requiredDocuments: {
      aadhaarCard: { type: Boolean, default: false },
      incomeProof: { type: Boolean, default: false },
      casteCertificate: { type: Boolean, default: false },
      panCard: { type: Boolean, default: false },
      residenceCertificate: { type: Boolean, default: false },
      rationCard: { type: Boolean, default: false },
      photo: { type: Boolean, default: false },
      signature: { type: Boolean, default: false }
    },
    documentDetails: {
      aadhaarNumber: String,
      panNumber: String,
      incomeAmount: String,
      casteCategory: String,
      residenceAddress: String,
      rationCardNumber: String
    }
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
  adminRemarks: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the admin who reviewed it
  },
  trackingId: { type: String, unique: true }, // For external tracking
  trackingUrl: { type: String }, // External tracking URL
  estimatedApprovalDays: { type: Number, default: 30 }, // Estimated days for approval
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  reviewedAt: Date,
  completedAt: Date,
  finalApprovalRemarks: {
    type: String,
    trim: true
  },
  finalApprovedAt: Date,
  finalApprovedBy: {
    type: String, // Store admin email for demo purposes
  },
  finalRejectedAt: Date,
  finalRejectedBy: {
    type: String, // Store admin email for demo purposes
  }
});

// Add status history when status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: this.reviewedBy || this.userId, // Use reviewedBy if available, otherwise userId
      reason: this.rejectionReason || `Status changed to ${this.status}`
    });

    // Update timestamps based on status
    if (this.status === 'submitted' && !this.submittedAt) {
      this.submittedAt = new Date();
    }
    if (this.status === 'under_review' && !this.reviewedAt) {
      this.reviewedAt = new Date();
    }
    if (['approved', 'rejected'].includes(this.status) && !this.completedAt) {
      this.completedAt = new Date();
    }
    if (this.status === 'final_approved' && !this.finalApprovedAt) {
      this.finalApprovedAt = new Date();
    }
    if (this.status === 'final_rejected' && !this.finalRejectedAt) {
      this.finalRejectedAt = new Date();
    }
  }
  next();
});

export default mongoose.model("Application", applicationSchema);
