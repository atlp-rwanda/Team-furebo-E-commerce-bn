/* eslint-disable linebreak-style */
/* eslint-disable no-multi-assign */
import { ShoppingCart, Product } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const addItemToCart = asyncWrapper(async (req, res) => {
  const { productId, quantity } = req.body;
  const { id } = req.user;

  // Check if the product exists
  const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    return res.status(400).json({
      status: 'error',
      message: 'THE PRODUCT WITH THAT ID IS NOT AVAILABLE',
    });
  }

  // Check if the product is available
  if (product.status === 'unavailable') {
    return res.status(400).json({
      status: 'error',
      message: 'THIS PRODUCT IS EITHER NOT IN STOCK OR EXPIRED',
    });
  }

  // Check if the quantity is a valid number
  if (isNaN(quantity)) {
    return res.status(400).json({
      status: 'error',
      message: 'QUANTITY HAS TO BE A VALID POSITIVE NUMBER [1-9]',
    });
  }

  // Check if the quantity is negative
  if (quantity < 0) {
    return res.status(400).json({
      status: 'error',
      message: 'PLEASE ENTER A POSITIVE NUMBER [1-9]',
    });
  }

  // Check if the requested quantity is available
  if (quantity > product.quantity) {
    return res.status(400).json({
      status: 'error',
      message: 'THE STOCK HAS INSUFFICIENT QUANTITY',
    });
  }

  // Check if the user has already added this product to their shopping cart
  const existingCartItem = await ShoppingCart.findOne({
    where: { userId: req.user.id, productId },
  });

  let updatedCartItem;
  let addedProduct;
  if (existingCartItem) {
    // If the user has already added this product to their shopping cart,
    // update the quantity and totalPrice fields
    const newQuantity = existingCartItem.quantity = +quantity;
    const totalPrice = newQuantity * product.price;
    const newTotalPrice = totalPrice.toFixed(2);

    updatedCartItem = await existingCartItem.update({
      quantity: newQuantity,
      totalPrice,
      cartTotalPrice: newTotalPrice,
    });

    addedProduct = product; // Assign the product details to addedProduct
  } else {
    // If this is a new item in the shopping cart, create a new record
    const totalPrice = quantity * product.price;
    const cartTotalPrice = totalPrice.toFixed(2);

    updatedCartItem = await ShoppingCart.create({
      userId: req.user.id,
      productId,
      quantity,
      totalPrice,
      cartTotalPrice,
    });

    addedProduct = product; // Assign the product details to addedProduct
  }

  // Update the cartTotalPrice and itemCounts for the user's shopping cart
  const cartItems = await ShoppingCart.findAll({
    where: { userId: req.user.id },
    include: Product,
  });

  const newCartTotalPrice = cartItems
    .reduce((total, item) => total + parseFloat(item.totalPrice), 0)
    .toFixed(2);

  const itemCounts = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Update the cartTotalPrice and itemCounts fields in the database for the user's shopping cart
  await ShoppingCart.update(
    { cartTotalPrice: newCartTotalPrice, itemCounts },
    { where: { userId: req.user.id } }
  );

  res.status(201).json({
    status: 'success',
    message: 'YES!, ITEM ADD TO THE CART SUCCESSFULLY!!!',
    addedProduct
  });
});

export default addItemToCart;
