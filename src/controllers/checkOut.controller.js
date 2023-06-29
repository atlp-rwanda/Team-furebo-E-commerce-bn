/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import {
  ShoppingCart,
  Product,
  User,
  Order,
  OrderStatus,
  DeliveryAddress,
} from '../Database/models';

export const buyerCheckout = asyncWrapper(async (req, res) => {
  const {
    user,
    currentCart,
    cartTotalPrice,
    deliveryAddress,
    paymentInformation,
  } = req;

  const products = [];

  currentCart.forEach((item) => {
    const product = {
      productId: item.productId,
      quantity: item.quantity,
      price: item.totalPrice,
    };
    products.push(product);
  });

  const addressExists = await DeliveryAddress.findOne({
    where: {
      userId: user.id,
      address: deliveryAddress,
    },
  });

  if (!addressExists) {
    await DeliveryAddress.create({
      userId: user.id,
      address: deliveryAddress,
    });
  }

  const order = await Order.create({
    userId: user.id,
    products,
    totalPrice: cartTotalPrice,
    deliveryAddress,
    paymentMethod: paymentInformation.method,
  });

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 14); // add 14 days (2 weeks) to the current date

  await OrderStatus.create({
    orderId: order.id,
    status: order.status,
    deliveryDate: deliveryDate,
  });

  res.status(200).json({
    status: 'success',
    message: 'Order created successfully, kindly proceed to payment!',
    data: order,
  });
});
