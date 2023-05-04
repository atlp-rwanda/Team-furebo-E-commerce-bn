import asyncWrapper from '../utils/handlingTryCatchBlocks';

const setProductAvailability = asyncWrapper(async (req, res) => {
  const { product } = req;
  const { quantity, exDate } = req.body;

  // update the product status
  const isExpired = new Date(exDate) < new Date();
  const status = quantity <= 1 || isExpired ? 'unavailable' : 'available';
  await product.update({
    quantity,
    exDate,
    status,
  });

  res.status(200).json({
    status: 'success',
    message: 'Product availability have changed successfully',
    data: product,
  });
});

export default setProductAvailability;
