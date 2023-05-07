import joi from 'joi';
// eslint-disable-next-line import/no-extraneous-dependencies

const validator = schema => payload =>
  schema.validate(payload, { abortEarly: false });

const orderStatusSchema = joi.object({
    deliveryDate: joi.date().min('now'),
    orderStatus: joi.string().valid('pending', 'paid', 'dispatched', 'delivered', 'cancelled')
});

validator(orderStatusSchema);

export default validator(orderStatusSchema);
