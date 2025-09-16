const segmentValidation = require("../validation/segment");
const { publishEvent } = require("../pubsub/publisher");
const Segment = require("../models/Segment"); // make sure this is imported

// Create Segment
const createSegment = async (req, res) => {
  console.log("➡️ Incoming createSegment request");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Decoded user from JWT:", req.user);

  const { error, value } = segmentValidation.validate(req.body);
  if (error) {
    console.error("❌ Validation error:", error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    if (!req.user || !req.user.id) {
      console.error("❌ req.user.id is missing. JWT may not have 'id' in payload.");
      return res.status(401).json({ error: "User authentication failed." });
    }

    const segmentData = { ...value, createdBy: req.user.id };
    console.log("✅ Prepared segmentData:", segmentData);

    try {
      await publishEvent("segments", segmentData);
      console.log("📤 Segment event published successfully");
    } catch (pubErr) {
      console.error("❌ PublishEvent error:", pubErr);
      return res.status(500).json({ error: "Failed to publish event" });
    }

    res.status(202).json({ message: "Segment queued" });
  } catch (err) {
    console.error("❌ Error in createSegment:", err);
    res.status(500).json({ error: err.message || "Unexpected error in createSegment" });
  }
};

// Get All Segments
const getSegments = async (req, res) => {
  console.log("➡️ Incoming getSegments request for user:", req.user);

  try {
    if (!req.user || !req.user.id) {
      console.error("❌ req.user.id missing in getSegments");
      return res.status(401).json({ error: "User authentication failed." });
    }

    const segments = await Segment.find({ createdBy: req.user.id });
    console.log(`✅ Found ${segments.length} segments for user ${req.user.id}`);
    res.json(segments);
  } catch (err) {
    console.error("❌ Error fetching segments:", err);
    res.status(500).json({ error: err.message || "Failed to fetch segments" });
  }
};

// Get One Segment by ID
const getSegmentById = async (req, res) => {
  console.log("➡️ Incoming getSegmentById request");
  console.log("Params:", req.params);
  console.log("User:", req.user);

  try {
    if (!req.user || !req.user.id) {
      console.error("❌ req.user.id missing in getSegmentById");
      return res.status(401).json({ error: "User authentication failed." });
    }

    const segment = await Segment.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!segment) {
      console.warn(`⚠️ Segment not found: id=${req.params.id}, user=${req.user.id}`);
      return res.status(404).json({ error: "Segment not found" });
    }

    console.log("✅ Found segment:", segment);
    res.json(segment);
  } catch (err) {
    console.error("❌ Error fetching segment:", err);
    res.status(500).json({ error: err.message || "Failed to fetch segment" });
  }
};

module.exports = { createSegment, getSegments, getSegmentById };
