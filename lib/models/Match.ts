import { Schema, model, models, Types } from "mongoose";

const MatchSchema = new Schema(
  {
    candidateId: { type: Types.ObjectId, ref: "Candidate", required: true },
    roleId: { type: Types.ObjectId, ref: "Role", required: true },
    suggestedBy: { type: String, enum: ["recruiter", "ai"], required: true },
    status: { type: String, enum: ["suggested", "approved", "rejected"], default: "suggested" },
    score: { type: Number, default: 0 },
    missingSkills: { type: [String], default: [] },
    notes: { type: String, default: "" },
    createdBy: { type: String }, // Clerk userId who suggested
  },
  { timestamps: true }
);

export default models.Match || model("Match", MatchSchema);