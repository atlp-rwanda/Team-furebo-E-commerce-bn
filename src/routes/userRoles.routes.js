/* eslint-disable linebreak-style */
import express from 'express';
import {
  changeUserRole,
  addUserPermissions,
  RemoveUserPermissions,
} from '../controllers/userRoles.controller';
import { authorizeAdmin } from '../middlewares/userRoles.middleware';

const router = express.Router();

/**
 * @swagger
 * /api/updateRole/{id}:
 *  patch:
 *      summary: Updates the role of a user.
 *      description: Use this endpoint to update the role of a user.
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User Roles & Permissions
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID of the user to update the role
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          role:
 *                              type: string
 *      responses:
 *          200:
 *              description: User role updated successfully
 */
/**
 * @swagger
 * /api/addPermision/{id}:
 *  post:
 *      summary: Admin can assign a user certain permissions.
 *      description: Use this endpoint to add permissios of a user.
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User Roles & Permissions
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID of the user to add user roles
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          Permission:
 *                              type: string

 *      responses:
 *          200:
 *              description: User permission added successfully
 */
/**
 * @swagger
 * /api/removePermission/{id}:
 *  delete:
 *      summary: Admin can remove from a user certain permissions.
 *      description: Use this endpoint to remove permissions from a user.
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - User Roles & Permissions
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID of the user to remove permissions
 *            required: true
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          Permission:
 *                              type: string

 *      responses:
 *          200:
 *              description: User permission removed successfully
 */

router.patch('/updateRole/:id', authorizeAdmin, changeUserRole);
router.post('/addPermision/:id', authorizeAdmin, addUserPermissions);
router.delete('/removePermission/:id', authorizeAdmin, RemoveUserPermissions);
export default router;