const orderValidation = require("../validation/orders");
const { publishEvent } = require("../pubsub/publisher");
const Orders = require("../models/Order")
const createOrder = async (req, res) => {
  const { error, value } = orderValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    await publishEvent("orders", value);
    res.status(202).json({ message: "Order event published" });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish event" });
  }
};
const getOrders = async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }
  try {
    const order = await Orders.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.status = status;
    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

module.exports = { createOrder , getOrders, updateOrderStatus };
