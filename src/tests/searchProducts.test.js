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

describe('SEARCH PRODUCTS', async () => {
  let sellerToken;
  let adminToken;
  let sellerId;
  let adminRegResToken;
  let customerTokenBeforeMechant;

  const adminData = {
    firstname: 'James',
    lastname: 'admin',
    email: 'laura@gmail.com',
    password: 'Admin1912',
  };
  const sellerData = {
    firstname: 'Jana',
    lastname: 'Seller',
    email: 'idole@gmail.com',
    password: 'Seller1912',
  };
  const loginAdmin = {
    email: 'laura@gmail.com',
    password: 'Admin1912',
  };
  const loginSeller = {
    email: 'idole@gmail.com',
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

  it('should return status 201 and add first product to the database', done => {
    const productData = {
      name: 'Screen',
      image: [
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
      ],
      price: 900.99,
      quantity: 10,
      category: 'Electronics',
      exDate: '2123-05-30',
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

  it('should return status 201 and add second product to the database', done => {
    const productData = {
      name: 'lenovo',
      image: [
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
      ],
      price: 900.99,
      quantity: 10,
      category: 'Electronics',
      exDate: '2123-05-30',
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

  // Define a test for searching by name
  it('should return products that match the name query', done => {
    const req = {
      query: {
        name: 'lenovo',
      },
    };
    chai
      .request(app)
      .get('/api/search')
      .set({ Authorization: `Bearer ${customerTokenBeforeMechant}` })
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  // Define a test for searching by price range
  it('should return products that match the price range query', done => {
    const req = {
      query: {
        minPrice: 100,
        maxPrice: 1000,
      },
    };
    chai
      .request(app)
      .get('/api/search')
      .set({ Authorization: `Bearer ${customerTokenBeforeMechant}` })
      .query(req.query)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  // Define a test for searching by category
  it('should return products that match the category query', done => {
    chai
      .request(app)
      .get('/api/search?category=Electronics')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  // Define a test for searching with a combination of queries
  it('should return products that match the combination of queries', done => {
    chai
      .request(app)
      .get(
        '/api/search?name=Screen&category=Electronics&minPrice=100&maxPrice=1000'
      )
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  // Define a test for searching with unavailable product
  it('should return error of 404 and a message of product not found ', done => {
    chai
      .request(app)
      .get('/api/search?name=Lion')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(404);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('Product not found');
        done();
      });
  });

  it('should return error with status 406 when you entered an invalid credentials', done => {
    chai
      .request(app)
      .get('/api/search?minPrice=1000&maxPrice=100')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(406);
        done();
      });
  });

  it('should return error with status 406 when you entered an invalid credentials', done => {
    chai
      .request(app)
      .get('/api/search?name=')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(406);
        done();
      });
  });

  it('should return error with status 406 when you entered no query', done => {
    chai
      .request(app)
      .get('/api/search')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        chai.expect(res).to.have.status(406);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('you should provide at least one query');
        done();
      });
  });
});