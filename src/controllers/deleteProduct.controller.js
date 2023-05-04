import { Product } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

const deleteProduct = asyncWrapper(async (req, res) => {
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
});

export default deleteProduct;
