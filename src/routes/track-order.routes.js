/* eslint-disable linebreak-style */
import express from 'express';

import { getOrderStatus, updateOrderStatus, BuyerGetAllOrdersStatutes, GetAllOrdersStatutes} from '../controllers/track-order.controller'

import { authorizeUser, authorizeAdmin, authorizeCustomer } from '../middlewares/userRoles.middleware';

import AuthMiddleware from '../middlewares/login.middleware';

import trackOrderMiddleware from '../middlewares/track-order.middleware';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          OrderStatus:
 *              type: object
 *              properties:
 *                  orderId:
 *                      type: integer
 *                  status:
 *                      type: string
 *                  deliveryDate:
 *                      type: string
 * 
 */

router.get('/orderStatus/:id', AuthMiddleware.checkAuthentication, authorizeCustomer, trackOrderMiddleware, getOrderStatus);

/**
 * @swagger
 * /api/orderStatus/{id}:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     summary: Buyer tracks order status
 *     description: This endpoint is for the buyer to be able to track their order status
 *     parameters:
 *        - name: id
 *          in: path
 *          description: Id of the order you want to track
 *          schema:
 *              type: integer
 *     tags: [Track Order]
 *     produces:
 *         - application/json
 *     responses:
 *       200:
 *         description: Successful request!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Order status
 *                 data:
 *                   $ref: '#/components/schemas/OrderStatus'
 *                     
 *       400:
 *         description: Bad request. Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid Input
 *       401:
 *         description: Unauthorized. User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: UNAUTHORIZED ACCESS! YOU NEED TO BE AUTHENTICATED
 *       403:
 *         description: Unauthorized. User does not have necessary permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: UNAUTHORIZED! This order does not belong to you.
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *               example:
 *                 status: error
 *                 message: order not found
 *       500:
 *         description: Server error. Failed to load order status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Oops! Couldn't load the order status
 *                 error:
 *                   type: string
 *                   example: Error message
 */

router.patch('/updateOrderStatus/:id', AuthMiddleware.checkAuthentication, authorizeAdmin, trackOrderMiddleware, updateOrderStatus);

/**
 * @swagger
 * components:
 *      schemas:
 *          OrderStatusUpdate:
 *              type: object
 *              properties:
 *                  orderStatus:
 *                      type: string
 *                  deliveryDate:
 *                      type: string
 *
 */

/**
 * @swagger
 * /api/updateOrderStatus/{id}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     summary: Admin updates order status
 *     description: This endpoint is for the admin to be able to update status and delivery date of an order
 *     parameters:
 *        - name: id
 *          in: path
 *          description: Id of the order you want to update
 *          schema:
 *              type: integer
 *     tags: [Track Order]
 *     requestBody:
 *       description: Update order status or delivery date
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/OrderStatusUpdate'
 *     responses:
 *       200:
 *         description: Order Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/OrderStatus'
 *       400:
 *         description: Bad request. Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid Input
 *       401:
 *         description: Unauthorized. User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: UNAUTHORIZED ACCESS! YOU NEED TO BE AUTHENTICATED
 *       403:
 *         description: Unauthorized. User does not have necessary permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: UNAUTHORIZED! This order does not belong to you.
 * 
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *               example:
 *                 status: error
 *                 message: order not found
 * 
 *       500:
 *         description: Server error! Failed to updated order status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *               example:
 *                 status: error
 *                 message: Oops! Failed to update order status
 *
 */
router.get('/buyerOrders', authorizeUser, BuyerGetAllOrdersStatutes);
router.get('/getAllOrders', authorizeAdmin, GetAllOrdersStatutes)
export default router;
