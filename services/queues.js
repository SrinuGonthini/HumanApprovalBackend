import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const approvalQueue = new Queue("approvals", { connection: redis });

export const createApprovalJob = async (approvalData) => {
  await approvalQueue.add("approval", { ...approvalData, rollbackOnFail: true }, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
};
