/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';
import { sequelize } from '../Database/models';

chai.use(chaiHttp);
const { expect } = chai;

describe(' MARK PRODUCT AVAILABILITY', () => {
  let existingProductId;
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
  });

  // after(async () => {
  //   await sequelize.sync({ force: true });
  // });

  context(' SET PRODUCT AVAILABILITY WITH VALID DATA', () => {
    it('should return status 200 and set product availability', (done) => {
      const productData = {
        quantity: 5,
        exDate: '2020-04-30',
      };
      chai
        .request(app)
        .patch(`/api/mark-product-availability/${existingProductId}`)
        .set({ Authorization: `Bearer ${sellerToken}` })
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          chai.expect(res.body.status).to.equal('success');
          done();
        });
    });
  });
  context(' SET PRODUCT AVAILABILITY WITH INVALID USER', () => {
    it('should return status 403 and an error message', (done) => {
      const productData = {
        quantity: 5,
        exDate: '2020-04-30',
      };
      chai
        .request(app)
        .patch(`/api/mark-product-availability/${existingProductId}`)
        .set({ Authorization: `Bearer ${seller2Token}` })
        .send(productData)
        .end((err, res) => {
          chai.expect(res).to.have.status(403);
          done();
        });
    });
  });

  context('SET PRODUCT AVAILABILITY WITH NO-EXISTING PRODUCT', () => {
    it('should return status 404 and an error message', (done) => {
      const productData = {
        quantity: 5,
        exDate: '2020-04-30',
      };
      chai
        .request(app)
        .patch('/api/mark-product-availability/9999')
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
