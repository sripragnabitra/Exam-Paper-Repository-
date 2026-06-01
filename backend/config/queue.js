// backend/config/queue.js
// Gracefully handle missing Redis - queue is optional for core functionality
let paperQueue = null;

const createQueue = async () => {
  try {
    const { Queue } = await import("bullmq");
    const IORedis = (await import("ioredis")).default;

    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    const connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
    });

    await connection.connect();

    paperQueue = new Queue("paper-processing", { connection });
    console.log("BullMQ queue connected to Redis");
    return paperQueue;
  } catch (err) {
    console.warn("Redis unavailable - background OCR processing disabled:", err.message);
    // Return a mock queue that no-ops
    paperQueue = {
      add: async (...args) => {
        console.log("Queue disabled - skipping background job for:", args[1]);
        return null;
      },
    };
    return paperQueue;
  }
};

// Initialize queue on import
createQueue();

export { paperQueue };
export default { get: () => paperQueue };
