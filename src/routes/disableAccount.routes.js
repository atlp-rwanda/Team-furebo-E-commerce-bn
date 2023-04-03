import express from 'express';
import disableAccount from '../controllers/disableAccount.controller';

const router = express.Router();
/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  isEnabled:
 *                      type: boolean
 */
/**
 * @swagger
 * /api/disableAccount/{id}:
 *   patch:
 *     summary: This API is for disable/enable account for various reasons
 *     description: This API is used to disable/enable account by ID.
 *     tags:
 *       - User
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of a user to disable
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Update fields for the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Account disable successfully
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
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description:  account not found
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
 *                 message: User not found
 *       500:
 *         description: Failed to disable account
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
 *                 message: Failed to disable account
 *
 */
router.patch('/disableAccount/:id', disableAccount);

export default router;
