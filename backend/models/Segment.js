const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    rules: {
      minSpend: { type: Number, default: 0 },
      maxSpend: { type: Number },
      minVisits: { type: Number, default: 0 },
      lastActiveAfter: { type: Date },
      lastActiveBefore: { type: Date },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Segment", segmentSchema);
