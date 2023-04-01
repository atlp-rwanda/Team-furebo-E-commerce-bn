/* eslint-disable import/named */
/* eslint-disable linebreak-style */
import express from 'express';

import { changePassword } from '../controllers/modify-password.controller';

const router = express.Router();

/**
 * @swagger
 *  components:
 *      schemas:
 *          modifyPassword:
 *                      type: object
 *                      properties:
 *                          token:
 *                              type: string
 *                          oldPassword:
 *                              type: string
 *                          newPassword:
 *                              type: string
 */
/**
 * @swagger
 * /modify-password:
 *  post:
 *      summary: modifying a user's password
 *      description: This api is used to modify the password for the user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/modifyPassword'
 *      responses:
 *          200:
 *              description: This api is used to modify the password for the user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/modifyPassword'
 */
router.post('/modify-password', changePassword);
export default router;
