import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const eventSchema = new mongoose.Schema({
  eventId: { type: String, default: uuidv4 },
  entityType: String,
  entityId: String,
  type: String,
  payload: Object
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
