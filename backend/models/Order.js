const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Customer", 
    required: true 
    },
  items: [
    {
      product: String,
      quantity: Number,
      price: Number
    }
  ],
  //since the items are the collection of the products so not insde curly braces
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);