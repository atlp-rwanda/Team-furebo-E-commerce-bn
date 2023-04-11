import { Product } from '../Database/models';

const createProduct = async (req, res) => {
  try {
    const {
      name, image, price, quantity, type, exDate
    } = req.body;

    // Check for missing required fields
    if (!name || !image || !price || !quantity || !type || !exDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    // Check if price is positive
    if (price <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Price must be a positive number',
      });
    }

    // Check if quantity is positive
    if (quantity <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be a positive number',
      });
    }

    // create new product record
    const parsedPrice = parseFloat(price);
    if (Number.isNaN(parsedPrice)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid price value',
      });
    }

    const product = await Product.create({
      name,
      image,
      price: parsedPrice,
      quantity,
      type,
      status: quantity > 1 ? 'available' : 'unavailable',
      exDate,
      userId: req.user.id, // set the userId field to the current user's ID
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
