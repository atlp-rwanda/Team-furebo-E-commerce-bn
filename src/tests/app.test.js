import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

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
  it('should register user and return a response with status code 200', (done) => {
    const User = {
      firstname: 'Niyomwungeri',
      lastname: 'jules',
      email: 'jules@gmail.com',
      password: 'jules'
    };
    chai.request(app)
      .post('/api/register')
      .send(User)
      .end((err, res) => {
        console.log(res.body);
        chai.expect(res).to.have.status(200);
        done();
      });
  });
  it('should not register user and have to return a response with status code 500', (done) => {
    const User = {
      firstname: 'Niyomwungeri',
      lastname: 'jules',
      password: 'jules'
    };
    chai.request(app)
      .post('/api/register')
      .send(User)
      .end((err, res) => {
        console.log(res.body);
        chai.expect(res).to.have.status(500);
        done();
      });
  });
});
