/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { Product } from '../Database/models';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('POST PRODUCT', async () => {
  let sellerToken;
  let adminToken;
  let sellerId;
  let adminRegResToken;
  let customerTokenBeforeMechant;

  const adminData = {
    firstname: 'James',
    lastname: 'admin',
    email: 'admin19@gmail.com',
    password: 'Admin1912',
  };
  const sellerData = {
    firstname: 'Jana',
    lastname: 'Seller',
    email: 'seller19@gmail.com',
    password: 'Seller1912',
  };
  const loginAdmin = {
    email: 'admin19@gmail.com',
    password: 'Admin1912',
  };
  const loginSeller = {
    email: 'seller19@gmail.com',
    password: 'Seller1912',
  };

  before(async () => {
    // Register admin
    const adminRegRes = await chai
      .request(app)
      .post('/api/registerAdmin')
      .send(adminData);
    adminRegResToken = adminRegRes.body.token;

    // Register seller
    const sellerRes = await chai
      .request(app)
      .post('/api/register')
      .send(sellerData);

    // Login as admin and get token
    const adminRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminRes).to.have.status(200);
    adminToken = adminRes.body.token;

    // Login as Login Seller before updted and get token
    const customerTokenBeforeMechantRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller);
    expect(customerTokenBeforeMechantRes).to.have.status(200);
    customerTokenBeforeMechant = customerTokenBeforeMechantRes.body.token;

    const verifyCustomerBeforeMerchant = await jwt.verify(
      customerTokenBeforeMechant,
      process.env.USER_SECRET_KEY
    );
    sellerId = verifyCustomerBeforeMerchant.id;

    // Update seller's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${sellerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });
    expect(adminRes).to.have.status(200);

    // Login as seller and get token
    const sellerLoginRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller);
    expect(sellerLoginRes).to.have.status(200);
    sellerToken = sellerLoginRes.body.token;
  });

  context('CREATE PRODUCT WITH valid Data', () => {
    it('should return status 201 and add the product to the database', done => {
      const productData = {
        name: 'Screen',
        image:
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 2000.99,
        quantity: 10,
        type: 'DELL',
        exDate: '2023-04-30',
      };

      chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${sellerToken}` })
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
    it('should return status 400 and an error message', done => {
      const productData = {
        name: 'Laptop',
        image:
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 2000.99,
        quantity: 10,
        type: 'HP',
        // exDate is missing
      };

      chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${sellerToken}` })
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
    it('should return status 400 and an error message', done => {
      const productData = {
        name: 'Laptop',
        image:
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 'invalid_price_value',
        quantity: 10,
        type: 'example',
        exDate: '2023-04-30',
      };

      chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${sellerToken}` })
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
    it('should return status 500 and an error message', done => {
      // Mock the behavior of the Product.create method to always throw an error
      const createStub = sinon
        .stub(Product, 'create')
        .rejects(new Error('Failed to create product'));
      const productData = {
        name: 'Laptop',
        image:
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 2000.99,
        quantity: 10,
        type: 'HP',
        exDate: '2023-04-30',
      };
      chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${sellerToken}` })
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

  context('when the quantity is not a positive number', () => {
    it('should return status 400 and an error message', done => {
      const productData = {
        name: 'Laptop',
        image:
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 2000.99,
        quantity: -12,
        type: 'example',
        exDate: '2023-04-30',
      };

      chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${sellerToken}` })
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Quantity must be a positive number');
          done();
        });
    });
  });

  context('when product creation fails', () => {
    it('should return status 500 and an error message', done => {
      // Mock the behavior of the Product.create method to always throw an error
      const createStub = sinon
        .stub(Product, 'create')
        .rejects(new Error('Failed to create product'));
      const productData = {
        name: 'Laptop',
        image:
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 2000.99,
        quantity: 10,
        type: 'HP',
        exDate: '2023-04-30',
      };
      chai
        .request(app)
        .post('/api/addProduct')
        .set({ Authorization: `Bearer ${sellerToken}` })
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
