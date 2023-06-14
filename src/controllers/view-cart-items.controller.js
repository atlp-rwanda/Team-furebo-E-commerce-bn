/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */

import asyncWrapper from '../utils/handlingTryCatchBlocks';
import { ShoppingCart, Product } from '../Database/models';

const viewCartItems = asyncWrapper(async (req, res) => {
  const { userId } = req;

  const viewCart = await ShoppingCart.findAll({
    where: { userId },
    include: Product,
  });

  if (viewCart.length === 0) {
    return res.status(404).json({ message: 'You do not have items in your cart' });
  }

  const cartItems = await Promise.all(
    viewCart.map(async (item) => {
      const {
        id, userId, productId, quantity, totalPrice, cartTotalPrice, itemCounts, createdAt, updatedAt, Product
      } = item;

      const {
        name, price, category, image, quantity: productQuantity
      } = Product || {};
      const firstImage = image ? image[0] : null;

      const formattedCreatedAt = new Date(createdAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      const formattedUpdatedAt = new Date(updatedAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      return {
        id,
        userId,
        productId,
        quantity,
        totalPrice,
        cartTotalPrice,
        itemCounts,
        createdAt: formattedCreatedAt,
        updatedAt: formattedUpdatedAt,
        image: firstImage,
        name,
        price,
        category,
        productQuantity,
      };
    })
  );

  return res.status(200).json(cartItems);
});

export default viewCartItems;
