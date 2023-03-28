/* eslint-disable linebreak-style */
/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sgMail from '@sendgrid/mail';
import app from '../../index';
import db from '../models';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { expect } = chai;
chai.use(chaiHttp);
chai.use(chaiHttp);

describe('Sample Test', () => {
  it('should return a response with status code 200', (done) => {
    chai.request(app)
      .get('/sample_test')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });

  // CREATE USER
  it('should register user and return a response with status code 200', (done) => {
    const User = {
      firstname: 'ABC',
      lastname: 'ABC',
      email: 'abc@gmail.com',
      password: 'ABC'
    };
    chai.request(app)
      .post('/register')
      .send(User)
      .end((err, res) => {
        console.log(res.body);
        chai.expect(res).to.have.status(200);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('successful signedup');
        done();
      });
  });

  // REQUEST RESET PASSWORD
  before(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await db.ResetToken.destroy({ where: {} });
  });

  it('should return status 200 and send password reset email', async () => {
    const user = await db.User.create({
      fullname: 'RUBERWA',
      email: 'ruberwa3@gmail.com',
      password: 'RUBERWA'
    });

    const res = await chai.request(app)
      .post('/requestPasswordReset')
      .send({ email: 'ruberwa3@gmail.com' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'Password reset email sent');

    const resetToken = await db.ResetToken.findOne({ where: { userId: user.id } });
    expect(resetToken).to.exist;
  });

  it('should return status 404 when user does not exist', async () => {
    const res = await chai.request(app)
      .post('/requestPasswordReset')
      .send({ email: 'nonexistentuser@gmail.com' });

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('message', 'User not found');
  });
});
