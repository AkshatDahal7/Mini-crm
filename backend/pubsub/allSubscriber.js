const { createClient } = require("@redis/client");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Segment = require("../models/Segment");
const Campaign = require("../models/Campaign");
const CommunicationLog = require("../models/CommunicationLog");

// Create Redis subscriber using @redis/client
const redisUrl = process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD !== ""
  ? `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`
  : `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`;
const subscriber = createClient({ url: redisUrl });

subscriber.on("error", (err) => console.error("Redis Subscriber Error:", err));

(async () => {
  await subscriber.connect();
  console.log(" Redis subscriber connected ✅");

  const subscribeChannel = async (channel, callback) => {
    await subscriber.subscribe(channel, async (message) => {
      let data;
      try {
        data = JSON.parse(message);
      } catch (err) {
        console.error(`Invalid JSON on ${channel}:`, message, err);
        return;
      }

      try {
        await callback(data);
        console.log(`✅ ${channel} saved to DB`);
      } catch (err) {
        console.error(`❌ Failed to save ${channel}:`, err);
      }
    });
  };

  subscribeChannel("customers", async (data) => {
  const customer = await Customer.create(data);
  console.log("Customer saved:", customer._id);
});
 subscribeChannel("orders", async (data) => {
  const order = await Order.create(data);
  console.log("Order saved:", order._id);
  // Update customer visits and lastActive
  await Customer.findByIdAndUpdate(
    order.customer,
    {
      $inc: { visits: 1 },
      $set: { lastActive: order.createdAt }
    },
    { new: true }
  );
});
  subscribeChannel("segments", async (data) => {
    console.log("📩 Received segment data:", data);
    if (!data.createdBy) {
      console.error("❌ Segment data missing createdBy. Not saving.", data);
      return;
    }
    await Segment.updateOne(
      { name: data.name, createdBy: data.createdBy },
      { $set: data },
      { upsert: true }
    );
    console.log(`✅ Segment saved: ${data.name} for user ${data.createdBy}`);
  });
  subscribeChannel("campaigns", async (data) => {
  const campaigns = await Campaign.create(data);
  console.log("Customer saved:", campaigns._id);
});
  subscribeChannel("logs", async (data) => CommunicationLog.create(data));
})();
