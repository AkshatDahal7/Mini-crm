// pubsub/publisher.js
const { createClient } = require("@redis/client");

const redisUrl =
  process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD !== ""
    ? `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`
    : `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`;

let publisher; // will hold our connected client
let isConnecting = false;

/**
 * Ensure Redis publisher is connected (singleton).
 */
async function getPublisher() {
  if (publisher && publisher.isOpen) return publisher;

  if (!isConnecting) {
    isConnecting = true;
    publisher = createClient({ url: redisUrl });

    publisher.on("error", (err) => {
      console.error("Redis Publisher Error ❌:", err);
    });

    try {
      await publisher.connect();
      console.log("Redis publisher connected ✅");
    } catch (err) {
      console.error("Failed to connect publisher:", err);
      isConnecting = false;
      throw err;
    }

    isConnecting = false;
  }

  return publisher;
}

/**
 * Publish an event to Redis channel
 */
async function publishEvent(channel, data) {
  try {
    const client = await getPublisher();
    const payload = JSON.stringify(data);

    await client.publish(channel, payload);
    console.log(`📢 Published to ${channel}:`, payload);

    return true;
  } catch (err) {
    console.error(`❌ Failed to publish to ${channel}:`, err);
    throw err;
  }
}

module.exports = { publishEvent };
