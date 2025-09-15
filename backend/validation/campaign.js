const Joi = require("joi");

const campaignValidation = Joi.object({
  name: Joi.string().required(),
  message: Joi.string().required(),
  channel: Joi.string().valid("sms", "email", "push").required(),
  scheduledAt: Joi.date().required(),
  segment: Joi.string().hex().length(24).required(), // segment ID
  status: Joi.string().valid("pending", "sent","draft").default("pending"),
});

module.exports = campaignValidation;