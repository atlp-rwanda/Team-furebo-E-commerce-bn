/* eslint-disable linebreak-style */
import express from 'express';
import resetPassword from './reset-password.routes';
import signupRouter from './signup.routes';
import testRouter from './test.routes';
import signupAdmin from './signupAdmin.routes';
import loginRouter from './login.routes';
import userRoles from './userRoles.routes';
import adminDisable from './disable-account.routes';
import googleAuth from './google-auth.routes';
import twoFactorAuth from './2FA-for-merchants.routes';
import createProduct from './create-product.routes';
import updateProduct from './update-product.routes';
import getItemsRouter from './getItems.routes';
import searchRouter from './searchProducts.routes';
import ShoppingCart from './shopping-cart.routes';
import updateShoppingCart from './update-shopping-cart.routes';
import deleteProductRouter from './deleteProduct.routes';
import viewCartItems from './view-cart-items.routes';
import checkOut from './checkOut.routes' ;
import logout from './logout.routes';
import markProductAvailability from './mark-availability.routes';
import changePassword from './change-password.routes';

const routes = express();

routes.use(googleAuth);
routes.use('/api', testRouter);
routes.use('/api', resetPassword);
routes.use('/api', signupRouter);
routes.use('/api', signupAdmin);
routes.use('/api/', loginRouter);
routes.use('/api', userRoles);
routes.use('/api', adminDisable);
routes.use('/api', twoFactorAuth);
routes.use('/api', createProduct);
routes.use('/api', updateProduct);
routes.use('/api', getItemsRouter);
routes.use('/api', searchRouter);
routes.use('/api', ShoppingCart);
routes.use('/api', updateShoppingCart);
routes.use('/api', deleteProductRouter);
routes.use('/api', viewCartItems);
routes.use('/api', checkOut);
routes.use('/api', logout);
routes.use('/api', markProductAvailability);
routes.use('/api', changePassword);

export default routes;