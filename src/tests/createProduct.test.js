/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
// import request from 'supertest';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../index';
import { Product } from '../Database/models';
// import db from '../models';
const { expect } = chai;
chai.use(chaiHttp);

describe('POST /api/addProduct', () => {
  // afterEach(async () => {
  //   // clean up any products created during testing
  //   await db.destroy({ where: {} });
  // });

  context('CREATE PRODUCT WITH valid Data', () => {
    it('should return status 201 and add the product to the database', (done) => {
      const productData = {
        name: 'Screen',
        image: 'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 2000.99,
        quantity: 10,
        type: 'DELL',
        exDate: '2023-04-30'
      };

      chai.request(app)
        .post('/api/addProduct')
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Product created successfully');
          done();
        });
    });
  });

  context('when a required field is missing', () => {
    it('should return status 400 and an error message', (done) => {
      const productData = {
        name: 'Laptop',
        image: 'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 2000.99,
        quantity: 10,
        type: 'HP',
        // exDate is missing
      };

      chai.request(app)
        .post('/api/addProduct')
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Missing required fields');
          done();
        });
    });
  });

  context('when the price value is invalid', () => {
    it('should return status 400 and an error message', (done) => {
      const productData = {
        name: 'Laptop',
        image: 'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 'invalid_price_value',
        quantity: 10,
        type: 'example',
        exDate: '2023-04-30'
      };

      chai.request(app)
        .post('/api/addProduct')
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Invalid price value');
          done();
        });
    });
  });

  context('when product creation fails', () => {
    it('should return status 500 and an error message', (done) => {
      // Mock the behavior of the Product.create method to always throw an error
      const createStub = sinon.stub(Product, 'create').rejects(new Error('Failed to create product'));
      const productData = {
        name: 'Laptop',
        image: 'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 2000.99,
        quantity: 10,
        type: 'HP',
        exDate: '2023-04-30'
      };
      chai.request(app)
        .post('/api/addProduct')
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(500);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Failed to create product');
          // Restore the original behavior of the Product.create method
          createStub.restore();
          done();
        });
    });
  });
});
