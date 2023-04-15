/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import { Product } from '../Database/models';
// import db from '../models';
// const { expect } = chai;
chai.use(chaiHttp);

describe('POST /api/edit-product', () => {
  let existingProductId;

  before(async () => {
    const productData = {
      name: 'Laptop',
      image: 'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
      price: 2000.99,
      quantity: 10,
      type: 'HP',
      exDate: '2023-04-30'
    };
    const product = await Product.create(productData);
    existingProductId = product.id;
  });

  context('when updating an existing product with valid data', () => {
    it('should return status 200 and update the product in the database', (done) => {
      const productData = {
        id: existingProductId,
        name: 'PC',
        price: 14.99,
        quantity: 5,
        type: 'Levovo'
      };
      chai.request(app)
        .post('/api/edit-product')
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.status).to.equal('success');
          chai.expect(res.body.data.name).to.equal(productData.name);
          chai.expect(res.body.data.price).to.equal(productData.price);
          chai.expect(res.body.data.quantity).to.equal(productData.quantity);
          chai.expect(res.body.data.type).to.equal(productData.type);
          done();
        });
    });
  });

  context('when updating a non-existing product', () => {
    it('should return status 404 and an error message', (done) => {
      const productData = {
        id: 55,
        name: 'Laptop',
        price: 2000.99,
        quantity: 10,
        type: 'non-existing'
      };
      chai.request(app)
        .post('/api/edit-product') // Invalid product ID
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(404);
          chai.expect(res.body.status).to.equal('error');
          chai.expect(res.body.message).to.equal('Product not found');
          done();
        });
    });
  });

  context('when product update fails', () => {
    it('should return a 500 error with an error message', (done) => {
      // Mock the behavior of the Product.findByPk method to return a product
      const productData = {
        d: null
      };
      chai.request(app)
        .post('/api/edit-product')
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(500);
          chai.expect(res.body.status).to.equal('error');
          chai.expect(res.body.message).to.equal('Failed to update product');
          chai.expect(res.body.data).to.be.an('object');
          // Restore the original behavior of the Product.findByPk method
          done();
        });
    });
  });
});
