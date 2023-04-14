/* eslint-disable linebreak-style */
import express from 'express';

import resetPassword from './reset-password.routes';

import signupRouter from './signup.routes';

import testRouter from './test.routes';

import signupAdmin from './signupAdmin.routes';

import loginRouter from './login.routes';

import userRoles from './userRoles.routes';

import googleAuth from './google-auth.routes';

import createProduct from './create-product.routes';
import updateProduct from './update-product.routes';
import getItemsRouter from './getItems.routes';
import searchRouter from './searchProducts.routes';

const routes = express();

routes.use('/api', testRouter);
routes.use('/api', resetPassword);
routes.use('/api', signupRouter);
routes.use('/api', signupAdmin);
routes.use(googleAuth);
routes.use('/api/', loginRouter);
routes.use('/api', userRoles);

routes.use('/api', createProduct);
routes.use('/api', updateProduct);
routes.use('/api', getItemsRouter);
routes.use('/api', searchRouter);

export default routes;
