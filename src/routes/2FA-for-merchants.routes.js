import express from 'express';
import {
  verify2FAkey, disable2FAForMerchants, enable2FAForMerchants, resendOTP
} from '../controllers/two-factor-auth.controller';
import { authorizeMerchant } from '../middlewares/userRoles.middleware';

const router = express.Router();

router.post('/2fa/enable2faForMerchant', authorizeMerchant, enable2FAForMerchants);
/**
 * @swagger
 * /api/2fa/enable2faForMerchant:
 *  post:
 *      tags:
 *          - 2FA for Merchants
 *      summary: Turning ON 2FA for merchants
 *      description: This api is used to turn ON 2FA for merchants
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Two Factor Authentication enabled successfuly
 *          409:
 *              description: Two Factor Authentication is already enabled for this user
 */
router.post('/2fa/disable2faForMerchant', authorizeMerchant, disable2FAForMerchants);
/**
 * @swagger
 * /api/2fa/disable2faForMerchant:
 *  post:
 *      tags:
 *          - 2FA for Merchants
 *      summary: Turning OFF 2FA for merchants
 *      description: This api is used to turn ON 2FA for merchants
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Two Factor Authentication disabled successfuly
 *          409:
 *              description: Two Factor Authentication is already disabled for this user
 */
router.post('/2fa/resendOTP', authorizeMerchant, resendOTP);
/**
 * @swagger
 * /api/2fa/resendOTP:
 *  post:
 *      tags:
 *          - 2FA for Merchants
 *      summary: Turning OFF 2FA for merchants
 *      description: This api is used to turn ON 2FA for merchants
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: OTP is resent to user email
 *          500:
 *              description: server error
 */
router.post('/2fa/verify', authorizeMerchant, verify2FAkey);
/**
 * @swagger
 * /api/2fa/verify:
 *  post:
 *      summary: Verify the OTP code from user.
 *      description: Use this endpoint to update the role of a user.
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - 2FA for Merchants
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          code:
 *                              type: string
 *      responses:
 *          200:
 *              description: Two Factor Authentication successful
 *          403:
 *              description: Code is wrong or expired! Please try again
 */
export default router;
