import express from "express";
import Approval from "../models/Approval.js";
import Event from "../models/Event.js";
import { approvalQueue } from "../services/queues.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { title, description, email, context = {}, maxAttempts = 3, deadlineMinutes } = req.body;
    if (!title || !description || !email) return res.status(400).json({ error: "Missing required fields" });

    const approval = await Approval.create({
      title, description, email, context, maxAttempts
    });

    await Event.create({ entityType: "approval", entityId: approval.approvalId, type: "created", payload: approval });

    await approvalQueue.add("approval", {
      approvalId: approval.approvalId,
      frontendUrl: process.env.FRONTEND_URL
    }, {
      attempts: approval.maxAttempts,
      backoff: { type: "exponential", delay: 60_000 }
    });

    res.status(201).json({ success: true, approval });
  } catch (err) {
    console.error("Error creating approval:", err.message || err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/response", async (req, res) => {
  try {
    const { approvalId, action } = req.query;
    if (!approvalId || !action) return res.status(400).send("Missing params");

    const approval = await Approval.findOne({ approvalId });
    if (!approval) return res.status(404).send("Approval not found");

    if (approval.status !== "pending") return res.send(`Already ${approval.status}`);

    approval.status = action === "approve" ? "approved" : "rejected";
    await approval.save();
    await Event.create({ entityType: "approval", entityId: approval.approvalId, type: approval.status, payload: { action } });

    if (approval.status === "approved") {
      
    } else {
      await approvalQueue.add("rollback", { approvalId: approval.approvalId });
    }

    return res.send(`Approval ${approval.status}`);
  } catch (err) {
    console.error("Error responding to approval:", err.message || err);
    return res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  const approvals = await Approval.find().sort({ createdAt: -1 }).lean();
  res.json(approvals);
});

router.get("/:approvalId/events", async (req, res) => {
  const events = await Event.find({ entityType: "approval", entityId: req.params.approvalId }).sort({ createdAt: 1 }).lean();
  res.json(events);
});

export default router;
