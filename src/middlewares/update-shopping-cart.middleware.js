/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
import { ShoppingCart, Product, User } from '../Database/models';

const updateShoppingCartMiddleware = async (req, res, next) => {
  const cartItemId = req.params.id; // Change variable name to cartItemId
  const { quantity } = req.body;

  const { id } = req.user;

  // GET USER BY ID
  const user = await User.findOne({ where: { id } });

  // if (!user) {
  //   return res.status(404).json({ status: 'error', message: 'User not found' });
  // }

  // CHECK IF ID IS FROM USER WHO LOGGED IN
  // if (user.id !== req.user.id) {
  //   return res.status(403).json({ status: 'error', message: 'Unauthorized' });
  // }

  // Check if the user has already added this product to their shopping cart
  const cartItem = await ShoppingCart.findOne({
    where: { userId: req.user.id, id: cartItemId }, // Use cartItemId instead of productId
    include: Product,
  });

  if (!cartItem) {
    return res.status(404).json({
      status: 'error',
      message: 'THE CART ITEM IS NOT FOUND',
    });
  }
  // Check if the quantity is a valid number(s)
  if (isNaN(quantity)) {
    return res.status(400).json({
      status: 'error',
      message: 'QUANTITY HAS TO BE A VALID POSITIVE NUMBER(s) [1-9]',
    });
  }

  // Check if the quantity is negative
  if (quantity < 0) {
    return res.status(400).json({
      status: 'error',
      message: 'PLEASE ENTER POSITIVE NUMBER(s), LIKE [1-9]',
    });
  }

  // Check if the requested quantity is greater than the available quantity
  if (quantity > cartItem.Product.quantity) {
    return res.status(400).json({
      status: 'error',
      message: 'THE STOCK HAS INSUFFICIENT QUANTITY',
    });
  }

  req.user = user;
  req.quantity = quantity;
  req.cartItem = cartItem;
  req.ShoppingCart = ShoppingCart;
  req.Product = Product;
  next();
};

export default updateShoppingCartMiddleware;
