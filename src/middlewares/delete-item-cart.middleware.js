/* eslint-disable linebreak-style */
import { ShoppingCart, Product, User } from '../Database/models';

const deleteCartItemMiddleware = async (req, res, next) => {
  const cartItemId = req.params.id;
  const { id } = req.user;

  const user = await User.findOne({ where: { id } });

  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  const cartItem = await ShoppingCart.findOne({
    where: { userId: req.user.id, id: cartItemId },
    include: { model: Product },
  });

  if (!cartItem) {
    return res.status(404).json({
      status: 'error',
      message: 'The cart item is not found',
    });
  }

  req.user = user;
  req.cartItem = cartItem;
  req.ShoppingCart = ShoppingCart; // Include the ShoppingCart model
  req.Product = Product; // Include the Product model
  next();
};

export default deleteCartItemMiddleware;
