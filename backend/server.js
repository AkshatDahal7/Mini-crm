// server.js
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const connectDB = require("./utils/dbConnect");
const customerRoutes = require("./routes/customers");
const orderRoutes = require("./routes/orders");
const segmentRoutes = require("./routes/segments");
const campaignRoutes = require("./routes/campaigns");
const authRoutes = require("./routes/auth");

const { redisClient } = require("./pubsub/publisher"); // already connects inside publisher
require("./pubsub/allSubscriber"); // subscriber will use the same connection

const startServer = async () => {
  try {
    await connectDB();


    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(morgan("dev"));

    app.use("/api/auth", authRoutes);
    app.use("/api/customers", customerRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/segments", segmentRoutes);
    app.use("/api/campaigns", campaignRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
