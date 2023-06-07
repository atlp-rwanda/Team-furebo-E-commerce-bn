/* eslint-disable linebreak-style */
import asyncWrapper from '../utils/handlingTryCatchBlocks';

// eslint-disable-next-line padded-blocks
const updateShoppingCart = asyncWrapper(async (req, res) => {
  const {
    quantity, cartItem, ShoppingCart, Product
  } = req;

  // Update the quantity and totalPrice fields of the cart item
  const totalPrice = quantity * cartItem.Product.price;
  const cartTotalPrice = totalPrice.toFixed(2);

  // Delete the cart item if the quantity is 0
  if (quantity === 0) {
    await cartItem.destroy();
  } else {
    // Update the cart item with the new quantity and prices
    await cartItem.update({
      quantity,
      totalPrice,
      cartTotalPrice,
    });
  }

  // Update the cartTotalPrice and itemCounts fields for the user's shopping cart
  const cartItems = await ShoppingCart.findAll({
    where: { userId: req.user.id },
    include: Product,
  });

  const newCartTotalPrice = cartItems
    .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
    .toFixed(2);

  const newItemCounts = cartItems
    .reduce((total, item) => total + item.quantity, 0);

  await ShoppingCart.update(
    { cartTotalPrice: newCartTotalPrice, itemCounts: newItemCounts },
    { where: { userId: req.user.id } }
  );

  res.status(200).json({
    message: 'Cart item updated successfully',
  });
});

export default updateShoppingCart;
