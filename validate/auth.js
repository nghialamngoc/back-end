// Validation
const Joi = require('@hapi/joi');


const registerUserValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })

  return schema.validate(data);
}

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.required()
  })

  return schema.validate(data);
}

module.exports = {
  registerUserValidation,
  loginValidation
};