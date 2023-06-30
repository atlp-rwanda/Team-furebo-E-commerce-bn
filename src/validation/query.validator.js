import joi from 'joi';

const validator = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const querySchema = joi.object({

  fullname: joi.string().required(),
  email: joi.string().required(),
  message: joi.string().required(),

});

validator(querySchema);

export default validator(querySchema);
