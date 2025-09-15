const Joi = require("joi");

const orderValidation = Joi.object({
  customer: Joi.string().hex().length(24).required(),
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().required(),
    })
  ).required(),
  totalAmount: Joi.number().required(),
  orderDate: Joi.date().default(Date.now),
});

module.exports = orderValidation;