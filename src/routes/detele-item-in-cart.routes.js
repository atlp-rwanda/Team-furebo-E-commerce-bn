/* eslint-disable linebreak-style */
import express from 'express';
import deleteCartItem from '../controllers/delete-item-in-cart.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';
import deleteCartItemMiddleware from '../middlewares/delete-item-cart.middleware';

const router = express.Router();

router.delete(
  '/delete-item-in-cart/:id',
  authorizeUser,
  deleteCartItemMiddleware,
  deleteCartItem
);

export default router;
