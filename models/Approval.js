import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const approvalSchema = new mongoose.Schema({
  approvalId: { type: String, default: uuidv4, unique: true },
  workflowId: { type: String, default: null },
  stepId: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true }, 
  metadata: { type: Object, default: {} },
  context: { type: Object, default: {} }, 
  status: { type: String, enum: ["pending","approved","rejected","failed","rolledback","timeout"], default: "pending" },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  lastAttemptAt: Date
}, { timestamps: true });

export default mongoose.model("Approval", approvalSchema);
