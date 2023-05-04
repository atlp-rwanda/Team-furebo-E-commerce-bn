/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import app from '../../index';
import { Product } from '../Database/models';

chai.use(chaiHttp);
const { expect } = chai;

describe('UPDATE PRODUCT', () => {
  let existingProductId;
  let existingProduct2Id;
  let sellerToken;
  let seller2Token;
  let adminToken;
  let sellerId;
  let adminRegResToken;
  let customerTokenBeforeMechant;

  const adminData = {
    firstname: 'ZIGA',
    lastname: 'SHEILA',
    email: 'sheila@gmail.com',
    password: 'Admin1912',
  };
  const loginAdmin = {
    email: 'sheila@gmail.com',
    password: 'Admin1912',
  };
  const sellerData = {
    firstname: 'Mike',
    lastname: 'sinzi',
    email: 'sinzi@gmail.com',
    password: 'Seller1912',
  };
  const loginSeller = {
    email: 'sinzi@gmail.com',
    password: 'Seller1912',
  };
  const seller2Data = {
    firstname: 'Michael',
    lastname: 'sinzi',
    email: 'michael@gmail.com',
    password: 'Seller1912',
  };
  const login2Seller = {
    email: 'michael@gmail.com',
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
    await chai.request(app).post('/api/register').send(seller2Data);

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

    // Login as seller 2 and get token
    const seller2LoginRes = await chai
      .request(app)
      .post('/api/login')
      .send(login2Seller);
    expect(seller2LoginRes).to.have.status(200);
    seller2Token = seller2LoginRes.body.token;
    seller2Token = seller2LoginRes.body.token;

    const verifySeller2BeforeMerchant = await jwt.verify(
      seller2Token,
      process.env.USER_SECRET_KEY
    );
    const seller2Id = verifySeller2BeforeMerchant.id;

    // Update seller's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${seller2Id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });
    expect(adminRes).to.have.status(200);

    // create a new product to be added to the shopping cart
    const productRes = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'HCT/RP 36ST',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2123-05-30',
      });
    existingProductId = productRes.body.data.id;

    // create a new product to be added to the shopping cart
    const product2Res = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'HCT/RP 36ST',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2123-05-30',
      });
    existingProduct2Id = product2Res.body.data.id;
  });

  context('when updating an existing product with valid data', () => {
    it('should return status 200 and update the product in the database', done => {
      const productData = {
        name: 'PCp',

        price: 14.99,
        quantity: 5,
        category: 'Electronics',
        status: 'available',
        exDate: '2123-04-30',
      };
      chai
        .request(app)
        .patch(`/api/updateProduct/${existingProductId}`)
        .set({ Authorization: `Bearer ${sellerToken}` })
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.status).to.equal('success');
          done();
        });
    });
  });
  context('DO NOT UPDATE IF USER IS NOT AUTHOLIZED', () => {
    it('should return status 401 and update the product in the database', done => {
      const productData = {
        name: 'PCz',
        price: 14.99,
        quantity: 5,
        category: 'Electronics',
        status: 'available',
        exDate: '2123-04-30',
      };
      chai
        .request(app)
        .patch(`/api/updateProduct/${existingProductId}`)
        .set({ Authorization: `Bearer ${seller2Token}` })
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          chai.expect(res.body.status).to.equal('error');
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
        category: 'Electronics',
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
});
