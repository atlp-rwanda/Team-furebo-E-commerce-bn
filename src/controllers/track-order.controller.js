/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import asyncWrapper from '../utils/handlingTryCatchBlocks';

// Track order status
export const getOrderStatus = asyncWrapper( async (req, res) => {

  const { currentOrderStatus } = req.orderStatusData;

  res.status(200).json({ 
    status: 'success',
    message: 'Order status',
    data : currentOrderStatus
  });
})

// Update order status
export const updateOrderStatus = asyncWrapper( async (req, res) => {

  const { findOrder, currentOrderStatus, newOrderStatus, newDeliveryDate } = req.orderStatusData;

  await findOrder.update({
    status: newOrderStatus
  });

  await currentOrderStatus.update({
    status: newOrderStatus,
    deliveryDate: newDeliveryDate
  })

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: currentOrderStatus
  });
})
