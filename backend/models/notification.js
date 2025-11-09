import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['document_rejected', 'application_approved', 'application_rejected', 'new_scheme_match', 'application_submitted', 'application_under_review'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDocument' },
    rejectionReason: String,
    trackingId: String
  },
  read: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 days
});

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired notifications

export default mongoose.model("Notification", notificationSchema);
