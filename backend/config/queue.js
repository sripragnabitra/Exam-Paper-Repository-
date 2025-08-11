// backend/config/queue.js
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

export const paperQueue = new Queue("paper-processing", { 
    connection: {
        host: "127.0.0.1",
        port: 6379,
        maxRetriesPerRequest: null,
    }
});
