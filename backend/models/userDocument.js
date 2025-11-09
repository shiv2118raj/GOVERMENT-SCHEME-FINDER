import mongoose from "mongoose";

const userDocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: [
      'Aadhaar Card', 'Income Proof', 'Caste Certificate', 'PAN Card', 
      'Residence Certificate', 'Ration Card', 'Photo', 'Signature',
      'Identity', 'Banking', 'Address', 'Education', 'Legal', 'Medical', 
      'Financial', 'Property', 'Business', 'Other'
    ] 
  },
  description: { type: String, default: '' },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'needs_review'],
    default: 'pending'
  },
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminRemarks: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date,
    default: function() {
      // Set default expiry based on document type
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      // Different expiry periods for different document types
      if (this.category === 'Income') {
        return new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)); // 1 year
      } else if (this.category === 'Category' || this.category === 'Legal') {
        return new Date(Date.now() + (5 * 365 * 24 * 60 * 60 * 1000)); // 5 years
      } else if (this.category === 'Education') {
        return new Date(Date.now() + (3 * 365 * 24 * 60 * 60 * 1000)); // 3 years
      } else {
        return oneYearFromNow; // Default 1 year
      }
    }
  },
  isExpired: {
    type: Boolean,
    default: false
  },
  expiryCheckedAt: Date,
  reportedWrong: { type: Boolean, default: false },
  reportReason: { type: String, default: '' },
  reportedAt: Date,
  // OCR Support
  ocrData: {
    extractedText: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
    processedAt: Date,
    isProcessed: { type: Boolean, default: false }
  },
  // Document specific fields
  documentNumber: { type: String, default: '' }, // For Aadhaar, PAN, etc.
  issueDate: Date,
  expiryDate: Date,
  issuingAuthority: { type: String, default: '' }
});

// Index for efficient queries
userDocumentSchema.index({ userId: 1, verificationStatus: 1 });
userDocumentSchema.index({ expiryDate: 1 });
userDocumentSchema.index({ category: 1 });

export default mongoose.model("UserDocument", userDocumentSchema);
