const express = require("express");
const router = express.Router();
const auth = require("../utils/jwt")
const { createCustomer, getCustomers } = require("../controller/customer");

router.post("/",auth, createCustomer);

router.get("/", auth, getCustomers);
module.exports = router;