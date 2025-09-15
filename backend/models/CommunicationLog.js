const mongoose = require("mongoose");

const communicationLogSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  status: { type: String, enum: ["delivered", "failed", "opened", "clicked"], default: "delivered" },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CommunicationLog", communicationLogSchema)