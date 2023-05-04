/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

import { Product } from '../Database/models';

const { expect } = chai;
chai.use(chaiHttp);

describe('SHOPPING CART TEST', () => {
  let EXISTING_PRODUCT_ID;
  let UNVAILABLE_PRODUCT_ID;
  let NO_EXISTING_PRODUCT_ID;
  let BUYER_TOKEN;

  const sellerData = {
    firstname: 'KALISA',
    lastname: 'MUSONI',
    email: 'albert@gmail.com',
    password: 'Seller1912',
  };
  const loginSeller = {
    email: 'albert@gmail.com',
    password: 'Seller1912',
  };

  before(async () => {
    // Register seller
    const sellerRes = await chai
      .request(app)
      .post('/api/register')
      .send(sellerData);

    // Login as seller and get token
    const sellerLoginRes = await chai
      .request(app)
      .post('/api/login')
      .send(loginSeller);
    expect(sellerLoginRes).to.have.status(200);
    BUYER_TOKEN = sellerLoginRes.body.token;
  });

  before(async () => {
    const productData = {
      name: 'Laptop',
      image: [
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
      ],
      price: 2000.99,
      quantity: 10,
      status: 'available',
      type: 'HP',
      category: 'Electronics',
      exDate: '2023-05-30',
    };
    const product = await Product.create(productData);
    EXISTING_PRODUCT_ID = product.id;

    const noAvailableProduct = {
      name: 'Unvailable Laptop',
      image: [
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
        'https://th.bing.com/th/id/OIP.X7aw6FD9rHltxaZXCkuG2wHaFw?pid=ImgDet&rs=1',
      ],
      price: 2000.99,
      quantity: 10,
      status: 'unavailable',
      type: 'HP',
      category: 'Electronics',
      exDate: '2023-05-30',
    };
    const unvailableProduct = await Product.create(noAvailableProduct);
    UNVAILABLE_PRODUCT_ID = unvailableProduct.id;
  });
  context('WHEN VALID PRODUCT ID AND QUANTITY ARE GIVEN ', () => {
    it('should add item to the shopping cart and return status 201', (done) => {
      const itemData = {
        productId: EXISTING_PRODUCT_ID,
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal(
            'YES!, ITEM ADD TO THE CART SUCCESSFULLY!!!'
          );
          done();
        });
    });
  });

  context('WHEN PRODUCT WITH THAT ID, ID NOT IN DATABASE', () => {
    it('should return status 404 and an error message', async () => {
      // make request to add item to cart
      const res = await chai
        .request(app)
        .post('/api/addItemToCart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send({ productId: 99, quantity: 1 });

      // assert response
      expect(res).to.have.status(400);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal(
        'THE PRODUCT WITH THAT ID, IS NOT AVAILABLE'
      );
    });
  });

  context('WHEN TOKEN IS NOT VALID', () => {
    it('should return status 401 and an error message', (done) => {
      const itemData = {
        productId: EXISTING_PRODUCT_ID,
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
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
    it('should return status 401 and an error message', (done) => {
      const itemData = {
        productId: EXISTING_PRODUCT_ID,
        quantity: 2,
      };
      chai
        .request(app)
        .post('/api/addItemToCart')
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal('Authorization header missing');
          done();
        });
    });
  });

  context('WHEN PRODUCT IS UNAVAILABLE', () => {
    it('should return status 400 and an error message', (done) => {
      const itemData = {
        productId: UNVAILABLE_PRODUCT_ID,
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(400);
          const actualVal = res.body.message;
          expect(actualVal).to.be.equal(
            'THIS PRODUCT IS EITHER NOT IN STOCK OR EXPIRED'
          );
          done();
        });
    });
  });

  context('WHEN QUANTITY GIVEN IS NOT A NUMBER', () => {
    it('should return status 400 and an error message', (done) => {
      const itemData = {
        productId: EXISTING_PRODUCT_ID,
        quantity: 'two',
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
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
    it('should return status 400 and an error message', (done) => {
      const itemData = {
        productId: EXISTING_PRODUCT_ID,
        quantity: -2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
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
    it('should return status 400 and an error message', (done) => {
      const itemData = {
        productId: EXISTING_PRODUCT_ID,
        quantity: 98765,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
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
  context('WHEN FAILED TO ADD ITEM TO THE CART', () => {
    it('should return status 500 and an error message', (done) => {
      const itemData = {
        productId: NO_EXISTING_PRODUCT_ID,
        quantity: 2,
      };

      chai
        .request(app)
        .post('/api/addItemToCart')
        .set({ Authorization: `Bearer ${BUYER_TOKEN}` })
        .send(itemData)
        .end((err, res) => {
          chai.expect(res).to.have.status(500);
          done();
        });
    });
  });
});
