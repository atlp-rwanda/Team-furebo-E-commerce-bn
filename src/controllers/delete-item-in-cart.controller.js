/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const deleteCartItem = asyncWrapper(async (req, res) => {
  const { cartItem, ShoppingCart, Product } = req;

  await cartItem.destroy();

  const cartItems = await ShoppingCart.findAll({
    where: { userId: req.user.id },
    include: { model: Product },
  });

  const newCartTotalPrice = cartItems
    .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
    .toFixed(2);

  await ShoppingCart.update(
    { cartTotalPrice: newCartTotalPrice },
    { where: { userId: req.user.id } }
  );

  res.status(200).json({
    message: 'Item removed from cart',
  });
});

export default deleteCartItem;
