/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('REGISTRATION', () => {
  // CREATE USER
  it('should register user and return a response with status code 200', (done) => {
    const User = {
      firstname: 'ABC',
      lastname: 'ABC',
      email: 'abcdef@gmail.com',
      password: 'Abc123456',
    };
    chai
      .request(app)
      .post('/api/register')
      .send(User)
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        const actualVal = res.body.message;
        expect(actualVal).to.be.equal('successful signedup');
        done();
      });
  });
});
