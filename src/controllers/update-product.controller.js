import asyncWrapper from '../utils/handlingTryCatchBlocks';
import checkExpiredProducts from '../utils/productExpiration';

const updateProduct = asyncWrapper(async (req, res) => {
  const { name, image, price, quantity, category, exDate } = req.body;

  const { product, productId, userId } = req;
  // update the product record
  const isExpired = new Date(exDate) < new Date();
  const status = quantity <= 1 || isExpired ? 'unavailable' : 'available';
  await product.update(
    {
      name,
      image,
      price,
      quantity,
      category,
      exDate,
      status,
    },
    { where: { userId, productId } }
  );
  checkExpiredProducts();
  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: product,
  });
});

export default updateProduct;
