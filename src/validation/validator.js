/* eslint-disable linebreak-style */
import Joi from 'joi';

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const signupSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().max(8).alphanum().required(),
});

validator(signupSchema);

export default validator(signupSchema);
