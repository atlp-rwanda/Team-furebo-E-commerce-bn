/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable import/named */
/* eslint-disable import/extensions */
/* eslint-disable import/first */
// import login from '../controllers/login.controller';
import express from 'express';
import { json } from 'body-parser';
import AuthMiddleware from '../middlewares/login.middleware';
import { PublicController } from '../controllers/login.controller';

const router = express.Router();

// LOGIN
/**
 * @swagger
 * /api/login:
 *   post:
 *      summary: "Logs in user with email and password and returns token"
 *      description: "Authorizes default user with valid email and password to use the endpoints"
 *      tags:
 *        - User
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

router.post('/login', PublicController.PublicLogin);

/**
 * @swagger
 * /api/protectedroute:
 *   get:
 *     summary: after successful login the user is redirected here
 *              where his credentials will be verified
 *     tags: [User]
 *     produces:
 *         - application/json
 *     responses:
 *       200:
 *         description: User is authorised
 *         content:
 *            application/json:
 *                  schema:
 *                      type: string
 *                  example:
 *                      "string"
 *
 *       500:
 *         description: Some server error
 */

router.get(
  '/protectedroute',
  AuthMiddleware.checkAuthentication,
  (req, res) => {
    res.send({ message: 'Access Granted' });
  }
);

export default router;
