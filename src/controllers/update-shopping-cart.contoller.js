/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-globals */
import { ShoppingCart, Product } from '../Database/models';

const updateShoppingCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    // Check if the user has already added this product to their shopping cart
    const cartItem = await ShoppingCart.findOne({
      where: { userId: req.user.id, productId },
      include: Product,
    });

    if (!cartItem) {
      return res.status(404).json({
        status: 'error',
        message: 'THE PRODUCT IS NOT IN THE CART',
      });
    }
    // Check if the quantity is a valid numbe(s)
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

    // Check if the requested quantity amount are less
    if (quantity > cartItem.Product.quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'THE STOCK HAS LESS QUANTITY',
      });
    }

    // Update the quantity and totalPrice fields of the cart item
    const totalPrice = quantity * cartItem.Product.price;
    const cartTotalPrice = totalPrice.toFixed(2);
    const updatedCartItem = await cartItem.update({
      quantity,
      totalPrice,
      cartTotalPrice,
    });

    // Update the cartTotalPrice field for the user's shopping cart
    const cartItems = await ShoppingCart.findAll({
      where: { userId: req.user.id },
      include: Product,
    });

    const newCartTotalPrice = cartItems
      .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
      .toFixed(2);

    await ShoppingCart.update(
      { cartTotalPrice: newCartTotalPrice },
      { where: { userId: req.user.id } }
    );

    res.status(200).json({
      status: 'success',
      message: 'THE ITEM IN THE CART WAS UPDATED SUCCESSFULLY!!!',
      data: {
        'UPDATED CART DETAILS': {
          id: updatedCartItem.id,
          userId: updatedCartItem.userId,
          quantity: updatedCartItem.quantity,
          totalPrice: updatedCartItem.totalPrice,
          cartTotalPrice: newCartTotalPrice,
          itemCounts: updatedCartItem.itemCounts,
          createdAt: updatedCartItem.createdAt,
          updatedAt: updatedCartItem.updatedAt,
          'PRODUCT DETAILS': {
            id: cartItem.Product.id,
            name: cartItem.Product.name,
            image: cartItem.Product.image,
            price: cartItem.Product.price,
            quantity: cartItem.Product.quantity,
            status: cartItem.Product.status,
            exDate: cartItem.Product.exDate,
          },
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'FAILED TO UPDATE THE CART',
      error: err.message,
    });
  }
};

export default updateShoppingCart;
