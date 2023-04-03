import chai from 'chai';
import chaiHttp from 'chai-http';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import jwt from 'jsonwebtoken';
import app from '../../index';
import 'dotenv/config';

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

describe('DISABLE ACCOUNT', async () => {
  let adminToken;
  // eslint-disable-next-line no-unused-vars
  let adminRegResToken;
  let adminId;
  const loginAdmin = {
    email: 'admin19@gmail.com',
    password: 'Admin1912'
  };

  const adminData = {
    firstname: 'James',
    lastname: 'admin',
    email: 'admin19@gmail.com',
    password: 'Admin1912',
  };
  before(async () => {
    // Register admin
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
    console.log(`Login token ${adminToken}`);
    const verifyAdminToken = await jwt.verify(adminToken, process.env.USER_SECRET_KEY);
    adminId = verifyAdminToken.id;
  });
  it('Should disable an account', (done) => {
    chai
      .request(app)
      .patch(`/api/disableAccount/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'merchant' })
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
      });
  });
});
