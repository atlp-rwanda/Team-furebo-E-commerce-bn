import 'dotenv/config';
import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { User } from '../Database/models';
import app from '../../index';
import sendMail from '../utils/sendEmail.util';
import {
  generateSecretKey,
  generateOTPCode,
} from '../controllers/two-factor-auth.controller';

chai.use(chaiHttp);

describe('generateSecretKey', () => {
  it('should return an object with a base32 secret key', () => {
    const result = generateSecretKey();
    assert.isObject(result);
    assert.property(result, 'base32');
    assert.isString(result.base32);
  });
});

describe('generateOTPCode', () => {
  it('should return a valid OTP code', () => {
    const secretKey = speakeasy.generateSecret({
      name: 'test',
    }).base32;

    const code = generateOTPCode(secretKey);

    const isValid = speakeasy.time.verify({
      secret: secretKey,
      encoding: 'base32',
      token: code,
      step: 300,
    });

    assert.isTrue(isValid);
  });
});

let sellerToken;
let adminToken;
let sellerId;
let adminRegResToken;
let customerTokenBeforeMechant;

const adminData = {
  firstname: 'James',
  lastname: 'admin',
  email: 'james@gmail.com',
  password: 'Admin1912',
};
const sellerData = {
  firstname: 'Jana',
  lastname: 'Seller',
  email: 'mizero@gmail.com',
  password: 'Seller1912',
};
const loginAdmin = {
  email: 'james@gmail.com',
  password: 'Admin1912',
};
const loginSeller = {
  email: 'mizero@gmail.com',
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
  const adminRes = await chai.request(app).post('/api/login').send(loginAdmin);
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

describe(' 2FA for Merchant', () => {
  it('should allow merchant to enable 2FA and return 200', done => {
    chai
      .request(app)
      .post('/api/2fa/enable2faForMerchant')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should check if merchant is already has 2fa enabled and return a 409 status code', done => {
    chai
      .request(app)
      .post('/api/2fa/enable2faForMerchant')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        expect(res).to.have.status(409);
        done();
      });
  });

  it('should check if merchant account exists and return a 403 status code', done => {
    chai
      .request(app)
      .post('/api/2fa/enable2faForMerchant')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('should check if there is no token and return a 401 status code', done => {
    chai
      .request(app)
      .post('/api/2fa/enable2faForMerchant')
      .set({ Authorizationnnn: `Bearer ${sellerToken}` })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should resend OTP code and return a 200 status code', done => {
    chai
      .request(app)
      .post('/api/2fa/resendOTP')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property(
          'msg',
          'Please check your email for the new authentication code'
        );
        done();
      });
  });

  it('should return 400 status code if code is missing', done => {
    chai
      .request(app)
      .post('/api/2fa/verify')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .send({ code: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property(
          'message',
          'Please provide the code sent to you on email'
        );
        done();
      });
  });

  it('should not verify invalid code, return 403 status code', done => {
    chai
      .request(app)
      .post('/api/2fa/verify')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .send({ code: '00000' })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property(
          'message',
          'Code is wrong or expired! Please try again'
        );
        done();
      });
  });

  it('should disable 2FA for merchant and return a 200 status code', done => {
    chai
      .request(app)
      .post('/api/2fa/disable2faForMerchant')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should check if 2FA is already disable for merchant and return a 409 status code', done => {
    chai
      .request(app)
      .post('/api/2fa/disable2faForMerchant')
      .set({ Authorization: `Bearer ${sellerToken}` })
      .end((err, res) => {
        expect(res).to.have.status(409);
        done();
      });
  });
});
after(async () => {
  // Delete all the users from the Users table
  await User.destroy({ truncate: true, cascade: true });
});
describe('sendMail function', () => {
  it('should send an email and return a checker value', async () => {
    const recipient = {
      recipientEmail: 'recipient@example.com',
      emailSubject: 'Test Subject',
      emailBody: 'This is a test email',
    };
    const code = '123456';
    const checker = 0;

    const result = await sendMail(recipient, code, checker);

    expect(result).to.equal(0);
  });
});
