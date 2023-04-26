import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../index';

import { sequelize } from '../Database/models';
const { expect } = chai;
chai.use(chaiHttp);

describe('VIEW ITEMS IN SHOPPING CART', () => {
  let SELLER_TOKEN;
  let BUYER_TOKEN;

  // SELLER INFO
  const sellerData = {
    firstname: 'State',
    lastname: 'Price',
    email: 'state19@gmail.com',
    password: 'State1912',
  };
  const sellerLoginData = {
    email: 'state19@gmail.com',
    password: 'State1912',
  };
  // BUYER INFO
  const buyerData = {
    firstname: 'MUGABO',
    lastname: 'James',
    email: 'mugabo@gmail.com',
    password: 'Mugabo1234',
  };
  const buyerLoginData = {
    email: 'mugabo@gmail.com',
    password: 'Mugabo1234',
  };

  beforeEach(async () => {
    // ========= SELLER ACCOUNT
    await chai
      .request(app)
      .post('/api/register')
      .send(sellerData);

    // ========= BUYER ACCOUNT
    await chai
      .request(app)
      .post('/api/register')
      .send(buyerData);

    const sellerLogin = await chai
      .request(app)
      .post('/api/login')
      .send(sellerLoginData);
    expect(sellerLogin).to.have.status(200);
    SELLER_TOKEN = sellerLogin.body.token;

    const buyerLogin = await chai
      .request(app)
      .post('/api/login')
      .send(buyerLoginData);
    expect(buyerLogin).to.have.status(200);
    BUYER_TOKEN = buyerLogin.body.token;
  });
  after(async () => {
    await sequelize.sync({ force: true });
  });

  context(' IT SHOULD RETRIEVE ALL ITEMS IN USER ACCOUNT ', () => {
    it(' should retrieve data and return 200 status', async () => {
      const res = await chai
        .request(app)
        .get('/api/view-cart-items')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` });

      expect(res).to.have.status(200);
    });
  });
  context(' WHEN CART IS EMPTY TELL USER THAT HAS NONE IN CART ', () => {
    it(' should return 404 status when cart is empty', async () => {
      const res = await chai
        .request(app)
        .get('/api/view-cart-items')
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` });

      expect(res).to.have.status(404);
      expect(res.body.message).to.equal('You do not have items in your cart');
    });
  });
});
