const Customer = require("../models/Customer");
const customerValidation = require("../validation/customer");

const { publishEvent } = require("../pubsub/publisher");

const createCustomer = async (req, res) => {
  const { error, value } = customerValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {

    await publishEvent("customers", value);

    res.status(202).json({ message: "Customer event published" });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish event" });
  }
};
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

module.exports = { createCustomer,getCustomers };
