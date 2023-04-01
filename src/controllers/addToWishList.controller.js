/* eslint-disable require-jsdoc */
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import db from '../Database/models';

const { Product, Wishlist } = db;

// Add or remove a product from the user's wishlist
const addToWishList = async (req, res, next) => {
  // eslint-disable-next-line prefer-const
  let { token, productId } = req.body;
  // eslint-disable-next-line no-use-before-define
  const userId = (authenticateToken(token).success) ? authenticateToken(token).token.id : null;

  try {
    // Check if the product exists in the database
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the user already has the product in their wishlist
    const wishlist = await Wishlist.findOne({
      where: { userId },
      attributes: ['id', 'products']
    });
    if (!wishlist) {
      // If the user doesn't have a wishlist, create a new one
      await Wishlist.create({
        id: userId,
        userId,
        products: [productId]
      });
      return res.status(201).json({ message: 'Product added to wishlist' });
    }

    // If the user already has the product in their wishlist, remove it
    if (wishlist.products.includes(productId)) {
      await wishlist.update({
        products: wishlist.products.filter((id) => id !== productId)
      });
      return res.status(200).json({ message: 'Product removed from wishlist' });
    }

    // If the user doesn't have the product in their wishlist, add it
    await wishlist.update({
      products: [...wishlist.products, productId]
    });
    return res.status(200).json({ message: 'Product added to wishlist' });
  } catch (error) {
    next(error);
  }
};
function authenticateToken(data) {
  const v = jwt.verify(data, process.env.USER_SCREET_KEY, (err, decoded) => {
    let response;
    if (err) {
      response = { success: false, message: null };
    } else {
      response = { success: true, token: decoded };
    }
    return response;
  });
  return v;
}
export default addToWishList;
