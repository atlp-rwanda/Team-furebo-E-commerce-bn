/* eslint-disable linebreak-style */
import express from 'express';
import createProduct from '../controllers/create-product.controller';
import { authorizeMerchant } from '../middlewares/userRoles.middleware';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  image:
 *                      type: string
 *                  price:
 *                      type: number
 *                  quantity:
 *                      type: number
 *                  type:
 *                      type: string
 *                  status:
 *                      type: string
 *                  exDate:
 *                      type: string
 */

/**
 * @swagger
 * /api/addProduct:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: This API is for adding a product
 *     description: Add a new product to the database.
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 message:
 *                   type: string
 *                   description: success message
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: error message
 *       500:
 *         description: Failed to create product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: error message
 *                 error:
 *                   type: string
 *                   description: error details
 */
router.post('/addProduct', authorizeMerchant, createProduct);

export default router;