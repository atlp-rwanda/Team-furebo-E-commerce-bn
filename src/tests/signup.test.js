/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('REGISTRATION', () => {
  // CREATE USER
  it('should register user and return a response with status code 200', (done) => {
    const User = {
      firstname: 'ABC',
      lastname: 'ABC',
      email: 'abc@gmail.com',
      password: 'ABC'
    };
    chai.request(app)
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