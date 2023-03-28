/* eslint-disable linebreak-style */
import express from 'express';
import {
  createUser,
  requestPasswordReset,
  resetPassword
} from '../controllers/user.controller';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  firstname:
 *                      type: string
 *                  lastname:
 *                      type: string
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *                  confirmPassword:
 *                      type: string
 */

/**
 * @swagger
 * /home:
 *  get:
 *      description: Display homepage
 *      responses:
 *          '200':
 *              description: successful request
 */

/**
 * @swagger
 * /api/register:
 *  post:
 *      summary: registering a user
 *      description: This api is used to register a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/User'
 *      responses:
 *          200:
 *              description: This api is used to register a user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/User'
 */

// Create a new Tutorial
router.post('/register', createUser);
// router.post('/login', login);
router.post('/requestPasswordReset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
