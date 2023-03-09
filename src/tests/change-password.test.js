import 'dotenv/config';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
// import { sequelize } from '../Database/models';
import { verifyToken } from '../utils/user.util';

const { expect } = chai;
chai.use(chaiHttp);

describe('CHANGE USER PASSWORD', async () => {
  let USER_ONE_TOKEN;
  let USER_TWO_TOKEN;
  let USER_THREE_TOKEN;
  let USER_ONE_ID;
  let USER_TWO_ID;
  let USER_THREE_ID;
  const NONE_ACCOUNT_USER_ID = 9876;

  // USER ONE
  const userOneData = {
    firstname: 'KABELA',
    lastname: 'Dom',
    email: 'kabera@gmail.com',
    password: 'Kabera1912',
  };
  const userOneLoginData = {
    email: 'kabera@gmail.com',
    password: 'Kabera1912',
  };
  // USER TWO
  const userTwoData = {
    firstname: 'MUGABO',
    lastname: 'James',
    email: 'mugabo@gmail.com',
    password: 'Mugabo1234',
  };
  const userTwoLoginData = {
    email: 'mugabo@gmail.com',
    password: 'Mugabo1234',
  };
  // USER THREE
  const userThreeData = {
    firstname: 'BRUCE',
    lastname: 'James',
    email: 'bruce1@gmail.com',
    password: 'Bruce12345',
  };
  const userThreeLoginData = {
    email: 'bruce1@gmail.com',
    password: 'Bruce12345',
  };

  beforeEach(async () => {
    // ========= USER ONE
    await chai.request(app).post('/api/register').send(userOneData);

    // ========= USER TWO
    await chai.request(app).post('/api/register').send(userTwoData);

    // ========= USER THREE
    await chai.request(app).post('/api/register').send(userThreeData);

    const userOneLogin = await chai
      .request(app)
      .post('/api/login')
      .send(userOneLoginData);
    expect(userOneLogin).to.have.status(200);
    USER_ONE_TOKEN = userOneLogin.body.token;
    const user1DecodToken = await verifyToken(
      USER_ONE_TOKEN,
      process.env.USER_SECRET_KEY
    );
    USER_ONE_ID = user1DecodToken.id;

    const userTwoLogin = await chai
      .request(app)
      .post('/api/login')
      .send(userTwoLoginData);
    expect(userTwoLogin).to.have.status(200);
    USER_TWO_TOKEN = userTwoLogin.body.token;
    const user2DecodToken = await verifyToken(
      USER_TWO_TOKEN,
      process.env.USER_SECRET_KEY
    );
    USER_TWO_ID = user2DecodToken.id;

    const userThreeLogin = await chai
      .request(app)
      .post('/api/login')
      .send(userThreeLoginData);
    expect(userThreeLogin).to.have.status(200);
    USER_THREE_TOKEN = userThreeLogin.body.token;
    const user3DecodToken = await verifyToken(
      USER_THREE_TOKEN,
      process.env.USER_SECRET_KEY
    );
    USER_THREE_ID = user3DecodToken.id;
  });
  // after(async () => {
  //   await sequelize.sync({ force: true });
  // });

  context('WHEN USER TRIED TO CHANGE SOMEONE ELSE PASSWORD', () => {
    it('should return a 403 error response with "Unauthorized" message when a user attempts to change another user\'s password', async () => {
      const passwordData = {
        currentPassword: 'Bruce12345',
        newPassword: 'Bruce123456',
      };
      const res = await chai
        .request(app)
        .patch(`/api/modify-password/${USER_THREE_ID}`)
        .set({ Authorization: `Bearer ${USER_TWO_TOKEN}` })
        .send(passwordData);
      expect(res.status).to.equal(403);
      const actualVal = res.body.message;
      expect(actualVal).to.be.equal('Unautholized');
    });
  });
  context('WHEN GIVEN NEW PASSWORD IS SAME AS CURRENT PASSWORD', () => {
    it('should return 400 status and error message ', async () => {
      const passwordData = {
        currentPassword: 'Mugabo1234',
        newPassword: 'Mugabo1234',
      };
      const res = await chai
        .request(app)
        .patch(`/api/modify-password/${USER_TWO_ID}`)
        .set({ Authorization: `Bearer ${USER_TWO_TOKEN}` })
        .send(passwordData);
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        'New Password can not be same as old Password'
      );
    });
  });

  context('WHEN GIVEN CURRENT PASSWORD IS INCORRECT', () => {
    it('should return 401 status and error message ', async () => {
      const passwordData = {
        currentPassword: 'Mugabo123499',
        newPassword: 'Mugabo123400',
      };
      const res = await chai
        .request(app)
        .patch(`/api/modify-password/${USER_TWO_ID}`)
        .set({ Authorization: `Bearer ${USER_TWO_TOKEN}` })
        .send(passwordData);
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Current Password is incorrect');
    });
  });
  context('WHEN USER IS NOT LOGGED IN', () => {
    it('should return 401 status and error message ', async () => {
      const passwordData = {
        currentPassword: 'Kabera1912',
        newPassword: 'Kabera19123',
      };
      const res = await chai
        .request(app)
        .patch(`/api/modify-password/${USER_ONE_ID}`)
        .send(passwordData);
      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal('Authorization header missing');
    });
  });
  context('WHEN USER HAS NO ACCOUNT', () => {
    it('should return 404 status and error message ', async () => {
      const passwordData = {
        currentPassword: 'Kabera1912',
        newPassword: 'Kabera19123',
      };
      const res = await chai
        .request(app)
        .patch(`/api/modify-password/${NONE_ACCOUNT_USER_ID}`)
        .set({ Authorization: `Bearer ${USER_ONE_TOKEN}` })
        .send(passwordData);
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('User not found');
    });
  });

  context(
    'WHEN ALL GIVEN DATA(Token, User Id and Current Password) ARE CORRECT',
    () => {
      it('should change password and return status 200 ', async () => {
        const passwordData = {
          currentPassword: 'Kabera1912',
          newPassword: 'Kabera19123',
        };
        const res = await chai
          .request(app)
          .patch(`/api/modify-password/${USER_ONE_ID}`)
          .set({ Authorization: `Bearer ${USER_ONE_TOKEN}` })
          .send(passwordData);
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Password changed successfully');
      });
    }
  );
});
