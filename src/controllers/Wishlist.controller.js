/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable linebreak-style */
import {
  Wishlist, User, Product
} from '../Database/models';
import asyncWrapper from '../utils/handlingTryCatchBlocks';

// Add item to wishlist
export const addItemToWishlist = asyncWrapper(async (req, res) => {
  const { id: userId } = req.user;
  const { productId } = req.params;

  // Check if the User exists
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Check if the Product exists
  const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  // Check if the item is already in the wishlist
  const existingItem = await Wishlist.findOne({ where: { productId, userId } });

  if (existingItem) {
    // Remove the item from the wishlist
    await existingItem.destroy();

    return res.status(200).json({
      success: true,
      message: 'Removed from wishlist',
    });
  }

  // Create a new item in the wishlist
  const newItem = await Wishlist.create({
    productId,
    isAdded: true,
    userId,
  });

  return res.status(201).json({
    success: true,
    message: 'Added to wishlist',
    data: newItem,
  });
});


// View All Wishlist Items
export const viewWishlist = asyncWrapper(async (req, res) => {
  const { id } = req.user;

  const viewWishlist = await Wishlist.findAll({
    where: { userId: id },
    include: [Product],
  });

  if (viewWishlist.length === 0) {
    return res.status(404).json({ message: 'You do not have items in your wishlist' });
  }

  // Map the viewWishlist array to include the product details in the response
  const wishlistItems = viewWishlist.map((item) => {
    const {
      id,
      userId,
      productId,
      isAdded,
      createdAt,
      updatedAt,
      Product
    } = item;

    const {
      name,
      price,
      quantity,
      category,
      image
    } = Product;

    const firstImage = image[0];

    const formattedCreatedAt = new Date(createdAt).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const formattedUpdatedAt = new Date(updatedAt).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      id,
      userId,
      productId,
      isAdded,
      createdAt: formattedCreatedAt,
      updatedAt: formattedUpdatedAt,
      image: firstImage,
      name,
      price,
      quantity,
      category,
    };
  });

  return res.status(200).json(wishlistItems);
});

// Delete Wishlist Items
export const deleteWishlistItem = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const wishlistItem = await Wishlist.findOne({
    where: { id, userId },
  });

  if (!wishlistItem) {
    return res.status(404).json({
      success: false,
      message: 'Wishlist item not found',
    });
  }

  await wishlistItem.destroy();

  res.status(200).json({
    success: true,
    message: 'Removed from wishlist',
  });
});

// Clear All Wishlist Items
export const clearWishlist = asyncWrapper(async (req, res) => {
  const { id } = req.user;

  await Wishlist.destroy({
    where: { userId: id },
  });

  res.status(200).json({
    success: true,
    message: 'Wishlist cleared successfully',
  });
});
