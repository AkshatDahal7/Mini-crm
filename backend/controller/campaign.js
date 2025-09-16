// Fetch all campaigns for the logged-in user
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};
const campaignValidation = require("../validation/campaign");
const { publishEvent } = require("../pubsub/publisher");
const Segment = require("../models/Segment");
const Customer = require("../models/Customer");
const Campaign = require("../models/Campaign");

const createCampaign = async (req, res) => {
  const { error, value } = campaignValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    await publishEvent("campaigns", value);
    res.status(202).json({ message: "Campaign event published" });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish event" });
  }
};

// Send campaign to segment
const sendCampaign = async (req, res) => {
  const { name, type, segmentId, message } = req.body;
  if (!segmentId) return res.status(400).json({ error: "segmentId required" });
  try {
    const segment = await Segment.findById(segmentId);
    if (!segment) return res.status(404).json({ error: "Segment not found" });

    // Build query from segment rules
    const rules = segment.rules || {};
    const query = {};
    if (rules.minSpend) query.totalSpend = { $gte: rules.minSpend };
    if (rules.maxSpend) query.totalSpend = { ...(query.totalSpend || {}), $lte: rules.maxSpend };
    if (rules.minVisits) query.visits = { $gte: rules.minVisits };
    if (rules.lastActiveAfter) query.lastActive = { $gte: rules.lastActiveAfter };
    if (rules.lastActiveBefore) query.lastActive = { ...(query.lastActive || {}), $lte: rules.lastActiveBefore };

    const customers = await Customer.find(query);
    let sentCount = 0, failedCount = 0, recipients = [];
    customers.forEach(cust => {
      // Simulate sending: 80% success
      if (Math.random() < 0.8) {
        sentCount++;
        recipients.push(cust._id);
      } else {
        failedCount++;
      }
    });

    const campaign = new Campaign({
      name,
      type,
      segment: segment._id,
      message,
      status: sentCount > 0 ? "sent" : "failed",
      sentCount,
      failedCount,
      recipients,
      scheduledAt: new Date(),
    });
    await campaign.save();
    res.json({ message: "Campaign sent", campaign });
  } catch (err) {
    res.status(500).json({ error: "Failed to send campaign", details: err.message });
  }
};

module.exports = { createCampaign, sendCampaign, getCampaigns };