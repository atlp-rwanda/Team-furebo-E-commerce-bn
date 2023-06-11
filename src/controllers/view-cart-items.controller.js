/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable linebreak-style */
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import { ShoppingCart, Product } from '../Database/models';

const viewCartItems = asyncWrapper(async (req, res) => {
  const { userId } = req;

  const viewCart = await ShoppingCart.findAll({
    where: { userId },
    include: Product, // Include the Product model to fetch the associated product details
  });

  if (viewCart.length === 0) {
    return res
      .status(404)
      .json({ message: 'You do not have items in your cart' });
  }

  // Map the viewCart array to include the product details in the response
  const cartItems = viewCart.map((item) => {
    const {
      id, userId, productId, quantity, totalPrice, cartTotalPrice, itemCounts, createdAt, updatedAt, Product
    } = item;
    const {
      name, price, category, image
    } = Product;
    const firstImage = image[0];

    const formattedCreatedAt = new Date(createdAt).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    const formattedUpdatedAt = new Date(updatedAt).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
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
    };
  });

  return res.status(200).json(cartItems);
});

export default viewCartItems;
