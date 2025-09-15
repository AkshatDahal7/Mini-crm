const Joi = require("joi");

const communicationValidation = Joi.object({
  customer: Joi.string().hex().length(24).required(),
  campaign: Joi.string().hex().length(24).required(),
  status: Joi.string().valid("sent", "delivered", "failed").default("sent"),
  response: Joi.string().optional(),
  sentAt: Joi.date().default(Date.now),
});

module.exports = communicationValidation;
