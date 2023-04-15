/* eslint-disable linebreak-style */
import express from 'express';
import editProduct from '../controllers/edit-product.controller';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          editProduct:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                          name:
 *                              type: string
 *                          image:
 *                              type: string
 *                          price:
 *                              type: number
 *                          quantity:
 *                              type: number
 *                          type:
 *                              type: string
 *                          exDate:
 *                              type: string
 */
/**
 * @swagger
 * /api/edit-product:
 *  post:
 *      summary: modifying a seller's product in the product's list
 *      description: This api is used to modify the product for the seller
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/editProduct'
 *      responses:
 *          200:
 *              description: This api is used to modify the product for the seller
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/editProduct'
 */
router.post('/edit-product', editProduct);

export default router;
