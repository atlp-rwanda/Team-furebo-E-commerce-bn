import { ProductFeedback, Product, User } from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

export const createProductFeedback = asyncWrapper(async (req, res) => {
  const productId = req.params.id;
  const { rating, review } = req.body;
  const { user } = req;

  const existingFeedback = await ProductFeedback.findAll({
    where: {
      productId,
      userId: user.id,
    },
  });
  if (existingFeedback) {
    ProductFeedback.destroy({
      where: {
        productId,
        userId: user.id,
      },
    });
  }
  // Create new ProductRFeedback object

  const productFeedback = await ProductFeedback.create({
    productId,
    userId: user.id,
    rating,
    review,
  });

  // Update product average rating
  const ProductFeedbacks = await ProductFeedback.findAll({
    where: { productId },
  });

  const numRatings = ProductFeedbacks.length;
  const totalRating = ProductFeedbacks.reduce(
    (sum, rate) => sum + rate.rating,
    0
  );
  const newAvgRating = totalRating / numRatings;
  await Product.update(
    { averageRating: newAvgRating.toFixed(1) },
    {
      where: { id: productId },
    }
  );
  return res
    .status(201)
    .json({ message: 'Review successfuly created', data: productFeedback });
});

export const getFeedback = asyncWrapper(async (req, res) => {
  const productId = req.params.id;
  const productFeedback = await ProductFeedback.findAll({
    where: {
      productId,
    },
    include: [User],
  });

  if (productFeedback.length === 0) {
    return res.status(200).json({
      message: 'There is no Review or Feedback',
      productFeedback,
    });
  }
  const Feedback = productFeedback.map(item => {
    const { id, userId, productId, rating, review, createdAt, User } = item;
    const { fullname } = User;
    return {
      id,
      userId,
      fullname,
      productId,
      rating,
      review,
      createdAt,
    };
  });
  return res.status(200).json({
    Feedback,
  });
});
