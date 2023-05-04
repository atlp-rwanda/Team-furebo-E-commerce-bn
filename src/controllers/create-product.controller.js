import sgMail from '@sendgrid/mail';
import { Product } from '../Database/models';
import validateProduct from '../validation/product.validator';
import asyncWrapper from '../utils/handlingTryCatchBlocks';
import checkExpiredProducts from '../utils/productExpiration';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createProduct = asyncWrapper(async (req, res) => {
  const {
    name, image, price, quantity, category, exDate
  } = req.body;

  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Get userId from logged in user
  const userId = req.user.id;

  // Verify if product already exists in the user's collection
  const productExists = await Product.findOne({
    where: { name, userId }
  });
  if (productExists) {
    return res.status(409).json({
      message: 'The product already exist, You can update its details only',
      data: productExists
    });
  }

  // Round the price
  const parsedPrice = parseFloat(price);

  const product = await Product.create({
    name,
    image,
    price: parsedPrice,
    quantity,
    category,
    status: quantity > 1 ? 'available' : 'unavailable',
    exDate,
    isExpired: false,
    userId // set the userId field to the current user's ID
  });
  checkExpiredProducts();
  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: product
  });
});
export default createProduct;
