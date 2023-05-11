/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';
import db from '../Database/models';
import { emitProductAddedEvent } from '../events/notifications.event';

const { User } = db;

chai.use(chaiHttp);
const { expect } = chai;

let merchantToken;
let customerToken;
let adminToken;
let customer2Token;
let orderId;
let notificationId;

const merchantData = {
  firstname: 'Jane',
  lastname: 'Doe',
  email: 'janedoe12@gmail.com',
  password: 'Password1234',
};

const loginMerchant = {
  email: 'janedoe12@gmail.com',
  password: 'Password1234',
};

const customerData = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'johndoe12@gmail.com',
  password: 'Password1234',
};

const loginCustomer = {
  email: 'johndoe12@gmail.com',
  password: 'Password1234',
};

const customer2Data = {
  firstname: 'customer',
  lastname: 'two',
  email: 'customer212@gmail.com',
  password: 'Password1234',
};

const loginCustomer2 = {
  email: 'customer212@gmail.com',
  password: 'Password1234',
};

const adminData = {
  firstname: 'Admin',
  lastname: 'Doe',
  email: 'admindoe12@gmail.com',
  password: 'Password1234',
};

const loginAdmin = {
  email: 'admindoe12@gmail.com',
  password: 'Password1234',
};

describe('MARK NOTIFICATIONS', async () => {
  before(async () => {
    // Register user
    await chai.request(app).post('/api/register').send(merchantData);

    await chai.request(app).post('/api/register').send(customerData);

    await chai.request(app).post('/api/register').send(customer2Data);

    // Register admin
    await chai.request(app).post('/api/registerAdmin').send(adminData);

    const merchantLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginMerchant);
    expect(merchantLogin).to.have.status(200);
    merchantToken = merchantLogin.body.token;

    const customerLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginCustomer);
    expect(customerLogin).to.have.status(200);
    customerToken = customerLogin.body.token;

    const customer2Login = await chai
      .request(app)
      .post('/api/login')
      .send(loginCustomer2);
    expect(customer2Login).to.have.status(200);
    customer2Token = customer2Login.body.token;

    const adminLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminLogin).to.have.status(200);
    adminToken = adminLogin.body.token;

    const verifyMerchant = await jwt.verify(
      merchantToken,
      process.env.USER_SECRET_KEY
    );
    const merchantId = verifyMerchant.id;

    const verifyCustomer = await jwt.verify(
      customerToken,
      process.env.USER_SECRET_KEY
    );
    const customerId = verifyCustomer.id;

    // Update seller's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${merchantId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });

    // Update 2nd seller's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${customerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });

    // create a new product to be added to the shopping cart
    const product = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${merchantToken}`)
      .send({
        name: 'HCT/RP 360ST',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2023-05-30',
      });
    expect(product).to.have.status(201);
    const merchant = await User.findByPk(merchantId);

    const notification = await emitProductAddedEvent(
      product.body.data,
      merchant
    );
    notificationId = notification.id;

    // create a 2nd product to be added to the shopping cart
    const product2 = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'HCT/RPhhhy 360ST',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PCwwy',
        exDate: '2023-05-30',
      });
    expect(product2).to.have.status(201);
    const merchant2 = await User.findByPk(customerId);

    const notification2 = await emitProductAddedEvent(
      product2.body.data,
      merchant2
    );
  });

  context(
    'It should fail to mark notification as read because it will not be there',
    () => {
      it('should return a status of 404 notification is not there', (done) => {
        const requestBody = {
          isRead: true,
        };
        chai
          .request(app)
          .post('/api/singleNotification/77')
          .set({ Authorization: `Bearer ${customerToken}` })
          .send(requestBody)
          .end((err, res) => {
            chai.expect(res).to.have.status(404);
            done();
          });
      });
    }
  );
  context('It should mark notification as read', () => {
    it('should return a status of 200 when notification is read', (done) => {
      const requestBody = {
        isRead: true,
      };
      chai
        .request(app)
        .post(`/api/singleNotification/${notificationId}`)
        .set({ Authorization: `Bearer ${merchantToken}` })
        .send(requestBody)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });
  context('It should mark all notifications as read', () => {
    it('should return a status of 200 when all notifications are read', (done) => {
      const requestBody = {
        isRead: true,
      };
      chai
        .request(app)
        .post('/api/allNotifications')
        .set({ Authorization: `Bearer ${customerToken}` })
        .send(requestBody)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });
  context(
    'It should fail to mark notification as read because there will not be notfication',
    () => {
      it('should return a status of 404 notification is not there', (done) => {
        const requestBody = {
          isRead: true,
        };
        chai
          .request(app)
          .post('/api/allNotifications')
          .set({ Authorization: `Bearer ${customerToken}` })
          .send(requestBody)
          .end((err, res) => {
            chai.expect(res).to.have.status(404);
            done();
          });
      });
    }
  );
});
