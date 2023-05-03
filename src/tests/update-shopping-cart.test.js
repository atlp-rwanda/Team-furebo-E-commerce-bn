/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('UPDATING SHOPPING CART TEST', () => {
  let sellerToken;
  let adminToken;
  let sellerId;
  let adminRegResToken;
  let customerTokenBeforeMechant;
  let productId;
  const NO_EXISTING_PRODUCT_ID = 98745;
  let BUYER_TOKEN;
  let CART_ITEM_ID;

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
    const adminRegRes = await chai
      .request(app)
      .post('/api/registerAdmin')
      .send(adminData);
    adminRegResToken = adminRegRes.body.token;

    const adminRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginAdmin);
    expect(adminRes).to.have.status(200);
    adminToken = adminRes.body.token;

    // ========= SELLER ACCOUNT
    const sellerRes = await chai
      .request(app)
      .post('/api/register')
      .send(sellerData);

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
    const { token } = buyerLoginRes.body;
    BUYER_TOKEN = token;

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
        name: 'HCT/RP 360ST',
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

    const addItemInCart = await chai
      .request(app)
      .post('/api/addItemToCart')
      .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
      .send({
        productId,
        quantity: 2,
      });

    CART_ITEM_ID =
      addItemInCart.body.data['CURRENT CART DETAILS']['ADDED PRODUCT DETAILS ']
        .ID;
  });
  context('IT SHOULD UPATE ITEM IN SHOPPING CART ', () => {
    it('should add item to the shopping cart and return status 200', async () => {
      // make request to add item to cart
      const res = await chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send({ quantity: 3 });

      // assert response
      expect(res).to.have.status(200);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal(
        'THE ITEM IN THE CART WAS UPDATED SUCCESSFULLY!!!'
      );
    });
  });
  context('WHEN PRODUCT WITH THAT ID, ID NOT IN PRODUCT', () => {
    it('should return status 404 and an error message', async () => {
      // make request to add item to cart
      const res = await chai
        .request(app)
        .patch(`/api/updateShoppingCart/${NO_EXISTING_PRODUCT_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send({ quantity: 1 });

      // assert response
      expect(res).to.have.status(404);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal('THE PRODUCT IS NOT IN THE CART');
    });
  });

  context('WHEN TOKEN IS NOT VALID', () => {
    it('should return status 401 and an error message', done => {
      const itemData = {
        quantity: 2,
      };

      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: 'Bearer invalid_token' })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Invalid token');
          done();
        });
    });
  });
  context('WHEN NO TOKEN IS GIVEN', () => {
    it('should return status 401 and an error message', done => {
      const itemData = {
        quantity: 2,
      };
      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Authorization header missing');
          done();
        });
    });
  });

  context('WHEN QUANTITY GIVEN IS NOT A NUMBER', () => {
    it('should return status 400 and an error message', done => {
      const itemData = {
        quantity: 'two',
      };

      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal(
            'QUANTITY HAS TO BE A VALID POSITIVE NUMBER(s) [1-9]'
          );
          done();
        });
    });
  });
  context('WHEN QUANTITY GIVEN HAS A NEGATIVE NUMBER', () => {
    it('should return status 400 and an error message', done => {
      const itemData = {
        quantity: -2,
      };

      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal(
            'PLEASE ENTER POSITIVE NUMBER(s), LIKE [1-9]'
          );
          done();
        });
    });
  });

  context('WHEN QUANTITY GIVEN IS GREATER THAN STOCK', () => {
    it('should return status 400 and an error message', done => {
      const itemData = {
        quantity: 98765,
      };

      chai
        .request(app)
        .patch(`/api/updateShoppingCart/${CART_ITEM_ID}`)
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('THE STOCK HAS LESS QUANTITY');
          done();
        });
    });
  });
});