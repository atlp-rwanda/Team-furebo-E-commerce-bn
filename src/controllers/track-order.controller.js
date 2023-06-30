/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import db from '../Database/models';

const { User } = db;
const { Order } = db;

// Track order status
export const getOrderStatus = asyncWrapper(async (req, res) => {
  const { currentOrderStatus } = req.orderStatusData;

  res.status(200).json({
    status: 'success',
    message: 'Order status',
    data: currentOrderStatus
  });
});

export const BuyerGetAllOrdersStatutes = asyncWrapper(async (req, res) => {
  const existingUser = await User.findByPk(req.user.id);
  if (existingUser) {
    let orders = [];
    orders = await Order.findAll({
      where: {
        userId: existingUser.id
      }
    });
    if (orders) {
      res.status(200).json({
        status: 'success',
        orders,
      });
    } else {
      res.status(404).json({
        message: 'No order Found'
      });
    }
  }
});
export const GetAllOrdersStatutes = asyncWrapper(async (req, res) => {
  let orders = [];
  orders = await Order.findAll({
  });
  if (orders) {
    res.status(200).json({
      status: 'success',
      orders,
    });
  } else {
    res.status(404).json({
      message: 'No order Found'
    });
  }
});

// Update order status
export const updateOrderStatus = asyncWrapper(async (req, res) => {
  const {
    findOrder, currentOrderStatus, newOrderStatus, newDeliveryDate
  } = req.orderStatusData;

  await findOrder.update({
    status: newOrderStatus
  });

  await currentOrderStatus.update({
    status: newOrderStatus,
    deliveryDate: newDeliveryDate
  });

  res.status(200).json({
    status: 'success',
    message: 'Order status updated successfully',
    data: currentOrderStatus
  });
});
