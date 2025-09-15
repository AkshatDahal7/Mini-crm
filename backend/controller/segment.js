const segmentValidation = require("../validation/segment");
const {publishEvent } = require("../pubsub/publisher")

const createSegment = async (req, res) => {
  const { error, value } = segmentValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // Ensure createdBy is set to the logged-in user's ID
    const segmentData = { ...value, createdBy: req.user.id };
    await publishEvent("segments", segmentData);
    res.status(202).json({ message: "Segment queued" });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish event" });
  }
};
const getSegments = async (req, res) => {
  try {
    const segments = await Segment.find({ createdBy: req.user.id });
    res.json(segments);
  } catch (err) {
    console.error("Error fetching segments:", err);
    res.status(500).json({ error: "Failed to fetch segments" });
  }
};

// Get one segment
const getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!segment) return res.status(404).json({ error: "Segment not found" });

    res.json(segment);
  } catch (err) {
    console.error("Error fetching segment:", err);
    res.status(500).json({ error: "Failed to fetch segment" });
  }
};

module.exports = { createSegment, getSegments, getSegmentById };
