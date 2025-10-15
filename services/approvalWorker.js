import { Worker, Queue } from "bullmq";
import redis from "../config/redis.js";
import ApprovalModel from "../models/Approval.js";
import { sendApprovalEmail } from "../adapters/emailAdapter.js";

const queueName = "approvals";
const approvalQueue = new Queue(queueName, { connection: redis });

const worker = new Worker(
  queueName,
  async (job) => {
    const { approvalId, title, description, email } = job.data;

    const approval = new ApprovalModel({
      approvalId,
      title,
      description,
      status: "pending",
    });

    await approval.save();

    const emailResult = await sendApprovalEmail({
      to: email,
      subject: `Approval Request: ${title}`,
      html: `<p>${description}</p>
             <p><a href="http://localhost:5173/approve/${approvalId}">Approve</a> |
             <a href="http://localhost:5173/reject/${approvalId}">Reject</a></p>`,
    });

    if (!emailResult.ok) {
      throw new Error("Email sending failed");
    }

    return { ok: true };
  },
  { connection: redis }
);

worker.on("failed", async (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);

  if (job.data.rollbackOnFail) {
    console.log(`Rolling back job ${job.id}...`);
    try {
      await ApprovalModel.deleteOne({ approvalId: job.data.approvalId });
      console.log(`Rollback complete for job ${job.id}`);
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr.message);
    }
  }
});

export default worker;
