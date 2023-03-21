import express from 'express';
import modifyPassword from '../controllers/change-password.controller';
import { authorizeUser } from '../middlewares/userRoles.middleware';
import changePasswordMiddleware from '../middlewares/change-password.middleware';

const router = express();

router.patch(
  '/modify-password/:id',
  authorizeUser,
  changePasswordMiddleware,
  modifyPassword
);

export default router;
