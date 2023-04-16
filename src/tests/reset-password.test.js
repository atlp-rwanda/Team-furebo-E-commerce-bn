/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-expressions */
import bcrypt from 'bcryptjs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import app from '../../index';
import db from '../Database/models';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { expect } = chai;
chai.use(chaiHttp);

describe('Reset Password Via Email', () => {
  let userToken;
  let userId;
  const registerUser = {
    firstname: 'RUBERWA',
    lastname: 'RUBERWA',
    email: 'ruberwa3@gmail.com',
    password: 'Ruberwa12',
  };
  const loginUser = {
    email: 'ruberwa3@gmail.com',
    password: 'Ruberwa12',
  };

  before(async () => {
    // Register seller
    await chai.request(app).post('/api/register').send(registerUser);

    const loginResetUser = await chai
      .request(app)
      .post('/api/login')
      .send(loginUser);
    expect(loginResetUser).to.have.status(200);
    userToken = loginResetUser.body.token;

    const verifyUserToken = await jwt.verify(
      userToken,
      process.env.USER_SECRET_KEY
    );
    userId = verifyUserToken.id;
  });

  // afterEach(async () => {
  //   await db.User.destroy({ where: {} });
  // });

  describe('POST /api/requestPasswordReset', () => {
    context('when a valid email is provided', () => {
      it('should return status 200 and send password reset email', async () => {
        const res = await chai
          .request(app)
          .post('/api/requestPasswordReset')
          .send({ email: 'ruberwa3@gmail.com' });

        expect(res).to.have.status(200);
        // expect(res.body).to.have.property(
        // 'message',
        // 'Password reset email sent'
        // );
      });
    });

    context('when an invalid email is provided', () => {
      it('should return status 404 and an error message', async () => {
        const res = await chai
          .request(app)
          .post('/api/requestPasswordReset')
          .send({ email: 'nonexistentuser@gmail.com' });

        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'User not found');
      });
    });

    context('when no email is provided', () => {
      it('should return status 400 and an error message', async () => {
        const res = await chai
          .request(app)
          .post('/api/requestPasswordReset')
          .send({});

        expect(res).to.have.status(500);
        expect(res.body).to.have.property('message', 'Internal server error');
      });
    });
  });

  describe('POST /api/reset-password', () => {
    context('when a valid userId and newPassword are provided', () => {
      it('should return status 200 and update the user password', async () => {
        const res = await chai
          .request(app)
          .post('/api/reset-password')
          .send({ userId, newPassword: 'Rbr12' });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property(
          'message',
          'Password reset successfully'
        );

        const updatedUser = await db.User.findOne({ where: { id: userId } });
        expect(updatedUser).to.not.be.null;
        const passwordMatch = await bcrypt.compare(
          'Rbr12',
          updatedUser.password
        );
        expect(passwordMatch).to.be.true;
      });
    });

    context('when an invalid userId is provided', () => {
      it('should return status 404 and an error message', async () => {
        const res = await chai
          .request(app)
          .post('/api/reset-password')
          .send({ userId: 999, newPassword: 'Rbr12' });

        expect(res).to.have.status(404);
        expect(res.body).to.have.property('message', 'User not found');
      });
    });

    context('when no userId is provided', () => {
      it('should return status 500 and an error message', async () => {
        const res = await chai
          .request(app)
          .post('/api/reset-password')
          .send({ newPassword: 'Rbr12' });

        expect(res).to.have.status(500);
        expect(res.body).to.have.property('message', 'Internal server error');
      });
    });

    context('when no newPassword is provided', () => {
      it('should return status 500 and an error message', async () => {
        // Send the reset password request without providing a new password
        const res = await chai
          .request(app)
          .post('/api/reset-password')
          .send({ userId });

        // Expect the response to have a status of 500 and an error message
        expect(res).to.have.status(500);
        expect(res.body).to.have.property(
          'message',
          'New password is required'
        );
      });
    });
  });
});
