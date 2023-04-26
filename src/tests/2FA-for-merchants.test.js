import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import delay from 'delay';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import app from '../../index';
import sendMail from '../utils/sendEmail.util';
import { generateSecretKey, generateOTPCode } from '../controllers/two-factor-auth.controller';

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
      name: 'test'
    }).base32;

    const code = generateOTPCode(secretKey);

    const isValid = speakeasy.time.verify({
      secret: secretKey,
      encoding: 'base32',
      token: code,
      step: 300
    });

    assert.isTrue(isValid);
  });
});
describe(' 2FA for Merchant', () => {
  it('should allow merchant to enable 2FA and return 200', (done) => {
    const newMerchant = {
      firstname: 'baho',
      lastname: 'kelly',
      email: 'bahokelly02@gmail.com',
      password: 'Abc123456',
    };
    const merchant = {
      email: 'bahokelly02@gmail.com',
      password: 'Abc123456',
    };

    const admin = {
      email: 'admin@gmail.com',
      password: 'Test123456',
    };
    chai
      .request(app)
      .post('/api/register')
      .send(newMerchant)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('successful signedup');
        chai
          .request(app)
          .post('/api/login')
          .send(merchant)
          .end((err, res) => {
            chai.expect(res).to.have.status(200);
            const tokenn = res.header.authenticate;
            const decoded = jwt.verify(tokenn, process.env.USER_SECRET_KEY);
            chai
              .request(app)
              .post('/api/login')
              .send(admin)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                const token = res.header.authenticate;
                chai
                  .request(app)
                  .patch(`/api/updateRole/${decoded.id}`)
                  .set({ Authorization: `Bearer ${token}` })
                  .send({ role: 'merchant' })
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    chai
                      .request(app)
                      .post('/api/2fa/enable2faForMerchant')
                      .set({ Authorization: `Bearer ${tokenn}` })
                      .end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                      });
                  });
              });
          });
      });
  });
  it('should check if merchant is already has 2fa enabled and return a 409 status code', (done) => {
    const merchant = {
      email: 'bahokelly02@gmail.com',
      password: 'Abc123456',
    };
    chai
      .request(app)
      .post('/api/login')
      .send(merchant)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        const token = res.header.authenticate;
        chai
          .request(app)
          .post('/api/2fa/enable2faForMerchant')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.status(409);
            done();
          });
      });
  });
  it('should check if merchant account exists and return a 403 status code', (done) => {
    const admin = {
      email: 'admin@gmail.com',
      password: 'Test123456',
    };
    chai
      .request(app)
      .post('/api/login')
      .send(admin)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        const token = res.header.authenticate;
        chai
          .request(app)
          .post('/api/2fa/enable2faForMerchant')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.status(403);
            done();
          });
      });
  });
  it('should check if there is no token and return a 401 status code', (done) => {
    const admin = {
      email: 'admin@gmail.com',
      password: 'Test123456',
    };
    chai
      .request(app)
      .post('/api/login')
      .send(admin)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        const token = res.header.authenticate;
        chai
          .request(app)
          .post('/api/2fa/enable2faForMerchant')
          .set({ Authorizationnnn: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.status(401);
            done();
          });
      });
  });
  it('should resend OTP code and return a 200 status code', (done) => {
    const merchant = {
      email: 'bahokelly02@gmail.com',
      password: 'Abc123456',
    };
    chai
      .request(app)
      .post('/api/login')
      .send(merchant)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('msg', 'Please check your email for the authentication code');
        done();
      });
  });
  it('should resend OTP code and return a 200 status code', (done) => {
    const merchant = {
      email: 'bahokelly02@gmail.com',
      password: 'Abc123456',
    };
    chai
      .request(app)
      .post('/api/login')
      .send(merchant)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        const token = res.header.authenticate;
        chai
          .request(app)
          .post('/api/2fa/resendOTP')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('msg', 'Please check your email for the new authentication code');
            done();
          });
      });
  });
  it('should disable 2FA for merchant and return a 200 status code', (done) => {
    const merchant = {
      email: 'bahokelly02@gmail.com',
      password: 'Abc123456',
    };
    chai
      .request(app)
      .post('/api/login')
      .send(merchant)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        const token = res.header.authenticate;
        chai
          .request(app)
          .post('/api/2fa/disable2faForMerchant')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });
  });
  it('should check if 2FA is already disable for merchant and return a 409 status code', (done) => {
    const merchant = {
      email: 'bahokelly02@gmail.com',
      password: 'Abc123456',
    };
    chai
      .request(app)
      .post('/api/login')
      .send(merchant)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        const token = res.header.authenticate;
        chai
          .request(app)
          .post('/api/2fa/disable2faForMerchant')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.status(409);
            done();
          });
      });
  });
  it('should return 400 status code if code is missing', (done) => {
    const merchant = {
      email: 'bahokelly02@gmail.com',
      password: 'Abc123456',
    };
    chai
      .request(app)
      .post('/api/login')
      .send(merchant)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        const token = res.header.authenticate;
        chai
          .request(app)
          .post('/api/2fa/verify')
          .set({ Authorization: `Bearer ${token}` })
          .send({code:''})
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message', 'Please provide the code sent to you on email');
            done();
          });
      });
  });
  it('should not verify invalid code, return 403 status code', (done) => {
    const merchant = {
      email: 'bahokelly02@gmail.com',
      password: 'Abc123456',
    };
    chai
      .request(app)
      .post('/api/login')
      .send(merchant)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        const token = res.header.authenticate;
        chai
          .request(app)
          .post('/api/2fa/verify')
          .set({ Authorization: `Bearer ${token}` })
          .send({code:'00000'})
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('message', 'Code is wrong or expired! Please try again');
            done();
          });
      });
  });
});

describe('sendMail function', () => {
  it('should send an email and return a checker value', async () => {
    const recipient = {
      recipientEmail: 'recipient@example.com',
      emailSubject: 'Test Subject',
      emailBody: 'This is a test email'
    };
    const code = '123456';
    const checker = 0;

    const result = await sendMail(recipient, code, checker);

    expect(result).to.equal(0);
  });
});
