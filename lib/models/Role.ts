import { Schema, model, models } from "mongoose";

const RoleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    requiredSkills: { type: [String], default: [] },
    niceToHaveSkills: { type: [String], default: [] },
    minExperience: { type: Number, default: 0 },
    maxExperience: { type: Number },
    createdBy: { type: String }, // Clerk userId
  },
  { timestamps: true }
);

export default models.Role || model("Role", RoleSchema);