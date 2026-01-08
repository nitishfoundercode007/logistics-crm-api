const Joi = require('joi');

// ----------------- REGISTER VALIDATION -----------------
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('1','2','3','4').required(),
  phone: Joi.string().min(10).required(),
  dob: Joi.string().required(),
  company_name:Joi.string().required(),
  website_url: Joi.string().uri().allow('', null).optional()
});

// ----------------- LOGIN VALIDATION -----------------
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  registerSchema,
  loginSchema
};
