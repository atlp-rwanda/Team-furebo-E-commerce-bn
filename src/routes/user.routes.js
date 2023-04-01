/* eslint-disable import/named */
/* eslint-disable linebreak-style */
import express from 'express';

import { createUser } from '../controllers/signup.controller';

import { changePassword } from '../controllers/modify-password.controller';

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

// Create a new User
router.post('/register', createUser);

// LOGIN

/**
 * @swagger
 * /api/login:
 *   post:
 *      tags:
 *          - User
 *      summary: "Logs in user with email and password and returns token"
 *      description: "Authorizes default users with email and password to use the endpoints"
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *              example:
 *                  email: "user@root.com"
 *                  password: "root"
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: "Authorization token"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      example:
 *                          "data": "token"
 *
 */

// login a user
router.post('/api/login', login);

// PASSWORD RESET

/**
 * @swagger
 * /requestPasswordReset:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset email to the user's email address.
 *     tags:
 *       - Reset Password Via Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: ruberwa3@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.post('/requestPasswordReset', requestPasswordReset);

/**
 * @swagger
 *
 * /reset-password:
 *   post:
 *     summary: Reset user password.
 *     description: Reset user password using a password reset token.
 *     tags:
 *       - Reset Password Via Email
 *     requestBody:
 *       description: Reset password request body.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: Password reset token received via email.
 *               newPassword:
 *                 type: string
 *                 description: User's new password.
 *     responses:
 *       '200':
 *         description: Password reset successfully.
 *       '400':
 *         description: Token parameter is required.
 */

router.post('/modify-password', changePassword);
router.post('/reset-password', resetPassword);

export default router;
