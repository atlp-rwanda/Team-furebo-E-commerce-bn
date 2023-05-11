import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('ADD PRODUCT FEEDBACK /api/addProductFeedback/:id', () => {
  let sellerToken;
  let adminToken;
  let sellerId;
  let customerTokenBeforeMechant;
  let productId;
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
  // FEEDBACK DATA
  const feedback = {
    rating: 5,
    review: 'Very satisfied with the product. I recommend it',
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

    // create a new product to be added to the shopping cart
    const productRes = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'mugabooooo',
        image: [
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
          'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        ],
        price: 2500,
        quantity: 12,
        category: 'GAMMING PC',
        exDate: '2023-05-30',
      });
    productId = productRes.body.data.id;
  });
  context('when adding a valid review to a product', () => {
    it('should return status 201 and add the review and rating to the database', async () => {
      const res = await chai
        .request(app)
        .post(`/api/addProductFeedback/${productId}`)
        .send(feedback)
        .set({ Authorization: `Bearer ${buyerToken}` });
      chai.expect(res).to.have.status(201);
    });
  });

  context('when certain required credentails are missing ', () => {
    it('should return status 400 and send a message requiring the user to fill the missing fields', async () => {
      const res = await chai
        .request(app)
        .post(`/api/addProductFeedback/${productId}`)
        .send({
          review: 'great product',
        })
        .set({ Authorization: `Bearer ${buyerToken}` });
      chai.expect(res).to.have.status(400);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal('Rating is required.');
    });
  });
  context('when rating value is not between 1 and 5', () => {
    it('should return status 400 and send a message requiring the user to use the right range for rating', async () => {
      const res = await chai
        .request(app)
        .post(`/api/addProductFeedback/${productId}`)
        .send({
          rating: 6,
          review: 'Great product',
        })
        .set({ Authorization: `Bearer ${buyerToken}` });
      chai.expect(res).to.have.status(400);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal('the rating must be between 1 and 5');
    });
  });
  context('when the productId is invalid', () => {
    it('should return status 400 and send a message requiring the user to use a correct productId', async () => {
      const res = await chai
        .request(app)
        .post('/api/addProductFeedback/1000')
        .send({
          rating: 4,
          review: 'Great product',
        })
        .set({ Authorization: `Bearer ${buyerToken}` });
      expect(res).to.have.status(404);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal('product not found');
    });
  });
  context('when a server error occurs', () => {
    it('should return status 500 and send a message detailing the error', async () => {
      const res = await chai
        .request(app)
        .post('/api/addProductFeedback/id')
        .send({
          rating: 4,
          review: 'Great product',
        })
        .set({ Authorization: `Bearer ${buyerToken}` });
      chai.expect(res).to.have.status(500);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal('Internal server error');
    });
  });
});
