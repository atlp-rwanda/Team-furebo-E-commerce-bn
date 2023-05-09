/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('VIEW SPECIFIC PRODUCT /api/getProduct/:id', () => {
  let sellerToken;
  let sellerToken2;
  let adminToken;
  let sellerId;
  let sellerId2;
  let customerTokenBeforeMechant;
  let customerTokenBeforeMechant2;
  let productId;
  let productId2;
  let productId3;
  let buyerToken;

  // ADMING INFO
  const adminData = {
    firstname: 'Peter',
    lastname: 'adams',
    email: 'adams@gmail.com',
    password: 'Adams1912',
  };
  const loginAdmin = {
    email: 'adams@gmail.com',
    password: 'Adams1912',
  };
  // SELLER INFO
  const sellerData = {
    firstname: 'State',
    lastname: 'Price',
    email: 'state19@gmail.com',
    password: 'State1912',
  };
  const loginSeller = {
    email: 'state19@gmail.com',
    password: 'State1912',
  };
  // SECOND SELLER INFO
  const sellerData2 = {
    firstname: 'State',
    lastname: 'Price',
    email: 'clarisse@gmail.com',
    password: 'State1912',
  };
  const loginSeller2 = {
    email: 'clarisse@gmail.com',
    password: 'State1912',
  };
  // BUYER INFO
  const buyerData = {
    firstname: 'MUGABO',
    lastname: 'James',
    email: 'mugabo@gmail.com',
    password: 'Mugabo1234',
  };
  const buyerLogin = {
    email: 'mugabo@gmail.com',
    password: 'Mugabo1234',
  };

  before(async () => {
    // ========= ADMIN ACCOUNT
    await chai.request(app).post('/api/registerAdmin').send(adminData);
    // let adminRegResToken = adminRegRes.body.token;

    const adminRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminRes).to.have.status(200);
    adminToken = adminRes.body.token;

    // ========= SELLER ACCOUNT
    await chai.request(app).post('/api/register').send(sellerData);

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

    // ========= SECOND SELLER ACCOUNT
    await chai.request(app).post('/api/register').send(sellerData2);

    const customerTokenBeforeMechantRes2 = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller2);
    expect(customerTokenBeforeMechantRes2).to.have.status(200);
    customerTokenBeforeMechant2 = customerTokenBeforeMechantRes2.body.token;

    const verifyCustomerBeforeMerchant2 = await jwt.verify(
      customerTokenBeforeMechant2,
      process.env.USER_SECRET_KEY
    );
    sellerId2 = verifyCustomerBeforeMerchant2.id;

    // ========= BUYER ACCOUNT
    await chai.request(app).post('/api/register').send(buyerData);

    const buyerLoginRes = await chai
      .request(app)
      .post('/api/login')
      .send(buyerLogin);
    expect(buyerLoginRes).to.have.status(200);
    buyerToken = buyerLoginRes.body.token;

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

    // Update seller's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${sellerId2}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });
    expect(adminRes).to.have.status(200);

    // Login as seller2 and get token
    const sellerLoginRes2 = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller2);
    expect(sellerLoginRes2).to.have.status(200);
    sellerToken2 = sellerLoginRes2.body.token;

    // create two new products with different sellers
    const productRes = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'mugaboooo',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2023-07-30',
      });
    productId = productRes.body.data.id;

    const productRes2 = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${sellerToken2}`)
      .send({
        name: 'playstation',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2023-07-30',
      });
    productId2 = productRes2.body.data.id;

    const productRes3 = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${sellerToken2}`)
      .send({
        name: 'nitendo',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2023-07-30',
      });
    productId3 = productRes3.body.data.id;
  });
  //= === START TESTS
  context('when a buyer requests a product that is available', () => {
    it('should return status 200', (done) => {
      chai
        .request(app)
        .get(`/api/getProduct/${productId}`)
        .set({ Authorization: `Bearer ${buyerToken}` })
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });

  context(
    'when a seller requests a product that is available in their collecion',
    () => {
      it('should return status 200 and the details of the product', (done) => {
        chai
          .request(app)
          .get(`/api/getProduct/${productId}`)
          .set({ Authorization: `Bearer ${sellerToken}` })
          .end((err, res) => {
            chai.expect(res).to.have.status(200);
            done();
          });
      });
    }
  );

  context('when the productId is invalid', () => {
    it('should return status 404', (done) => {
      chai
        .request(app)
        .get('/api/getProduct/1000')
        .set({ Authorization: `Bearer ${buyerToken}` })
        .end((err, res) => {
          chai.expect(res).to.have.status(404);
          done();
        });
    });
  });
});
