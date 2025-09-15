const communicationValidation = require("../validation/communicationLogs");
const { producer } = require("../pubsub/producer");

const createLog = async (req, res) => {
  const { error, value } = communicationValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    await producer.send({
      topic: "communications",
      messages: [{ value: JSON.stringify(value) }],
    });
    res.status(202).json({ message: "Communication log queued" });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish event" });
  }
};

module.exports = { createLog };