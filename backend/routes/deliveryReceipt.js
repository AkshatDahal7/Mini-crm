const express = require("express");
const router = express.Router();
const { handleReceipt } = require("../controllers/deliveryReceiptController");
const auth = require("../utils/jwt")
router.post("/", auth, handleReceipt);

module.exports = router;