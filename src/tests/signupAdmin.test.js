import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);

describe('ADMIN REGISTRATION', () => {
  // CREATE USER
  it('should register user and return a response with status code 200', (done) => {
    const User = {
      firstname: 'admin',
      lastname: 'acc',
      email: 'admin@gmail.com',
      password: 'Test123456',
    };
    chai
      .request(app)
      .post('/api/registerAdmin')
      .send(User)
      .end((err, res) => {
        if (err) {
          chai.expect(res).to.have.status(500);
          done();
        } else {
          chai.expect(res).to.have.status(200);
          done();
        }
      });
  });
  it('should not create a user account with weak password', (done) => {
    const User = {
      firstname: 'admin',
      lastname: 'acc',
      email: 'admin2@gmail.com',
      password: 'test123',
    };
    chai
      .request(app)
      .post('/api/registerAdmin')
      .send(User)
      .end((err, res) => {
        chai.expect(res).to.have.status(406);
        done();
      });
  });
  it('should not create a user account with an already existing email', (done) => {
    const User = {
      firstname: 'admin',
      lastname: 'acc',
      email: 'admin@gmail.com',
      password: 'Test123456',
    };
    chai
      .request(app)
      .post('/api/registerAdmin')
      .send(User)
      .end((err, res) => {
        chai.expect(res).to.have.status(401);
        done();
      });
  });
});
