import express from 'express';
import { authorizeCustomer } from '../middlewares/userRoles.middleware';

import AuthMiddleware from '../middlewares/login.middleware';

import checkOutMiddleware from '../middlewares/checkOut.middleware';

import { buyerCheckout } from '../controllers/checkOut.controller';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  productId:
 *                      type: integer
 *                      example: 1
 *                  quantity:
 *                      type: integer
 *                      example: 2
 *                  price:
 *                      type: number
 *                      format: double
 *                      example: 5000.00
 *          Order:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                  userId:
 *                      type: integer
 *                  products:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Product'
 *                  priceToPay:
 *                      type: number
 *                      format: double
 *                      example: 120000.00
 *                  paymentInformation:
 *                      type: object
 *                      properties:
 *                          method:
 *                            type: string
 *                            example:
 *                          details:
 *                            type: object
 *                  deliveryAddress:
 *                        type: object
 *                        properties:
 *                          street:
 *                            type: string
 *                          city:
 *                            type: string
 *                          country:
 *                            type: string
 *                          zipCode:
 *                            type: string
 *                  status:
 *                      type: string
 *                      example: pending
 * 
 */

router.post('/checkout', 
    AuthMiddleware.checkAuthentication, 
    authorizeCustomer, 
    checkOutMiddleware, 
    buyerCheckout
);

export default router;