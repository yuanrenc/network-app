const Joi = require('joi');

const joiSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().required(),
  email: Joi.string().email().required()
});

module.exports = joiSchema;
