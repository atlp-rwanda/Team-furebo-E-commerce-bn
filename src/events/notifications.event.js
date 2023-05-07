/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
import { EventEmitter } from 'events';
import { Op } from 'sequelize';
import cron from 'node-cron';
import socketIOClient from 'socket.io-client';
import {
  ProductStatus, Product, User, Notification
} from '../Database/models';
import sendMail from '../utils/sendEmail.util';

const templateHeader = `<table style="border-collapse:collapse;border-spacing:0;width:100%;min-width:100%" width="100%" height="auto" cellspacing="0" cellpadding="0" bgcolor="#F0F0F0">
<tbody><tr>
<td style="padding-top:54px;padding-bottom:42px" align="center">
<h2 style="color:#0090c6;font-size: xx-large;">E-commmerce App Notification</h2>
</td>
</tr>
</tbody></table>`;

const templateFooter = `<h3>Best regards,</h3>
<h5><i>Team Furebo E-commerce project team</i></h5>`;

const socket = socketIOClient(process.env.DEPLOYED_URL);

export const emitProductAddedEvent = async (product, merchant) => {
  const productId = product.id;
  const createdProductStatus = await ProductStatus.create({
    productId,
    status: 'created'
  });
  // const product = await Product.findOne({ where: { id: productId } });
  const recipient = {
    recipientEmail: merchant.email,
    emailSubject: 'Product creation',
    emailBody: `${templateHeader} <p><h5>Dear ${merchant.fullname}, </h5>
          We are pleased to inform you that your product has been successfully created with id <b>${productId}</b>.
          Your product is now visible to our users and we hope that it receives positive responses from potential buyers. 
          Please ensure that you have provided accurate information about your product, including its features, images, and pricing.
          If you have any questions or concerns, please don't hesitate to contact us.
          We are always here to support you and ensure that your experience on our platform is a pleasant one.
          </p>
          <p>Thank you again for choosing our platform.</p>
           ${templateFooter}`
  };
  const checkEmail = await sendMail(recipient);
  if (checkEmail) {
    const message = `Product ${product.name} has been updated`;
    const notification = await Notification.create({
      userId: merchant.id,
      message,
    });
    socket.emit('notification', {
      message: `Product ${createdProductStatus.status}`,
      userId: merchant.id
    });
    return notification;
  }
};

const emitter = new EventEmitter();

emitter.on('newProduct', emitProductAddedEvent);

export default emitter;

// cron.schedule('59 1 * * *', async () => {
//   console.log('Are you there?');
//   const allProducts = await Product.findAll();
//   console.log(allProducts);
//   for (const product of allProducts) {
//     if (new Date(product.exDate) < new Date()) {
//       console.log('found them');
//     }
//     const status = 'UNAVAILABLE';
//     const productOwner = await User.findOne({
//       where: { id: product.userId }
//     });
//     console.log(productOwner);
//     await product.update({ status });
//     console.log(productOwner);
//     emitter.emit('productExpired', product, productOwner);
//   }
// });
