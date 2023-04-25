import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('DELETE /api/deleteProduct/:id', () => {
  let sellerToken;
  let adminToken;
  let sellerId;
  let customerTokenBeforeMechant;
  let productId;

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
        exDate: '2123-05-30',
      });
    productId = productRes.body.data.id;
  });
  context('when deleting an existing product with valid data', () => {
    it('should return status 200 and delete the product in the database', done => {
      chai
        .request(app)
        .delete(`/api/deleteProduct/${productId}`)
        .set({ Authorization: `Bearer ${sellerToken}` })
        .end((err, res) => {
          chai.expect(res).to.have.status(200);
          done();
        });
    });
  });
});
