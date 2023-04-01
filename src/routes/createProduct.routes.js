/* eslint-disable linebreak-style */
import express from 'express';
import createProduct from '../controllers/createProduct.controller';

const router = express.Router();
router.post('/addProduct', createProduct);

export default router;
