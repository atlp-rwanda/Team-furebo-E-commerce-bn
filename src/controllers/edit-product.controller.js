/* eslint-disable linebreak-style */
import { Product } from '../Database/models';

const editProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(500).send('internal server error');
    }
    const {
      name, image, price, quantity, type, exDate
    } = req.body;

    // find the product to update
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // update the product record
    await product.update({
      name,
      image,
      price,
      quantity,
      type,
      exDate,
      status: quantity > 1 ? 'available' : 'unavailable'
    });

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
      data: err
    });
  }
};

export default editProduct;
