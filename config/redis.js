import Redis from "ioredis";

if (!process.env.REDIS_URL) throw new Error("REDIS_URL is missing in .env");

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null, 
  tls: process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined, 
});

redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
