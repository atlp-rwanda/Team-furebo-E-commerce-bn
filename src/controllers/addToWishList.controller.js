/* eslint-disable object-shorthand */
/* eslint-disable require-jsdoc */
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import db from '../Database/models';

const { Product, Wishlist, User } = db;

// eslint-disable-next-line import/prefer-default-export
export const addToWishList = async (req, res) => {
  const { token, productId } = req.body;
  // eslint-disable-next-line no-use-before-define
  let userId = (authenticateToken(token).success) ? authenticateToken(token).token.id : null;
  // eslint-disable-next-line no-unused-expressions
  console.log(userId);
  try {
    // Check if the user exists in the database
    userId = await User.findOne({ where: { id: userId } });
    if (!userId) {
      return res.status(404).json({ success: false, message: 'user not found', user: userId });
    }
    // Check if the product exists in the database
    const products = await Product.findOne({ where: { id: productId } });
    if (!products) {
      return res.status(404).json({ success: false, message: 'product not found', productId: productId });
    }
    // Check if the user already has the product in their wishlist
    const wishlist = await Wishlist.findOne({
      where: { user: `${userId.id}` }
    });
    if (!wishlist) {
      // If the user doesn't have a wishlist, create a new one
      await Wishlist.create({
        user: userId.id,
        products: [{ id: productId }]
      });
      return res.status(201).json({ success: true, message: 'Product added to wishlist' });
    }
    const parsedProducts = wishlist.products.map((product) => JSON.parse(product));
    // If the user already has the product in their wishlist, remove it
    if (parsedProducts.some((product) => product.id === productId)) {
      await wishlist.update({
        products: parsedProducts.filter((product) => product.id !== productId)
          .map((product) => JSON.stringify(product))
      });
      return res.status(200).json({ success: true, message: 'Product removed from wishlist' });
    }

    // If the user doesn't have the product in their wishlist, add it
    await wishlist.update({
      products: [...wishlist.products, { id: productId }]
    });
    return res.status(200).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).send({ success: false, message: `there was an internal server error: ${error}` });
  }
};
function authenticateToken(data) {
  const v = jwt.verify(data, process.env.USER_SECRET_KEY, (err, decoded) => {
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
export function addToken(userInfo, secretkey) {
  const token = jwt.sign(userInfo, secretkey);
  return token;
}
