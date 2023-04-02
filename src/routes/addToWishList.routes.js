/* eslint-disable max-len */
/* eslint-disable import/named */
/* eslint-disable linebreak-style */
import express from 'express';

import { addToWishList } from '../controllers/addToWishList.controller';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          addtowishlist:
 *                      type: object
 *                      properties:
 *                          productId:
 *                              type: string
 *                          token:
 *                              type: string
 */
/**
 * @swagger
 * /api/add-to-wishlist:
 *  post:
 *      summary: modifying a users wishlist and creating a new one
 *      description: This api is used to modifying a users wishlist and creating a new one
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/addtowishlist'
 *      responses:
 *          200:
 *              description: This api is used to modifying a users wishlist and creating a new one
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/addtowishlist'
 */
router.post('/add-to-wishlist', addToWishList);
export default router;
