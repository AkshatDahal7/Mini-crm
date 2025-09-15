const Joi = require("joi");

const customerValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  totalSpend: Joi.number().default(0),
  visits: Joi.number().default(0),
  lastActive: Joi.date().default(Date.now),
});

module.exports = customerValidation;