import { Product } from '../Database/models';
import validateProduct from '../validation/product.validator';

const createProduct = async (req, res) => {
  try {
    const { name, image, price, quantity, category, exDate } = req.body;

    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Get userId from logged in user
    const userId = req.user.id;

    // Verify if product already exists in the user's collection
    const productExists = await Product.findOne({
      where: { name, userId },
    });
    if (productExists) {
      return res.status(409).json({
        message: 'The product already exist, You can update its details only',
        data: productExists,
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
      userId, // set the userId field to the current user's ID
    });

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
      error: err.message,
    });
  }
};

export default createProduct;
