/* eslint-disable no-unused-vars */
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import {
  ShoppingCart,
  Product,
  User,
  Order,
  DeliveryAddress,
} from '../Database/models';

import validateOrder from '../validation/checkOut.validator';

import { verifyToken } from '../utils/user.util';

const checkOutMiddleware = asyncWrapper(async (req, res, next) => {
  const dbUser = req.user;

  const currentCart = await ShoppingCart.findAll({
    where: { userId: dbUser.id },
    include: Product,
  });

  if (!currentCart || currentCart.length === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'There are no items in the cart!',
    });
  }

  const isOrderExist = await Order.findAll({
    where: {
      userId: dbUser.id,
      status: 'pending'
    }
  });

  if (isOrderExist) {
    await Order.destroy({
      where: {
        userId: dbUser.id,
        status: 'pending'
      }
    });
  }

  const cartTotalPrice = currentCart
    .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
    .toFixed(2);

  const { deliveryAddress, paymentInformation } = req.body;

  const { error } = validateOrder(req.body);

  if (error) {
    return res.status(406).send(error.details[0].message);
  }

  req.user = dbUser;
  req.currentCart = currentCart;
  req.cartTotalPrice = cartTotalPrice;
  req.deliveryAddress = deliveryAddress;
  req.paymentInformation = paymentInformation;
  next();
});

export default checkOutMiddleware;
