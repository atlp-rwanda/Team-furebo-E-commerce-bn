/* eslint-disable linebreak-style */
import express from 'express';
import updateProduct from '../controllers/updateProduct.controller';

const router = express.Router();
router.patch('/updateProduct/:id', updateProduct);

export default router;
