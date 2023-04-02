/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';
import 'dotenv/config';
import { User } from '../Database/models';

chai.use(chaiHttp);

const { expect } = chai;

describe('addToWishList', async () => {
  // Create a new user and get their authentication token
  const d = await User.findOne({ where: { email: 'abc@gmail.com ' } });
  const token = jwt.sign({ email: d.email, id: d.id }, process.env.USER_SECRET_KEY);
  const data = {
    token: token,
    productId: 1
  };

  context('check availablity of the user', () => {
    it('should return 404 if the user does not exist', async () => {
      data.token = 'non-existent-id';
      const res = await chai.request(app)
        .post('/api/add-to-wishlist')
        .send(data);
      expect(res).to.have.status(404);
    });
  });
  context('check availablity of the product', () => {
    it('should return 404 if the product does not exist', async () => {
      data.productId = 'non-existent-id';
      const res = await chai.request(app)
        .post('/api/add-to-wishlist')
        .send(data);
      const response = res.body;
      expect(res).to.have.status(404);
      expect(response.success).to.be.equal(false);
      expect(response.message).to.be.equal('product not found');
      console.log(data);
    });
  });
  context('create a new wishlis', () => {
    it('should create a new wishlist if the user does not have one', async () => {
      const res = await chai.request(app)
        .post('/api/add-to-wishlist')
        .send(data);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Product added to wishlist');
    });
  });
  context('remove the product from the wishlist', () => {
    it('should remove the product from the wishlist if it is already in the wishlist', async () => {
      const res = await chai.request(app)
        .post('/api/add-to-wishlist')
        .send(data);
      expect(res).to.have.status(200);
    });
  });
  context('add the product to the wishlist if it is not already available', () => {
    it('should add the product to the wishlist if it is not already in the wishlist', async () => {
      const res = await chai.request(app)
        .post('/api/add-to-wishlist')
        .send(data);
      expect(res).to.have.status(200);
    });
  });
});
