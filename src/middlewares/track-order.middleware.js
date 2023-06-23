/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import {
  Order,
  OrderStatus
} from '../Database/models';

import asyncWrapper from '../utils/handlingTryCatchBlocks';

import validateOrderStatus from '../validation/track-order.validator';

const trackOrderMiddleware = asyncWrapper(async (req, res, next) => {
  const orderId = req.params.id;

  const dbUser = req.user;

  const { orderStatus, deliveryDate } = req.body;

  const findOrder = await Order.findOne({ where: { id: orderId } });

  if (!findOrder) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }

  const userRole = JSON.parse(dbUser.role);

  if (userRole.name === 'customer') {
    if (findOrder.dataValues.userId !== dbUser.dataValues.id) {
      return res.status(403).json({
        status: 'error',
        message: 'UNAUTHORIZED! This order does not belong to you.'
      });
    }
  }

  const currentOrderStatus = await Order.findOne({ where: { id: orderId } });

  if (!currentOrderStatus) {
    return res.status(404).json({
      status: 'error',
      message: 'Order status not found'
    });
  }

  if (orderStatus || deliveryDate) {
    const { error } = validateOrderStatus(req.body);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Input',
        data: error.details[0].message,
      });
    }
  }

  req.orderStatusData = {
    currentOrderStatus,
    findOrder,
    newOrderStatus: orderStatus,
    newDeliveryDate: deliveryDate
  };
  next();
});

export default trackOrderMiddleware;
