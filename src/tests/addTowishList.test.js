/* eslint-disable no-unused-expressions */
import chai from 'chai';
import jwt from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import db from '../Database/models';
import app from '../../index';

chai.use(chaiHttp);

const { expect } = chai;
const { Wishlist } = db;

describe('addToWishList', () => {
  let token;
  let userId;

  before(async () => {
    // Create a new user and get their authentication token
    const user = {
      firstname: 'ABC', lastname: 'ABC', email: 'abc@gmail.com', password: 'ABC'
    };
    const res = await chai.request(app).post('/api/register').send(user);
    token = res.body.token;
    userId = jwt.verify(token, process.env.USER_SECRET_KEY).id;
  });

  it('should return 404 if the product does not exist', async () => {
    const productId = 'non-existent-id';
    const res = await chai.request(app)
      .post('/api/wishlist')
      .send({ token, productId });
    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.equal('Product not found');
  });

  it('should create a new wishlist if the user does not have one', async () => {
    const product = await db.Product.findOne();
    const productId = product.id;
    const res = await chai.request(app)
      .post('/api/wishlist')
      .send({ token, productId });
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Product added to wishlist');
    const wishlist = await Wishlist.findOne({ where: { userId } });
    expect(wishlist).to.not.be.null;
    expect(wishlist.products).to.deep.equal([productId]);
  });

  it('should remove the product from the wishlist if it is already in the wishlist', async () => {
    const product = await db.Product.findOne();
    const productId = product.id;
    const wishlist = await Wishlist.findOne({ where: { userId } });
    // eslint-disable-next-line no-unused-expressions
    expect(wishlist).to.not.be.null;
    await wishlist.update({ products: [productId] });
    const res = await chai.request(app)
      .post('/api/wishlist')
      .send({ token, productId });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Product removed from wishlist');
    const updatedWishlist = await Wishlist.findOne({ where: { userId } });
    // eslint-disable-next-line no-unused-expressions
    expect(updatedWishlist).to.not.be.null;
    expect(updatedWishlist.products).to.be.empty;
  });

  it('should add the product to the wishlist if it is not already in the wishlist', async () => {
    const product = await db.Product.findOne();
    const productId = product.id;
    const res = await chai.request(app)
      .post('/api/wishlist')
      .send({ token, productId });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Product added to wishlist');
    const wishlist = await Wishlist.findOne({ where: { userId } });
    expect(wishlist).to.not.be.null;
    expect(wishlist.products).to.deep.equal([productId]);
  });
});
