/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe(' MARK PRODUCT AVAILABILITY', () => {
  let SELLER_TOKEN;
  let SELLER2_TOKEN;

  let sellerRegResToken;
  let sellerRegResVerifyToken;
  let sellerId;
  let seller2RegResToken;
  let seller2RegResVerifyToken;
  let seller2Id;

  let adminRegResToken;
  let adminRegResVerifyToken;
  let adminId;
  let adminToken;

  let existingProductId;
  let existingProduct2Id;

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
  const loginSellerData = {
    email: 'sinzi@gmail.com',
    password: 'Seller1912',
  };
  const seller2Data = {
    firstname: 'Michael',
    lastname: 'sinzi',
    email: 'michael@gmail.com',
    password: 'Seller1912',
  };
  const loginSeller2Data = {
    email: 'michael@gmail.com',
    password: 'Seller1912',
  };

  before(async () => {
    // ========= SELLER 1 ACCOUNT
    const sellerAccount = await chai.request(app).post('/api/register').send(sellerData);

    sellerRegResToken = sellerAccount.body.token;
    sellerRegResVerifyToken = sellerAccount.body.verifyToken;

    const verifySerllerToken = await jwt.verify(
      sellerRegResToken,
      process.env.USER_SECRET_KEY
    );
    sellerId = verifySerllerToken.id;

    // verify email for seller
    await chai
      .request(app)
      .get(`/api/${sellerId}/verify/${sellerRegResVerifyToken.token}`);

    // ========= SELLER 2 ACCOUNT
    const seller2Account = await chai.request(app).post('/api/register').send(seller2Data);

    seller2RegResToken = seller2Account.body.token;
    seller2RegResVerifyToken = seller2Account.body.verifyToken;

    const verifySerller2Token = await jwt.verify(
      seller2RegResToken,
      process.env.USER_SECRET_KEY
    );
    seller2Id = verifySerller2Token.id;

    // verify email for seller
    await chai
      .request(app)
      .get(`/api/${seller2Id}/verify/${seller2RegResVerifyToken.token}`);

    // ===== ADMIN ACCOUNT
    const adminRegRes = await chai.request(app).post('/api/registerAdmin').send(adminData);

    adminRegResToken = adminRegRes.body.token;
    adminRegResVerifyToken = adminRegRes.body.verifyToken;

    const verifyAdminToken = await jwt.verify(
      adminRegResToken,
      process.env.USER_SECRET_KEY
    );
    adminId = verifyAdminToken.id;

    // verify email for admin
    await chai
      .request(app)
      .get(`/api/${adminId}/verify/${adminRegResVerifyToken.token}`);

    // ADMIN
    const adminLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminLogin).to.have.status(200);
    adminToken = adminLogin.body.token;

    /// SELLER
    const sellerLogin = await chai
      .request(app)
      .post('/api/login')
      .send(loginSellerData);
    expect(sellerLogin).to.have.status(200);
    SELLER_TOKEN = sellerLogin.body.token;

    const verifyMerchant = await jwt.verify(
      SELLER_TOKEN,
      process.env.USER_SECRET_KEY
    );
    const merchantId = verifyMerchant.id;
    // Update seller's role
    await chai
      .request(app)
      .patch(`/api/updateRole/${merchantId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' });

    /// SELLER 2
    const seller2Login = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller2Data);
    expect(seller2Login).to.have.status(200);
    SELLER2_TOKEN = seller2Login.body.token;

    const verifyMerchant2 = await jwt.verify(
      SELLER2_TOKEN,
      process.env.USER_SECRET_KEY
    );

    // create a new product to be added to the shopping cart
    const productRes = await chai
      .request(app)
      .post('/api/addProduct')
      .set('Authorization', `Bearer ${SELLER_TOKEN}`)
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
      .set('Authorization', `Bearer ${SELLER_TOKEN}`)
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

  context(' SET PRODUCT AVAILABILITY WITH VALID DATA', () => {
    it('should return status 200 and set product availability', (done) => {
      const productData = {
        quantity: 5,
        exDate: '2020-04-30',
      };
      chai
        .request(app)
        .patch(`/api/mark-product-availability/${existingProductId}`)
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
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
        .set({ Authorization: `Bearer ${SELLER2_TOKEN}` })
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
        .set({ Authorization: `Bearer ${SELLER_TOKEN}` })
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
