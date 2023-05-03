import { Product } from '../Database/models';

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: 'Product not valid or provided',
      });
    }
    const userId = req.user.id;
    const product = await Product.findOne({
      where: { id, userId },
    });
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    await product.destroy();
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: err.message,
    });
  }
};

export default deleteProduct;
