import { Schema, model, models } from "mongoose";

const UserRoleSchema = new Schema(
  {
    userId: { type: String, unique: true, required: true }, // Clerk userId
    role: { type: String, enum: ["admin", "recruiter"], required: true },
  },
  { timestamps: true }
);

export default models.UserRole || model("UserRole", UserRoleSchema);