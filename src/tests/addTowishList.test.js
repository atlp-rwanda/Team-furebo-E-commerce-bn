/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import 'dotenv/config';

chai.use(chaiHttp);

const { expect } = chai;

describe('addToWishList', async () => {
  //GET INITIAL DATA
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJpYXQiOjE2ODAyNTA2NTEsImV4cCI6MTY4MDI2NTA1MX0.NuDQZebayNtrtC-uXAmHcSDazWWptYEVykIB4zj23xw";
  const data = {
    token: token,
    productId: 1
  };
  context('check availablity of the user', () => {
    it('should return 404 if the user does not exist', async () => {
      const res = await chai.request(app)
        .post('/api/add-to-wishlist')
        .send();
      expect(res).to.have.status(404);
    });
  });
  context('check availablity of the product', () => {
    it('should return 404 if the product does not exist', async () => {
      const p = data;
      const res = await chai.request(app)
        .post('/api/add-to-wishlist')
        .send({ token: p.token, productId: null });
      const response = res.body;
      expect(res).to.have.status(404);
      expect(response.success).to.be.equal(false);
      expect(response.message).to.be.equal('product not found');
      console.log(data);
    });
  });
  context('create a new wishlist', () => {
    it('should create a new wishlist if the user does not have one', async () => {
      const res = await chai.request(app)
        .post('/api/add-to-wishlist')
        .send(data);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Product added to wishlist');
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
  context('remove the product from the wishlist', () => {
    it('should remove the product from the wishlist if it is already in the wishlist', async () => {
      const res = await chai.request(app)
        .post('/api/add-to-wishlist')
        .send(data);
      expect(res).to.have.status(200);
    });
  });
});
