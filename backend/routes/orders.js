
const express = require("express");
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require("../controller/order");
const auth = require("../utils/jwt")
router.post("/", auth ,createOrder);
router.get("/", auth, getOrders);
router.patch("/:id/status", auth, updateOrderStatus);
module.exports = router;
