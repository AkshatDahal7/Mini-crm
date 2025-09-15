const Joi = require("joi");

const segmentValidation = Joi.object({
  name: Joi.string().required(),
  description : Joi.string().optional(),
  rules: Joi.object({
    minSpend: Joi.number().default(0),
    maxSpend: Joi.number().optional(),
    minVisits: Joi.number().default(0),
    lastActiveAfter: Joi.date().optional(),
    lastActiveBefore: Joi.date().optional(),
  }).required(),
  createdBy: Joi.string().hex().length(24).optional(),
});

module.exports = segmentValidation;