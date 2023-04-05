/* eslint-disable linebreak-style */
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

    // create new product record
    const parsedPrice = parseFloat(price); // Parse price as a float
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
      exDate
    });

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
      error: err.message
    });
  }
};

export default createProduct;
