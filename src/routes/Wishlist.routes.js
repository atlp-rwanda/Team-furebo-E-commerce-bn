/* eslint-disable linebreak-style */
import express from 'express';
import {
  addItemToWishlist,
  viewWishlist,
  deleteWishlistItem,
  clearWishlist
} from '../controllers/Wishlist.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';

const router = express.Router();

// Add item to wishlist
router.post('/wishlist/:productId', authorizeUser, addItemToWishlist);

// View wishlist
router.get('/wishlist', authorizeUser, viewWishlist);

// Delete single item from wishlist
router.delete('/wishlist/:id', authorizeUser, deleteWishlistItem);

// Clear all wishlist items
router.delete('/wishlist', authorizeUser, clearWishlist);

export default router;
