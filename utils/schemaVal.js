const Joi = require("joi");

module.exports.listingValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  state: Joi.string().required(),
  image: Joi.string(),
  country: Joi.string(),
});

module.exports.reviewValidation = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required(),
});
