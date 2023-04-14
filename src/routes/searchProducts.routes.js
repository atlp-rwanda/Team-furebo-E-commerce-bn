import express from 'express';
import searchProduct from '../controllers/searchProducts.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/search:
 *  get:
 *      summary: a customer able to search product by name, type, or price range(minPrice&maxPrice)
 *      description: This api is used to search a products as a customer
 *      parameters:
 *        - in: query
 *          name: name
 *          description: name of products you want to retrieve
 *          schema:
 *              type: string
 *        - in: query
 *          name: type
 *          description: type of products you want to retrieve
 *          schema:
 *              type: string
 *        - in: query
 *          name: minPrice
 *          description: minimum price of products you want to retrieve
 *          schema:
 *              type: integer
 *        - in: query
 *          name: maxPrice
 *          description: maximum price of product you want to retrieve
 *          schema:
 *              type: integer
 *      tags:
 *        - Product
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          200:
 *              description: This api is used to search a products as a customer
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Product'
 */

router.get('/search', authorizeUser, searchProduct);

export default router;
