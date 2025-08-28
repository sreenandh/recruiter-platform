import { Schema, model, models } from "mongoose";

const CandidateSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    skills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    resumeText: { type: String, default: "" },
    createdBy: { type: String }, // Clerk userId
  },
  { timestamps: true }
);

export default models.Candidate || model("Candidate", CandidateSchema);