/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import app from '../../index';
import { Product } from '../Database/models';

chai.use(chaiHttp);
const { expect } = chai;

describe('PATCH /api/updateProduct/:id', () => {
  let existingProductId;
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
    await chai.request(app).post('/api/register').send(sellerData);

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

  before(async () => {
    const productData = {
      name: 'Laptop',
      image:
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
      price: 2000.99,
      quantity: 10,
      type: 'HP',
      exDate: '2023-04-30',
    };
    const product = await Product.create(productData);
    existingProductId = product.id;
  });

  context('when updating an existing product with valid data', () => {
    it('should return status 200 and update the product in the database', done => {
      const productData = {
        name: 'PC',
        price: 14.99,
        quantity: 5,
        type: 'Levovo',
      };
      chai
        .request(app)
        .patch(`/api/updateProduct/${existingProductId}`)
        .set({ Authorization: `Bearer ${sellerToken}` })
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
    it('should return status 404 and an error message', done => {
      const productData = {
        name: 'Laptop',
        price: 2000.99,
        quantity: 10,
        type: 'non-existing',
      };
      chai
        .request(app)
        .patch('/api/updateProduct/9999')
        .set({ Authorization: `Bearer ${sellerToken}` })
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
    it('should return a 500 error with an error message', done => {
      // Mock the behavior of the Product.findByPk method to return a product
      const product = {
        id: existingProductId,
        name: 'Laptop',
        image:
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        price: 2000.99,
        quantity: 10,
        type: 'HP',
        exDate: '2023-04-30',
        update: sinon.stub().throws(new Error('Failed to update product')),
      };
      const findByPkStub = sinon.stub(Product, 'findByPk').resolves(product);
      const productData = {
        name: 'Updated Product',
        image: 'https://example.com/new-image.jpg',
        price: 19.99,
        quantity: 5,
        type: 'new type',
        exDate: '2024-04-30',
      };
      chai
        .request(app)
        .patch(`/api/updateProduct/${existingProductId}`)
        .set({ Authorization: `Bearer ${sellerToken}` })
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(500);
          chai.expect(res.body.status).to.equal('error');
          chai.expect(res.body.message).to.equal('Failed to update product');
          chai.expect(res.body.data).to.be.an('object');
          // Restore the original behavior of the Product.findByPk method
          findByPkStub.restore();
          done();
        });
    });
  });
});
