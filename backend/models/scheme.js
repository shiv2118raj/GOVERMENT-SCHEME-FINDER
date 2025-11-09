import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Education, Healthcare, Financial, etc.
  eligibility: {
    minAge: { type: Number },
    maxAge: { type: Number },
    income: { type: String }, // "Below 2 LPA", "2-5 LPA", etc.
    caste: [{ type: String }], // ["General", "SC", "ST", "OBC"]
    gender: { type: String }, // "All", "Female", "Male"
    state: [{ type: String }], // Applicable states
    education: { type: String }, // Minimum education required
    employment: { type: String } // Employment status requirement
  },
  benefits: [{ type: String }], // Array of benefits
  documents: [{ type: String }], // Required documents
  applicationProcess: { type: String },
  officialWebsite: { type: String },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Scheme", schemeSchema);
